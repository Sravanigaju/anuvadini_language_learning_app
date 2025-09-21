const mongoose = require('mongoose');
const request = require('supertest');
const Goal = require('../models/Goal');
const DailyRecord = require('../models/DailyRecord');
const UserProfile = require('../models/UserProfile');
const User = require('../models/User');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Mock app for testing
const express = require('express');
const goalRoutes = require('../routes/goalRoutes');
const auth = require('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/goals', goalRoutes);

describe('Daily Goal Tracker - Edge Cases', () => {
    let testUser;
    let testUserProfile;
    let authToken;

    beforeAll(async () => {
        // Connect to test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test_db');
        }

        // Create test user
        testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword',
            timezone: 'Asia/Kolkata'
        });
        await testUser.save();

        // Create test user profile
        testUserProfile = new UserProfile({
            userId: testUser._id,
            firstName: 'Test',
            lastName: 'User',
            gender: 'Other',
            age: 25,
            country: 'India',
            sourceLanguage: 'English',
            totalActiveGoals: 0
        });
        await testUserProfile.save();

        // Mock authentication middleware for testing
        authToken = 'test-token';
        app.use((req, res, next) => {
            if (req.headers.authorization === `Bearer ${authToken}`) {
                req.user = { id: testUser._id };
                req.userTimezone = 'Asia/Kolkata';
                next();
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        });
    });

    afterAll(async () => {
        // Clean up test data
        await Goal.deleteMany({ userId: testUser._id });
        await DailyRecord.deleteMany({ userId: testUser._id });
        await UserProfile.deleteMany({ userId: testUser._id });
        await User.deleteMany({ _id: testUser._id });
        
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    });

    beforeEach(async () => {
        // Clean up before each test
        await Goal.deleteMany({ userId: testUser._id });
        await DailyRecord.deleteMany({ userId: testUser._id });
        await UserProfile.findOneAndUpdate(
            { userId: testUser._id },
            { totalActiveGoals: 0 }
        );
    });

    describe('Edge Case 1: Rapid Toggle Spam (Race Protection)', () => {
        test('should handle concurrent toggle requests without race conditions', async () => {
            // Create a test goal
            const goal = new Goal({
                userId: testUser._id,
                title: 'Test Goal',
                color: '#FF6B6B'
            });
            await goal.save();

            // Update UserProfile totalActiveGoals
            await UserProfile.findOneAndUpdate(
                { userId: testUser._id },
                { totalActiveGoals: 1 }
            );

            // Simulate rapid concurrent toggle requests
            const togglePromises = [];
            const numRequests = 10;

            for (let i = 0; i < numRequests; i++) {
                togglePromises.push(
                    request(app)
                        .post(`/api/goals/${goal._id}/toggle`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .set('X-User-Timezone', 'Asia/Kolkata')
                );
            }

            const responses = await Promise.all(togglePromises);

            // All requests should succeed
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });

            // Final state should be consistent (either completed or not)
            const finalRecord = await DailyRecord.findOne({ 
                userId: testUser._id, 
                date: dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD') 
            });

            expect(finalRecord).toBeTruthy();
            expect(finalRecord.completedGoalIds).toHaveLength(1);
            expect(finalRecord.completedGoalIds[0].toString()).toBe(goal._id.toString());
        });
    });

    describe('Edge Case 2: Toggle for Past Date', () => {
        test('should return 400 when trying to toggle goal for past date', async () => {
            // Create a test goal
            const goal = new Goal({
                userId: testUser._id,
                title: 'Test Goal',
                color: '#FF6B6B'
            });
            await goal.save();

            const yesterday = dayjs().tz('Asia/Kolkata').subtract(1, 'day').format('YYYY-MM-DD');

            const response = await request(app)
                .post(`/api/goals/${goal._id}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .set('X-User-Timezone', 'Asia/Kolkata')
                .send({ date: yesterday });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Only today is editable');
            expect(response.body.message).toContain('Historical data is read-only');
            expect(response.body.requestedDate).toBe(yesterday);
        });

        test('should return 400 when trying to toggle goal for future date', async () => {
            // Create a test goal
            const goal = new Goal({
                userId: testUser._id,
                title: 'Test Goal',
                color: '#FF6B6B'
            });
            await goal.save();

            const tomorrow = dayjs().tz('Asia/Kolkata').add(1, 'day').format('YYYY-MM-DD');

            const response = await request(app)
                .post(`/api/goals/${goal._id}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .set('X-User-Timezone', 'Asia/Kolkata')
                .send({ date: tomorrow });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Only today is editable');
        });
    });

    describe('Edge Case 3: Create/Delete Goal with Existing DailyRecord', () => {
        test('should preserve historical references when deleting goal', async () => {
            // Create a test goal
            const goal = new Goal({
                userId: testUser._id,
                title: 'Test Goal',
                color: '#FF6B6B'
            });
            await goal.save();

            // Create a daily record with the goal completed
            const today = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
            const dailyRecord = new DailyRecord({
                userId: testUser._id,
                date: today,
                completedGoalIds: [goal._id],
                completedSnapshots: [{
                    goalId: goal._id,
                    title: goal.title,
                    completedAt: new Date()
                }]
            });
            await dailyRecord.save();

            // Delete (archive) the goal
            const deleteResponse = await request(app)
                .delete(`/api/goals/${goal._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(deleteResponse.status).toBe(200);

            // Verify goal is archived
            const archivedGoal = await Goal.findById(goal._id);
            expect(archivedGoal.archived).toBe(true);

            // Verify historical reference is preserved
            const recordAfterDelete = await DailyRecord.findOne({ 
                userId: testUser._id, 
                date: today 
            });
            expect(recordAfterDelete.completedGoalIds).toHaveLength(1);
            expect(recordAfterDelete.completedGoalIds[0].toString()).toBe(goal._id.toString());
            expect(recordAfterDelete.completedSnapshots).toHaveLength(1);
            expect(recordAfterDelete.completedSnapshots[0].goalId.toString()).toBe(goal._id.toString());
        });
    });

    describe('Edge Case 4: Timezone Boundary Scenarios', () => {
        test('should correctly compute today across different timezones', async () => {
            // Test with different timezones
            const timezones = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
            
            for (const timezone of timezones) {
                const todayInTimezone = dayjs().tz(timezone).format('YYYY-MM-DD');
                
                const response = await request(app)
                    .get('/api/goals/date')
                    .set('Authorization', `Bearer ${authToken}`)
                    .set('X-User-Timezone', timezone);

                expect(response.status).toBe(200);
                expect(response.body.editable).toBe(true);
                expect(response.body.date).toBe(todayInTimezone);
            }
        });

        test('should handle timezone boundary at midnight', async () => {
            // Simulate user in timezone where it's just before midnight
            const timezone = 'Asia/Kolkata';
            const today = dayjs().tz(timezone).format('YYYY-MM-DD');
            
            const response = await request(app)
                .get('/api/goals/date')
                .set('Authorization', `Bearer ${authToken}`)
                .set('X-User-Timezone', timezone);

            expect(response.status).toBe(200);
            expect(response.body.date).toBe(today);
            expect(response.body.editable).toBe(true);
        });
    });

    describe('Edge Case 5: Progress Queries with Missing Records', () => {
        test('should return zero counts for missing days in date range', async () => {
            // Create some goals
            const goals = [];
            for (let i = 0; i < 3; i++) {
                const goal = new Goal({
                    userId: testUser._id,
                    title: `Test Goal ${i + 1}`,
                    color: '#FF6B6B'
                });
                goals.push(await goal.save());
            }

            // Update UserProfile totalActiveGoals
            await UserProfile.findOneAndUpdate(
                { userId: testUser._id },
                { totalActiveGoals: 3 }
            );

            // Create daily records for only some days
            const today = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');
            const yesterday = dayjs().tz('Asia/Kolkata').subtract(1, 'day').format('YYYY-MM-DD');
            
            // Record for today (2 goals completed)
            const todayRecord = new DailyRecord({
                userId: testUser._id,
                date: today,
                completedGoalIds: [goals[0]._id, goals[1]._id],
                completedSnapshots: [
                    { goalId: goals[0]._id, title: goals[0].title, completedAt: new Date() },
                    { goalId: goals[1]._id, title: goals[1].title, completedAt: new Date() }
                ]
            });
            await todayRecord.save();

            // Record for yesterday (1 goal completed)
            const yesterdayRecord = new DailyRecord({
                userId: testUser._id,
                date: yesterday,
                completedGoalIds: [goals[0]._id],
                completedSnapshots: [
                    { goalId: goals[0]._id, title: goals[0].title, completedAt: new Date() }
                ]
            });
            await yesterdayRecord.save();

            // Request progress for last 5 days (should include missing days)
            const endDate = today;
            const startDate = dayjs().tz('Asia/Kolkata').subtract(4, 'day').format('YYYY-MM-DD');

            const response = await request(app)
                .get(`/api/goals/progress?start=${startDate}&end=${endDate}`)
                .set('Authorization', `Bearer ${authToken}`)
                .set('X-User-Timezone', 'Asia/Kolkata');

            expect(response.status).toBe(200);
            expect(response.body.dates).toHaveLength(5);
            expect(response.body.counts).toHaveLength(5);
            expect(response.body.totalGoals).toBe(3);

            // Verify missing days have zero counts
            const dateCountMap = {};
            response.body.dates.forEach((date, index) => {
                dateCountMap[date] = response.body.counts[index];
            });

            expect(dateCountMap[today]).toBe(2);
            expect(dateCountMap[yesterday]).toBe(1);
            
            // Missing days should have 0 counts
            Object.keys(dateCountMap).forEach(date => {
                if (date !== today && date !== yesterday) {
                    expect(dateCountMap[date]).toBe(0);
                }
            });
        });
    });

    describe('Edge Case 6: Non-existent Goal Operations', () => {
        test('should return 404 when toggling non-existent goal', async () => {
            const fakeGoalId = new mongoose.Types.ObjectId();
            
            const response = await request(app)
                .post(`/api/goals/${fakeGoalId}/toggle`)
                .set('Authorization', `Bearer ${authToken}`)
                .set('X-User-Timezone', 'Asia/Kolkata');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Goal not found');
        });

        test('should return 404 when updating non-existent goal', async () => {
            const fakeGoalId = new mongoose.Types.ObjectId();
            
            const response = await request(app)
                .put(`/api/goals/${fakeGoalId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated Title' });

            expect(response.status).toBe(404);
        });

        test('should return 404 when deleting non-existent goal', async () => {
            const fakeGoalId = new mongoose.Types.ObjectId();
            
            const response = await request(app)
                .delete(`/api/goals/${fakeGoalId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });
});
