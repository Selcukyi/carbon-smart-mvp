import React, { useState, useEffect } from 'react';

/**
 * EntityMultiSelect component for selecting multiple entities
 * @param {Object} props - Component props
 * @param {Array} props.entities - Available entities
 * @param {Array} props.selectedIds - Selected entity IDs
 * @param {Function} props.onSelectionChange - Selection change handler
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.placeholder - Placeholder text
 */
export default function EntityMultiSelect({
  entities = [],
  selectedIds = [],
  onSelectionChange,
  disabled = false,
  className = "",
  placeholder = "Select entities..."
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter entities based on search term
  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected entities
  const selectedEntities = entities.filter(entity => selectedIds.includes(entity.id));

  const handleToggleEntity = (entityId) => {
    if (disabled) return;

    const newSelectedIds = selectedIds.includes(entityId)
      ? selectedIds.filter(id => id !== entityId)
      : [...selectedIds, entityId];

    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allIds = filteredEntities.map(entity => entity.id);
    onSelectionChange?.(allIds);
  };

  const handleSelectNone = () => {
    if (disabled) return;
    onSelectionChange?.([]);
  };

  const handleClearSelection = () => {
    if (disabled) return;
    onSelectionChange?.([]);
    setSearchTerm('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.entity-multi-select')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`entity-multi-select ${className}`}>
      <div
        className={`select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="selected-items">
          {selectedEntities.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            <div className="selected-tags">
              {selectedEntities.slice(0, 3).map(entity => (
                <span key={entity.id} className="selected-tag">
                  {entity.name}
                </span>
              ))}
              {selectedEntities.length > 3 && (
                <span className="more-count">+{selectedEntities.length - 3} more</span>
              )}
            </div>
          )}
        </div>
        <div className="select-arrow">▼</div>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={disabled}
            />
          </div>

          <div className="select-actions">
            <button
              type="button"
              onClick={handleSelectAll}
              className="action-btn"
              disabled={disabled}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleSelectNone}
              className="action-btn"
              disabled={disabled}
            >
              Select None
            </button>
            {selectedEntities.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="action-btn clear"
                disabled={disabled}
              >
                Clear
              </button>
            )}
          </div>

          <div className="select-options">
            {filteredEntities.length === 0 ? (
              <div className="no-options">No entities found</div>
            ) : (
              filteredEntities.map(entity => (
                <div
                  key={entity.id}
                  className={`select-option ${selectedIds.includes(entity.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleEntity(entity.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(entity.id)}
                    onChange={() => {}} // Handled by onClick
                    className="option-checkbox"
                    disabled={disabled}
                  />
                  <div className="option-content">
                    <div className="option-name">{entity.name}</div>
                    {entity.city && (
                      <div className="option-location">{entity.city}, {entity.country}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}