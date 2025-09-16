/**
 * Utility functions for managing URL query parameters
 */

/**
 * Parse URL search params into an object
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Parsed query parameters
 */
export function parseQueryParams(searchParams) {
  const params = {};
  
  // Date range
  if (searchParams.get('start_date')) {
    params.start_date = searchParams.get('start_date');
  }
  if (searchParams.get('end_date')) {
    params.end_date = searchParams.get('end_date');
  }
  
  // Entity IDs
  if (searchParams.get('entity_ids')) {
    params.entity_ids = searchParams.get('entity_ids');
  }
  
  // UI state
  if (searchParams.get('tab')) {
    params.tab = searchParams.get('tab');
  }
  if (searchParams.get('pareto')) {
    params.pareto = searchParams.get('pareto');
  }
  
  return params;
}

/**
 * Convert query parameters object to URL search params
 * @param {Object} params - Query parameters object
 * @returns {URLSearchParams} URL search parameters
 */
export function buildQueryParams(params) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, value.toString());
    }
  });
  
  return searchParams;
}

/**
 * Update URL with new query parameters
 * @param {Object} newParams - New parameters to add/update
 * @param {Object} currentParams - Current parameters
 * @param {Function} navigate - Navigation function
 */
export function updateQueryParams(newParams, currentParams = {}, navigate) {
  const updatedParams = { ...currentParams, ...newParams };
  const searchParams = buildQueryParams(updatedParams);
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  
  if (navigate) {
    navigate(newUrl, { replace: true });
  } else {
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Get default date range (current year)
 * @returns {Object} Default date range
 */
export function getDefaultDateRange() {
  const currentYear = new Date().getFullYear();
  return {
    start_date: `${currentYear}-01-01`,
    end_date: `${currentYear}-12-31`
  };
}

/**
 * Validate date range
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {boolean} Whether date range is valid
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end && start.getFullYear() >= 2020 && end.getFullYear() <= 2030;
}

/**
 * Parse entity IDs string to array
 * @param {string} entityIdsString - Comma-separated entity IDs
 * @returns {Array<number>} Array of entity IDs
 */
export function parseEntityIds(entityIdsString) {
  if (!entityIdsString) return [];
  
  return entityIdsString
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id));
}

/**
 * Convert entity IDs array to string
 * @param {Array<number>} entityIds - Array of entity IDs
 * @returns {string} Comma-separated entity IDs
 */
export function stringifyEntityIds(entityIds) {
  return entityIds.filter(id => !isNaN(id)).join(',');
}

/**
 * Get query parameters from current URL
 * @returns {Object} Current query parameters
 */
export function getCurrentQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return parseQueryParams(searchParams);
}

/**
 * Clear all query parameters
 * @param {Function} navigate - Navigation function
 */
export function clearQueryParams(navigate) {
  if (navigate) {
    navigate(window.location.pathname, { replace: true });
  } else {
    window.history.replaceState({}, '', window.location.pathname);
  }
}