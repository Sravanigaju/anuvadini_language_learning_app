const Goal = require('../models/Goal');
const DailyRecord = require('../models/DailyRecord');
const UserProfile = require('../models/UserProfile');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

class GoalService {
    /**
     * Update totalActiveGoals count in UserProfile
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    static async updateTotalActiveGoals(userId) {
        try {
            const activeGoalsCount = await Goal.countDocuments({ userId, archived: false });
            await UserProfile.findOneAndUpdate(
                { userId },
                { $set: { totalActiveGoals: activeGoalsCount } },
                { upsert: false }
            );
        } catch (error) {
            console.error('Error updating totalActiveGoals:', error);
            // Don't throw error to avoid breaking main functionality
        }
    }

    /**
     * Get user's timezone - fallback to Asia/Kolkata if not available
     * @param {string} userTimezone - User's stored IANA timezone
     * @returns {string} Timezone string
     */
    static getUserTimezone(userTimezone = null) {
        return userTimezone || 'Asia/Kolkata';
    }

    /**
     * Get today's date in user's timezone (YYYY-MM-DD format)
     * @param {string} userTimezone - User's timezone
     * @returns {string} Today's date string
     */
    static getTodayDate(userTimezone = null) {
        const timezone = this.getUserTimezone(userTimezone);
        return dayjs().tz(timezone).format('YYYY-MM-DD');
    }

    /**
     * Validate if a date is today in user's timezone
     * @param {string} dateStr - Date string to validate (YYYY-MM-DD)
     * @param {string} userTimezone - User's timezone
     * @returns {boolean} True if date is today
     */
    static isToday(dateStr, userTimezone = null) {
        const today = this.getTodayDate(userTimezone);
        return dateStr === today;
    }

    /**
     * Business Rule 1: All completion data is date-scoped
     * Business Rule 2: Only today is editable
     * Business Rule 3: Server decides "today" using user's timezone
     * @param {string} userId - User ID
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @param {string} userTimezone - User's timezone
     * @throws {Error} If date is not today
     */
    static validateEditableDate(userId, dateStr, userTimezone = null) {
        if (!this.isToday(dateStr, userTimezone)) {
            throw new Error('Only today\'s goals can be modified. Historical data is read-only.');
        }
    }

    /**
     * Get user's active goals (non-archived)
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of active goals
     */
    static async getActiveGoals(userId) {
        return await Goal.find({ 
            userId, 
            archived: false 
        }).sort({ order: 1, createdAt: 1 });
    }

    /**
     * Get daily record for a specific date
     * @param {string} userId - User ID
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @returns {Promise<Object|null>} Daily record or null
     */
    static async getDailyRecord(userId, dateStr) {
        return await DailyRecord.findOne({ userId, date: dateStr })
            .populate('completedGoalIds', 'title color order')
            .populate('completedSnapshots.goalId', 'title color order');
    }

    /**
     * Get or create today's daily record
     * @param {string} userId - User ID
     * @param {string} userTimezone - User's timezone
     * @returns {Promise<Object>} Today's daily record
     */
    static async getOrCreateTodayRecord(userId, userTimezone = null) {
        const today = this.getTodayDate(userTimezone);
        let record = await this.getDailyRecord(userId, today);
        
        if (!record) {
            record = new DailyRecord({
                userId,
                date: today,
                completedGoalIds: [],
                completedSnapshots: []
            });
            await record.save();
        }
        
        return record;
    }

