/**
 * Timezone Middleware
 * Ensures timezone is available for goal-related operations
 */

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Middleware to validate and set timezone for request
 * Priority order:
 * 1. User's stored timezone (req.user.timezone)
 * 2. X-User-Timezone header
 * 3. Reject request if no timezone can be determined
 */
const timezoneMiddleware = (req, res, next) => {
    // Skip timezone validation for non-goal routes or if user is not authenticated
    if (!req.user || !req.path.includes('/goals')) {
        return next();
    }

    let userTimezone = null;

    // Priority 1: Use user's stored timezone
    if (req.user.timezone) {
        userTimezone = req.user.timezone;
    }
    // Priority 2: Use timezone from header
    else if (req.headers['x-user-timezone']) {
        const headerTimezone = req.headers['x-user-timezone'];
        // Validate the header timezone format
        if (/^[A-Za-z]+\/[A-Za-z_]+$/.test(headerTimezone)) {
            userTimezone = headerTimezone;
        }
    }

    // If no timezone can be determined, reject the request
    if (!userTimezone) {
        return res.status(400).json({ 
            error: 'Timezone is required. Please set your timezone in profile or send X-User-Timezone header.' 
        });
    }

    // Validate that the timezone is valid by trying to use it
    try {
        const testDate = dayjs().tz(userTimezone);
        if (!testDate.isValid()) {
            throw new Error('Invalid timezone');
        }
    } catch (error) {
        return res.status(400).json({ 
            error: `Invalid timezone: ${userTimezone}. Please use a valid IANA timezone (e.g., Asia/Kolkata, America/New_York).` 
        });
    }

    // Attach timezone to request for use in controllers
    req.userTimezone = userTimezone;
    
    next();
};

module.exports = timezoneMiddleware;
