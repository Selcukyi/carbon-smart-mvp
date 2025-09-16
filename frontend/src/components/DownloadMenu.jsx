import React, { useState } from 'react';

/**
 * DownloadMenu component for exporting data in various formats
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to export
 * @param {string} props.filename - Base filename for exports
 * @param {Function} props.onExport - Export handler
 * @param {boolean} props.disabled - Whether the menu is disabled
 * @param {string} props.className - Additional CSS classes
 */
export default function DownloadMenu({
  data = [],
  filename = 'carbon-data',
  onExport,
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format) => {
    if (disabled || !data || data.length === 0) return;

    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'png':
          exportToPNG(filename);
          break;
        case 'pdf':
          exportToPDF(filename);
          break;
        default:
          console.warn(`Unsupported export format: ${format}`);
      }

      onExport?.(format);
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No data to export to CSV');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const exportToPNG = (filename) => {
    // This would typically capture a chart or table as PNG
    // For now, we'll create a placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Draw a simple placeholder
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chart Export', canvas.width / 2, canvas.height / 2);
    ctx.fillText('(PNG export functionality)', canvas.width / 2, canvas.height / 2 + 40);

    canvas.toBlob((blob) => {
      if (blob) {
        downloadFile(blob, `${filename}.png`, 'image/png');
      }
    });
  };

  const exportToPDF = (filename) => {
    // This would typically generate a PDF report
    // For now, we'll create a simple text-based PDF placeholder
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(CarbonLens Report) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

    downloadFile(pdfContent, `${filename}.pdf`, 'application/pdf');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.download-menu')) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`download-menu ${className}`}>
      <button
        className={`download-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="download-icon">⬇️</span>
        <span className="download-text">Download</span>
        <span className="download-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="download-dropdown">
          <div className="download-options">
            <button
              className="download-option"
              onClick={() => handleExport('csv')}
              disabled={disabled || !data || data.length === 0}
            >
              <span className="option-icon">📊</span>
              <span className="option-text">CSV</span>
              <span className="option-desc">Spreadsheet data</span>
            </button>

            <button
              className="download-option"
              onClick={() => handleExport('json')}
              disabled={disabled || !data || data.length === 0}
            >
              <span className="option-icon">📄</span>
              <span className="option-text">JSON</span>
              <span className="option-desc">Raw data format</span>
            </button>

            <button
              className="download-option"
              onClick={() => handleExport('png')}
              disabled={disabled}
            >
              <span className="option-icon">🖼️</span>
              <span className="option-text">PNG</span>
              <span className="option-desc">Chart image</span>
            </button>

            <button
              className="download-option"
              onClick={() => handleExport('pdf')}
              disabled={disabled}
            >
              <span className="option-icon">📋</span>
              <span className="option-text">PDF</span>
              <span className="option-desc">Report document</span>
            </button>
          </div>

          {(!data || data.length === 0) && (
            <div className="download-warning">
              No data available for export
            </div>
          )}
        </div>
      )}
    </div>
  );
}