    /**
     * Toggle goal completion for today with race protection
     * @param {string} userId - User ID
     * @param {string} goalId - Goal ID to toggle
     * @param {string} userTimezone - User's timezone
     * @returns {Promise<Object>} Updated daily record with completion status
     */
    static async toggleGoalCompletion(userId, goalId, userTimezone = null) {
        const today = this.getTodayDate(userTimezone);
        
        // Business Rule 2 & 3: Validate that we're only editing today
        this.validateEditableDate(userId, today, userTimezone);
        
        // Get the goal to ensure it exists and belongs to user
        const goal = await Goal.findOne({ _id: goalId, userId, archived: false });
        if (!goal) {
            throw new Error('Goal not found or access denied');
        }
        
        // Use atomic operations to prevent race conditions
        const updateResult = await DailyRecord.findOneAndUpdate(
            { userId, date: today },
            [
                {
                    $set: {
                        completedGoalIds: {
                            $cond: {
                                if: { $in: [goalId, '$completedGoalIds'] },
                                then: { $setDifference: ['$completedGoalIds', [goalId]] },
                                else: { $concatArrays: ['$completedGoalIds', [goalId]] }
                            }
                        },
                        completedSnapshots: {
                            $cond: {
                                if: { $in: [goalId, '$completedGoalIds'] },
                                then: {
                                    $filter: {
                                        input: '$completedSnapshots',
                                        as: 'snapshot',
                                        cond: { $ne: ['$$snapshot.goalId', goalId] }
                                    }
                                },
                                else: {
                                    $concatArrays: [
                                        '$completedSnapshots',
                                        [{
                                            goalId: goalId,
                                            title: goal.title,
                                            completedAt: new Date()
                                        }]
                                    ]
                                }
                            }
                        }
                    }
                }
            ],
            { new: true, upsert: true }
        );
        
        // If upsert created a new document, set the userId and date
        if (!updateResult.userId) {
            updateResult.userId = userId;
            updateResult.date = today;
            await updateResult.save();
        }
        
        // Return completion status for frontend
        const isCompleted = updateResult.completedGoalIds.some(id => 
            id.toString() === goalId.toString()
        );
        
        return {
            record: updateResult,
            done: isCompleted,
            goalId: goalId
        };
    }

    /**
     * Business Rule 5: Check if all active goals were completed on a date
     * @param {string} userId - User ID
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @returns {Promise<boolean>} True if all active goals completed
     */
    static async isDayCompleted(userId, dateStr) {
        const [activeGoals, dailyRecord] = await Promise.all([
            this.getActiveGoals(userId),
            this.getDailyRecord(userId, dateStr)
        ]);
        
        if (activeGoals.length === 0) {
            return false; // No goals to complete
        }
        
        if (!dailyRecord || dailyRecord.completedGoalIds.length === 0) {
            return false; // No completions for this date
        }
        
        // Check if all active goals are completed
        const completedGoalIds = dailyRecord.completedGoalIds.map(id => id.toString());
        const activeGoalIds = activeGoals.map(goal => goal._id.toString());
        
        return activeGoalIds.every(goalId => completedGoalIds.includes(goalId));
    }

