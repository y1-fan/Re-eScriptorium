/**
 * Locale-independent date formatting.
 *
 * The whole interface uses dotted dates: 2026.10.20. Datetimes keep the same
 * date part and append a 24h time: 2026.10.20 14:05.
 */

function pad(value) {
    return String(value).padStart(2, "0");
}

function toDate(value) {
    if (!value) {
        return null;
    }
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a date as YYYY.MM.DD. */
export function formatDate(value) {
    const date = toDate(value);
    if (!date) {
        return "";
    }
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** Format a date and time as YYYY.MM.DD HH:mm. */
export function formatDateTime(value) {
    const date = toDate(value);
    if (!date) {
        return "";
    }
    return `${formatDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default formatDate;
