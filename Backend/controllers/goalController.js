const GoalService = require('../services/goalService');
const Goal = require('../models/Goal');
const DailyRecord = require('../models/DailyRecord');
const UserProfile = require('../models/UserProfile');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

class GoalController {
    /**
     * 1) GET /api/goals/date?date=YYYY-MM-DD
     * Return goals for the given date, with done flag and editable boolean
     */
    static async getGoalsByDate(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const userTimezone = req.userTimezone; // Set by middleware
            const requestedDate = req.query.date || GoalService.getTodayDate(userTimezone);
            
            // Get user's active goals
            const activeGoals = await GoalService.getActiveGoals(userId);
            
            // Get daily record for the requested date
            const dailyRecord = await GoalService.getDailyRecord(userId, requestedDate);
            
            // Check if the date is editable (today only)
            const isEditable = GoalService.isToday(requestedDate, userTimezone);
            
            // Map goals with done status
            const goalsWithStatus = activeGoals.map(goal => {
                const isCompleted = dailyRecord && 
                    dailyRecord.completedGoalIds.some(id => 
                        id.toString() === goal._id.toString()
                    );
                
                return {
                    _id: goal._id,
                    title: goal.title,
                    color: goal.color,
                    order: goal.order,
                    done: isCompleted
                };
            });
            
            // Get total active goals count for frontend percent calculation
            const userProfile = await UserProfile.findOne({ userId });
            const totalGoals = userProfile ? userProfile.totalActiveGoals : activeGoals.length;
            
            res.json({
                date: requestedDate,
                editable: isEditable,
                goals: goalsWithStatus,
                totalGoals: totalGoals
            });
            
        } catch (error) {
            console.error('Error in getGoalsByDate:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 2) POST /api/goals/:goalId/toggle
     * Toggle completion for today (server uses user timezone)
     * Use atomic updates to prevent race conditions
     */
    static async toggleGoalCompletion(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const goalId = req.params.goalId;
            const userTimezone = req.userTimezone; // Set by middleware
            const today = GoalService.getTodayDate(userTimezone);
            const targetDate = req.body.date || today;
            
            // Validate that we're only editing today (Edge Case: Toggle for past date)
            if (targetDate !== today) {
                return res.status(400).json({ 
                    error: 'Only today is editable',
                    message: 'Historical data is read-only. You can only modify goals for today.',
                    requestedDate: targetDate,
                    today: today
                });
            }
            
            // Use atomic toggle operation with race protection
            const result = await GoalService.toggleGoalCompletion(userId, goalId, userTimezone);
            
            res.json({ 
                goalId: result.goalId,
                date: today,
                done: result.done
            });
            
        } catch (error) {
            console.error('Error in toggleGoalCompletion:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 3) POST /api/goals/bulk-toggle
     * Bulk toggle all goals for today (mark all done/undone)
     */
    static async bulkToggleGoals(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const userTimezone = req.userTimezone; // Set by middleware
            const { markDone = true } = req.body; // Default to marking all as done
            
            const result = await GoalService.bulkToggleGoals(userId, markDone, userTimezone);
            
            res.json({
                date: result.record ? result.record.date : GoalService.getTodayDate(userTimezone),
                affectedGoalIds: result.affectedGoalIds,
                markedDone: result.markedDone,
                message: result.message
            });
            
        } catch (error) {
            console.error('Error in bulkToggleGoals:', error);
            
            // Handle specific error cases with appropriate status codes
            if (error.message.includes('Only today\'s goals can be modified')) {
                return res.status(400).json({
                    error: 'Historical data modification not allowed',
                    message: error.message
                });
            }
            
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 4) GET /api/goals/progress?start=YYYY-MM-DD&end=YYYY-MM-DD
     * Return counts for date range and completedDaysAll
     * Server-side calculation for completedDailyStages
     */
    static async getGoalProgress(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const userTimezone = req.userTimezone; // Set by middleware
            
            // Calculate date range (default: last 12 days)
            const endDate = req.query.end || GoalService.getTodayDate(userTimezone);
            const startDate = req.query.start || this.getDefaultStartDate(endDate, 12);
            
            // Step 1: Get total goals count from cached UserProfile
            const userProfile = await UserProfile.findOne({ userId });
            const totalGoals = userProfile ? userProfile.totalActiveGoals : 0;
            
            // Fallback to count if UserProfile doesn't have the field or is 0
            let fallbackTotalGoals = 0;
            if (totalGoals === 0) {
                const activeGoals = await GoalService.getActiveGoals(userId);
                fallbackTotalGoals = activeGoals.length;
                
                // Update UserProfile with the correct count
                if (userProfile && fallbackTotalGoals > 0) {
                    userProfile.totalActiveGoals = fallbackTotalGoals;
                    await userProfile.save();
                }
            }
            
            const finalTotalGoals = totalGoals > 0 ? totalGoals : fallbackTotalGoals;
            
            // Step 2: Get historical records for the date range
            const historicalRecords = await GoalService.getHistoricalRecords(userId, startDate, endDate);
            
            // Generate date array and counts
            const dates = [];
            const counts = [];
            const currentDate = new Date(startDate);
            const endDateTime = new Date(endDate);
            
            // Edge Case: Progress for date range with missing records returns zero counts
            while (currentDate <= endDateTime) {
                const dateStr = currentDate.toISOString().split('T')[0];
                dates.push(dateStr);
                
                const record = historicalRecords.find(r => r.date === dateStr);
                // If no record exists for this date, count is 0 (Edge Case handling)
                const count = record ? record.completedGoalIds.length : 0;
                counts.push(count);
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Step 3: Calculate completedDailyStages
            // A date counts toward completedDailyStages if completedGoalIds.length >= finalTotalGoals
            let completedDaysAll = 0;
            
            if (finalTotalGoals > 0) {
                // For each date in range, check if all goals were completed
                for (const dateStr of dates) {
                    const record = historicalRecords.find(r => r.date === dateStr);
                    if (record && record.completedGoalIds.length >= finalTotalGoals) {
                        completedDaysAll++;
                    }
                }
            }
            
            res.json({
                dates: dates,
                counts: counts,
                totalGoals: finalTotalGoals,
                completedDaysAll: completedDaysAll
            });
            
        } catch (error) {
            console.error('Error in getGoalProgress:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 4) GET /api/goals
     * Return metadata list of goals (for UI edit/create screen)
     */
    static async getAllGoals(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            
            const goals = await Goal.find({ userId })
                .sort({ order: 1, createdAt: 1 })
                .select('title color order archived createdAt');
            
            res.json(goals);
            
        } catch (error) {
            console.error('Error in getAllGoals:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 5) POST /api/goals
     * Create new goal (title, color)
     */
    static async createGoal(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const { title, color } = req.body;
            
            if (!title || !title.trim()) {
                return res.status(400).json({ error: 'Goal title is required' });
            }
            
            const goal = await GoalService.createGoal(userId, {
                title: title.trim(),
                color: color || '#FF6B6B'
            });
            
            res.status(201).json(goal);
            
        } catch (error) {
            console.error('Error in createGoal:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 6) PUT /api/goals/:id
     * Edit metadata
     */
    static async updateGoal(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const goalId = req.params.id;
            const { title, color, order, archived } = req.body;
            
            const updates = {};
            if (title !== undefined) updates.title = title.trim();
            if (color !== undefined) updates.color = color;
            if (order !== undefined) updates.order = order;
            if (archived !== undefined) updates.archived = archived;
            
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'No valid updates provided' });
            }
            
            const goal = await GoalService.updateGoal(userId, goalId, updates);
            
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            
            res.json(goal);
            
        } catch (error) {
            console.error('Error in updateGoal:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * 7) DELETE /api/goals/:id
     * Archive or delete (recommend archive to preserve history)
     */
    static async deleteGoal(req, res) {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const goalId = req.params.id;
            
            const goal = await GoalService.deleteGoal(userId, goalId);
            
            if (!goal) {
                return res.status(404).json({ error: 'Goal not found' });
            }
            
            res.json({ 
                message: 'Goal archived successfully',
                goal: goal 
            });
            
        } catch (error) {
            console.error('Error in deleteGoal:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Helper method to get default start date
     */
    static getDefaultStartDate(endDateStr, daysBack) {
        const endDate = new Date(endDateStr);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - daysBack + 1);
        return startDate.toISOString().split('T')[0];
    }
}

module.exports = GoalController;
