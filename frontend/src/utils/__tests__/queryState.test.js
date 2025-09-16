/**
 * Tests for queryState utility functions
 */

import {
  parseQueryParams,
  buildQueryParams,
  updateQueryParams,
  getDefaultDateRange,
  validateDateRange,
  parseEntityIds,
  stringifyEntityIds,
  getCurrentQueryParams,
  queryState,
  clearQueryParams
} from '../queryState.js';

// Mock window.location and window.history
const mockLocation = {
  pathname: '/test',
  search: '?start=2025-01-01&end=2025-12-31&entities=1,2&tab=overview'
};

const mockHistory = {
  replaceState: jest.fn()
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true
});

describe('queryState utilities', () => {
  describe('parseQueryParams', () => {
    test('should parse all query parameters correctly', () => {
      const searchParams = new URLSearchParams('?start_date=2025-01-01&end_date=2025-12-31&entity_ids=1,2,3&tab=overview&pareto=true');
      const result = parseQueryParams(searchParams);
      
      expect(result).toEqual({
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        entity_ids: '1,2,3',
        tab: 'overview',
        pareto: 'true'
      });
    });

    test('should handle empty search params', () => {
      const searchParams = new URLSearchParams('');
      const result = parseQueryParams(searchParams);
      
      expect(result).toEqual({});
    });

    test('should handle partial parameters', () => {
      const searchParams = new URLSearchParams('?start_date=2025-01-01&tab=overview');
      const result = parseQueryParams(searchParams);
      
      expect(result).toEqual({
        start_date: '2025-01-01',
        tab: 'overview'
      });
    });
  });

  describe('buildQueryParams', () => {
    test('should build URLSearchParams from object', () => {
      const params = {
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        entity_ids: '1,2,3',
        tab: 'overview',
        pareto: 'true'
      };
      
      const result = buildQueryParams(params);
      
      expect(result.get('start_date')).toBe('2025-01-01');
      expect(result.get('end_date')).toBe('2025-12-31');
      expect(result.get('entity_ids')).toBe('1,2,3');
      expect(result.get('tab')).toBe('overview');
      expect(result.get('pareto')).toBe('true');
    });

    test('should filter out null, undefined, and empty values', () => {
      const params = {
        start_date: '2025-01-01',
        end_date: null,
        entity_ids: undefined,
        tab: '',
        pareto: 'true'
      };
      
      const result = buildQueryParams(params);
      
      expect(result.get('start_date')).toBe('2025-01-01');
      expect(result.get('end_date')).toBeNull();
      expect(result.get('entity_ids')).toBeNull();
      expect(result.get('tab')).toBeNull();
      expect(result.get('pareto')).toBe('true');
    });
  });

  describe('getDefaultDateRange', () => {
    test('should return current year date range', () => {
      const result = getDefaultDateRange();
      const currentYear = new Date().getFullYear();
      
      expect(result.start_date).toBe(`${currentYear}-01-01`);
      expect(result.end_date).toBe(`${currentYear}-12-31`);
    });
  });

  describe('validateDateRange', () => {
    test('should validate correct date range', () => {
      expect(validateDateRange('2025-01-01', '2025-12-31')).toBe(true);
      expect(validateDateRange('2023-06-15', '2023-06-20')).toBe(true);
    });

    test('should reject invalid date ranges', () => {
      expect(validateDateRange('2025-12-31', '2025-01-01')).toBe(false); // End before start
      expect(validateDateRange('2019-01-01', '2019-12-31')).toBe(false); // Before 2020
      expect(validateDateRange('2031-01-01', '2031-12-31')).toBe(false); // After 2030
      expect(validateDateRange('', '2025-12-31')).toBe(false); // Empty start
      expect(validateDateRange('2025-01-01', '')).toBe(false); // Empty end
    });
  });

  describe('parseEntityIds', () => {
    test('should parse comma-separated entity IDs', () => {
      expect(parseEntityIds('1,2,3')).toEqual([1, 2, 3]);
      expect(parseEntityIds('1, 2, 3')).toEqual([1, 2, 3]); // With spaces
      expect(parseEntityIds('1')).toEqual([1]);
    });

    test('should handle empty or invalid input', () => {
      expect(parseEntityIds('')).toEqual([]);
      expect(parseEntityIds(null)).toEqual([]);
      expect(parseEntityIds(undefined)).toEqual([]);
      expect(parseEntityIds('1,abc,3')).toEqual([1, 3]); // Filter out invalid
    });
  });

  describe('stringifyEntityIds', () => {
    test('should convert array to comma-separated string', () => {
      expect(stringifyEntityIds([1, 2, 3])).toBe('1,2,3');
      expect(stringifyEntityIds([1])).toBe('1');
      expect(stringifyEntityIds([])).toBe('');
    });

    test('should filter out invalid IDs', () => {
      expect(stringifyEntityIds([1, NaN, 3])).toBe('1,3');
      expect(stringifyEntityIds([1, 'abc', 3])).toBe('1,3');
    });
  });

  describe('queryState', () => {
    test('should parse search string correctly', () => {
      const result = queryState('?start_date=2025-01-01&end_date=2025-12-31&entity_ids=1,2&tab=overview');
      
      expect(result).toEqual({
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        entity_ids: '1,2',
        tab: 'overview'
      });
    });

    test('should handle empty search string', () => {
      const result = queryState('');
      expect(result).toEqual({});
    });

    test('should handle search string without question mark', () => {
      const result = queryState('start_date=2025-01-01&end_date=2025-12-31');
      
      expect(result).toEqual({
        start_date: '2025-01-01',
        end_date: '2025-12-31'
      });
    });
  });

  describe('getCurrentQueryParams', () => {
    test('should get current query parameters from window.location', () => {
      const result = getCurrentQueryParams();
      
      expect(result).toEqual({
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        entity_ids: '1,2',
        tab: 'overview'
      });
    });
  });

  describe('updateQueryParams', () => {
    test('should update URL with new parameters', () => {
      const navigate = jest.fn();
      const newParams = { tab: 'details' };
      const currentParams = { start_date: '2025-01-01' };
      
      updateQueryParams(newParams, currentParams, navigate);
      
      expect(navigate).toHaveBeenCalledWith('/test?start_date=2025-01-01&tab=details', { replace: true });
    });

    test('should update URL without navigate function', () => {
      const newParams = { tab: 'details' };
      const currentParams = { start_date: '2025-01-01' };
      
      updateQueryParams(newParams, currentParams);
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/test?start_date=2025-01-01&tab=details');
    });
  });

  describe('clearQueryParams', () => {
    test('should clear query parameters with navigate function', () => {
      const navigate = jest.fn();
      
      clearQueryParams(navigate);
      
      expect(navigate).toHaveBeenCalledWith('/test', { replace: true });
    });

    test('should clear query parameters without navigate function', () => {
      clearQueryParams();
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', '/test');
    });
  });
});

// Test export availability
describe('Export availability', () => {
  test('should export all required functions', () => {
    expect(typeof parseQueryParams).toBe('function');
    expect(typeof buildQueryParams).toBe('function');
    expect(typeof updateQueryParams).toBe('function');
    expect(typeof getDefaultDateRange).toBe('function');
    expect(typeof validateDateRange).toBe('function');
    expect(typeof parseEntityIds).toBe('function');
    expect(typeof stringifyEntityIds).toBe('function');
    expect(typeof getCurrentQueryParams).toBe('function');
    expect(typeof queryState).toBe('function');
    expect(typeof clearQueryParams).toBe('function');
  });
});