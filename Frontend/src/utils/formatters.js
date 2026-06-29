/**
 * Shared utility helper functions for data formatting.
 * Ensures consistent presentation of currency, dates, and percentages
 * across all modules (Attendance, Expenses, Referrals, Tutorials).
 */

/**
 * Formats a numeric value into USD currency format (e.g. $1,234.56).
 * @param {number|string} value - The numeric value to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (value) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericValue);
};

/**
 * Formats a date string or object into a standardized readable format (e.g. Oct 24, 2026).
 * @param {Date|string} date - The date to format.
 * @param {Object} options - Custom options for formatting.
 * @returns {string} The formatted date string.
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
};

/**
 * Formats a decimal or percentage number into a standard percentage string (e.g. 94.2%).
 * @param {number|string} value - The value to format.
 * @param {boolean} isDecimal - If true, treats 0.94 as 94%. If false, treats 94 as 94%.
 * @returns {string} The formatted percentage string.
 */
export const formatPercentage = (value, isDecimal = false) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '0%';
  
  const multiplier = isDecimal ? 100 : 1;
  return `${(numericValue * multiplier).toFixed(1).replace(/\.0$/, '')}%`;
};
