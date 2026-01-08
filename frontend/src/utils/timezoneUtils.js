import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Get list of all timezones
export const getAllTimezones = () => {
    // Popular timezones list
    return [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Toronto',
        'America/Mexico_City',
        'America/Sao_Paulo',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Moscow',
        'Asia/Dubai',
        'Asia/Kolkata',
        'Asia/Shanghai',
        'Asia/Tokyo',
        'Asia/Singapore',
        'Asia/Hong_Kong',
        'Australia/Sydney',
        'Pacific/Auckland',
    ];
};

// Convert UTC date to specific timezone
export const convertToTimezone = (date, timezone) => {
    return dayjs(date).tz(timezone);
};

// Convert timezone date to UTC
export const convertToUTC = (date, timezone) => {
    return dayjs.tz(date, timezone).utc().toISOString();
};

// Format date with timezone
export const formatDateTime = (date, timezone, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).tz(timezone).format(format);
};

// Get current timezone
export const getCurrentTimezone = () => {
    return dayjs.tz.guess();
};