    /**
     * Calculate completed daily stages within a date range
     * @param {string} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<number>} Count of completed days
     */
    static async calculateCompletedStages(userId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const completedDays = [];
        
        // Iterate through each day in the range
        const current = new Date(start);
        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];
            if (await this.isDayCompleted(userId, dateStr)) {
                completedDays.push(dateStr);
            }
            current.setDate(current.getDate() + 1);
        }
        
        return completedDays.length;
    }

    /**
     * Get historical daily records (read-only)
     * @param {string} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Array>} Array of daily records
     */
    static async getHistoricalRecords(userId, startDate, endDate) {
        return await DailyRecord.find({
            userId,
            date: { $gte: startDate, $lte: endDate }
        })
        .sort({ date: -1 })
        .populate('completedGoalIds', 'title color order')
        .populate('completedSnapshots.goalId', 'title color order');
    }

    /**
     * Create a new goal for user
     * @param {string} userId - User ID
     * @param {Object} goalData - Goal data
     * @returns {Promise<Object>} Created goal
     */
    static async createGoal(userId, goalData) {
        const lastGoal = await Goal.findOne({ userId })
            .sort({ order: -1 })
            .limit(1);
        
        const goal = new Goal({
            userId,
            title: goalData.title,
            color: goalData.color || '#FF6B6B',
            order: lastGoal ? lastGoal.order + 1 : 0,
            archived: false
        });
        
        const savedGoal = await goal.save();
        
        // Update totalActiveGoals count in UserProfile
        await this.updateTotalActiveGoals(userId);
        
        return savedGoal;
    }

    /**
     * Update goal details (only metadata, not completion status)
     * @param {string} userId - User ID
     * @param {string} goalId - Goal ID
     * @param {Object} updates - Updates to apply
     * @returns {Promise<Object|null>} Updated goal
     */
    static async updateGoal(userId, goalId, updates) {
        const allowedUpdates = ['title', 'color', 'order', 'archived'];
        const filteredUpdates = {};
        
        // Check if archived status is being changed
        const isArchivedUpdate = updates.archived !== undefined;
        
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                filteredUpdates[key] = updates[key];
            }
        }
        
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId, userId },
            filteredUpdates,
            { new: true }
        );
        
        if (updatedGoal && isArchivedUpdate) {
            // Update totalActiveGoals count in UserProfile when archived status changes
            await this.updateTotalActiveGoals(userId);
        }
        
        return updatedGoal;
    }

    /**
     * Delete a goal (soft delete by archiving) with historical reference preservation
     * Edge Case: Create/delete goal while DailyRecord exists
     * @param {string} userId - User ID
     * @param {string} goalId - Goal ID
     * @returns {Promise<Object|null>} Updated goal
     */
    static async deleteGoal(userId, goalId) {
        // First, archive the goal (soft delete)
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId, userId },
            { archived: true },
            { new: true }
        );
        
        if (updatedGoal) {
            // Update totalActiveGoals count in UserProfile
            await this.updateTotalActiveGoals(userId);
            
            // Edge Case: Handle existing DailyRecords
            // We prefer to keep historical references rather than remove them
            // This preserves the user's completion history even after goal deletion
            
            // Note: We don't remove the goalId from DailyRecord.completedGoalIds
            // because that would break historical data integrity.
            // The goal remains in the database (just archived) so references are still valid.
            
            // If we wanted to clean up references, we would do:
            // await DailyRecord.updateMany(
            //     { userId },
            //     { 
            //         $pull: { 
            //             completedGoalIds: goalId,
            //             completedSnapshots: { goalId: goalId }
            //         }
            //     }
            // );
            // But we prefer to preserve history.
        }
        
        return updatedGoal;
    }

    /**
     * Bulk toggle all goals for today (mark all done/undone)
     * @param {string} userId - User ID
     * @param {boolean} markDone - Whether to mark all as done (true) or undone (false)
     * @param {string} userTimezone - User's timezone
     * @returns {Promise<Object>} Result with updated record and affected goal IDs
     */
    static async bulkToggleGoals(userId, markDone = true, userTimezone = null) {
        const today = this.getTodayDate(userTimezone);
        
        // Business Rule: Validate that we're only editing today
        this.validateEditableDate(userId, today, userTimezone);
        
        // Get all active goals for the user
        const activeGoals = await this.getActiveGoals(userId);
        if (activeGoals.length === 0) {
            return {
                record: null,
                affectedGoalIds: [],
                markedDone: markDone,
                message: 'No active goals found'
            };
        }
        
        const goalIds = activeGoals.map(goal => goal._id);
        
        if (markDone) {
            // Mark all goals as done
            const updateResult = await DailyRecord.findOneAndUpdate(
                { userId, date: today },
                {
                    $set: {
                        completedGoalIds: goalIds,
                        completedSnapshots: activeGoals.map(goal => ({
                            goalId: goal._id,
                            title: goal.title,
                            completedAt: new Date()
                        }))
                    }
                },
                { new: true, upsert: true }
            );
            
            // If upsert created a new document, set the userId and date
            if (!updateResult.userId) {
                updateResult.userId = userId;
                updateResult.date = today;
                await updateResult.save();
            }
            
            return {
                record: updateResult,
                affectedGoalIds: goalIds,
                markedDone: true,
                message: `Marked ${goalIds.length} goals as completed`
            };
        } else {
            // Mark all goals as undone
            const updateResult = await DailyRecord.findOneAndUpdate(
                { userId, date: today },
                {
                    $set: {
                        completedGoalIds: [],
                        completedSnapshots: []
                    }
                },
                { new: true, upsert: true }
            );
            
            // If upsert created a new document, set the userId and date
            if (!updateResult.userId) {
                updateResult.userId = userId;
                updateResult.date = today;
                await updateResult.save();
            }
            
            return {
                record: updateResult,
                affectedGoalIds: goalIds,
                markedDone: false,
                message: `Marked ${goalIds.length} goals as incomplete`
            };
        }
    }
}

module.exports = GoalService;
