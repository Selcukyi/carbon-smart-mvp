import React from 'react';

/**
 * DateRangePicker component for selecting date ranges
 * @param {Object} props - Component props
 * @param {string} props.startDate - Start date value
 * @param {string} props.endDate - End date value
 * @param {Function} props.onStartDateChange - Start date change handler
 * @param {Function} props.onEndDateChange - End date change handler
 * @param {Function} props.onRangeChange - Range change handler
 * @param {boolean} props.disabled - Whether the picker is disabled
 * @param {string} props.className - Additional CSS classes
 */
export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeChange,
  disabled = false,
  className = ""
}) {
  const handleStartDateChange = (e) => {
    const value = e.target.value;
    onStartDateChange?.(value);
    onRangeChange?.({ startDate: value, endDate });
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    onEndDateChange?.(value);
    onRangeChange?.({ startDate, endDate: value });
  };

  const handlePresetClick = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'today':
        start = end = today.toISOString().split('T')[0];
        break;
      case 'week':
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      default:
        return;
    }

    onRangeChange?.({ startDate: start, endDate: end });
  };

  return (
    <div className={`date-range-picker ${className}`}>
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate || ''}
            onChange={handleStartDateChange}
            disabled={disabled}
            className="date-input"
          />
        </div>
        
        <div className="date-separator">to</div>
        
        <div className="date-input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate || ''}
            onChange={handleEndDateChange}
            disabled={disabled}
            className="date-input"
          />
        </div>
      </div>

      <div className="date-presets">
        <button
          type="button"
          onClick={() => handlePresetClick('today')}
          disabled={disabled}
          className="preset-btn"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick('week')}
          disabled={disabled}
          className="preset-btn"
        >
          Last 7 days
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick('month')}
          disabled={disabled}
          className="preset-btn"
        >
          This month
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick('quarter')}
          disabled={disabled}
          className="preset-btn"
        >
          This quarter
        </button>
        <button
          type="button"
          onClick={() => handlePresetClick('year')}
          disabled={disabled}
          className="preset-btn"
        >
          This year
        </button>
      </div>
    </div>
  );
}