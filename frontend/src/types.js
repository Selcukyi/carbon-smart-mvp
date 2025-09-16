/**
 * @typedef {Object} DateRange
 * @property {string} start - Start date in YYYY-MM-DD format
 * @property {string} end - End date in YYYY-MM-DD format
 */

/**
 * @typedef {Object} Paginated
 * @property {Array} items - Array of items
 * @property {number} total - Total number of items
 * @property {number} page - Current page number
 * @property {number} page_size - Number of items per page
 */

/**
 * @typedef {Object} EntityRef
 * @property {number} id - Entity ID
 * @property {string} name - Entity name
 */

/**
 * @typedef {Object} KPI
 * @property {string} name - KPI name
 * @property {number} value - KPI value
 * @property {string} unit - Unit of measurement
 * @property {number} [change_percent] - Percentage change from previous period
 * @property {string} [trend] - Trend direction: 'up', 'down', 'stable'
 */

/**
 * @typedef {Object} ScopeShare
 * @property {string} scope - Scope name (e.g., 'Scope 1', 'Scope 2', 'Scope 3')
 * @property {number} percentage - Percentage of total emissions
 * @property {number} emissions - Emissions value
 * @property {string} color - Color code for visualization
 */

/**
 * @typedef {Object} CategoryEmission
 * @property {string} category - Category name
 * @property {number} emissions - Emissions value
 * @property {number} percentage - Percentage of total emissions
 * @property {string} scope - Associated scope
 * @property {string} [trend] - Trend direction: 'up', 'down', 'stable'
 */

/**
 * @typedef {Object} Allowance
 * @property {number} entity_id - Entity ID
 * @property {string} entity_name - Entity name
 * @property {number} allocated - Allocated allowances
 * @property {number} used - Used allowances
 * @property {number} remaining - Remaining allowances
 * @property {number} price - Price per allowance
 * @property {number} value - Total value
 */

/**
 * @typedef {Object} IntensityPoint
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {number} intensity - Carbon intensity value
 * @property {number} revenue - Revenue value
 * @property {number} emissions - Emissions value
 */

/**
 * @typedef {Object} AIExplainRequest
 * @property {string} context - Context for explanation
 * @property {Object} params - Additional parameters
 * @property {string} [question] - Specific question
 */

/**
 * @typedef {Object} AIExplainResponse
 * @property {string} explanation - AI explanation text
 * @property {number} confidence - Confidence score (0-1)
 * @property {Array<string>} sources - Source references
 * @property {Array<string>} recommendations - AI recommendations
 */

/**
 * @typedef {Object} QueryParams
 * @property {string} [start_date] - Start date filter
 * @property {string} [end_date] - End date filter
 * @property {string} [entity_ids] - Comma-separated entity IDs
 * @property {string} [tab] - Active tab
 * @property {string} [pareto] - Pareto analysis filter
 */

/**
 * @typedef {Object} Facility
 * @property {number} id - Facility ID
 * @property {string} name - Facility name
 * @property {string} city - City name
 * @property {string} country - Country name
 */

/**
 * @typedef {Object} ComplianceStatus
 * @property {string} eu_ets_status - EU ETS compliance status
 * @property {number} eu_ets_deficit - EU ETS deficit amount
 * @property {string} iso_14064_status - ISO 14064 compliance status
 * @property {string} ghg_protocol_status - GHG Protocol compliance status
 * @property {string} next_audit_date - Next audit date
 * @property {number} compliance_score - Overall compliance score
 * @property {Array<Object>} risks - Compliance risks
 */

// Export types for use in other files
export const TYPES = {
  DateRange: 'DateRange',
  Paginated: 'Paginated',
  EntityRef: 'EntityRef',
  KPI: 'KPI',
  ScopeShare: 'ScopeShare',
  CategoryEmission: 'CategoryEmission',
  Allowance: 'Allowance',
  IntensityPoint: 'IntensityPoint',
  AIExplainRequest: 'AIExplainRequest',
  AIExplainResponse: 'AIExplainResponse',
  QueryParams: 'QueryParams',
  Facility: 'Facility',
  ComplianceStatus: 'ComplianceStatus'
};