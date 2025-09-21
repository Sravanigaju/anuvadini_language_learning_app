const express = require('express');
const router = express.Router();
const GoalController = require('../controllers/goalController');
const timezoneMiddleware = require('../middleware/timezoneMiddleware');

// All routes require authentication (handled by middleware)
// Apply timezone middleware to all goal routes
router.use(timezoneMiddleware);

/**
 * 1) GET /api/goals/date?date=YYYY-MM-DD
 * Return goals for the given date, with done flag and editable boolean
 * If date omitted, server uses today in user timezone
 */
router.get('/date', GoalController.getGoalsByDate);

/**
 * 2) POST /api/goals/:goalId/toggle
 * Toggle completion for today (server uses user timezone)
 * Body may be { date: 'YYYY-MM-DD' } (optional) but server will only accept date === today
 */
router.post('/:goalId/toggle', GoalController.toggleGoalCompletion);

/**
 * 3) POST /api/goals/bulk-toggle
 * Bulk toggle all goals for today (mark all done/undone)
 * Body: { markDone: boolean } (optional, defaults to true)
 */
router.post('/bulk-toggle', GoalController.bulkToggleGoals);

/**
 * 4) GET /api/goals/progress?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Return counts for date range and completedDaysAll
 * Defaults: last 12 days if start omitted
 */
router.get('/progress', GoalController.getGoalProgress);

/**
 * 5) GET /api/goals
 * Return metadata list of goals (for UI edit/create screen)
 */
router.get('/', GoalController.getAllGoals);

/**
 * 6) POST /api/goals
 * Create new goal (title, color)
 */
router.post('/', GoalController.createGoal);

/**
 * 7) PUT /api/goals/:id
 * Edit metadata
 */
router.put('/:id', GoalController.updateGoal);

/**
 * 8) DELETE /api/goals/:id
 * Archive or delete (recommend archive to preserve history)
 */
router.delete('/:id', GoalController.deleteGoal);

module.exports = router;
