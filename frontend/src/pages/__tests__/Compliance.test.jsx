/**
 * Tests for Compliance page component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Compliance from '../Compliance.jsx';
import { api } from '../../api.js';

// Mock the API
jest.mock('../../api.js', () => ({
  getCompliance: jest.fn(),
  getFacilities: jest.fn()
}));

// Mock the queryState utility
jest.mock('../../utils/queryState.js', () => ({
  queryState: jest.fn()
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  ComposedChart: ({ children }) => <div data-testid="composed-chart">{children}</div>
}));

// Mock EntityMultiSelect component
jest.mock('../../components/EntityMultiSelect.jsx', () => {
  return function MockEntityMultiSelect({ entities, selectedIds, onSelectionChange }) {
    return (
      <div data-testid="entity-multi-select">
        <div>Selected: {selectedIds.join(',')}</div>
        {entities.map(entity => (
          <button
            key={entity.id}
            onClick={() => onSelectionChange([...selectedIds, entity.id])}
          >
            {entity.name}
          </button>
        ))}
      </div>
    );
  };
});

// Mock LLMInsights component
jest.mock('../../components/LLMInsights.jsx', () => {
  return function MockLLMInsights({ context }) {
    return <div data-testid="llm-insights">LLM Insights for {context}</div>;
  };
});

const mockComplianceData = {
  current_overshoot_tco2e: 329.82,
  ytd_cost_eur: 28199.61,
  allowances: [
    { year: 2025, allocated: 208.33, actual: 220.1, over_by: 11.76 },
    { year: 2025, allocated: 208.33, actual: 251.54, over_by: 43.21 }
  ],
  scenarios: [
    { price_eur: 90, exposure_eur: 29683.8 },
    { price_eur: 120, exposure_eur: 39578.4 },
    { price_eur: 150, exposure_eur: 49473.0 }
  ]
};

const mockEntities = [
  { id: 1, name: 'CarbonLens Group', city: 'Istanbul', country: 'Turkey' },
  { id: 2, name: 'Manufacturing Division', city: 'Izmir', country: 'Turkey' },
  { id: 3, name: 'Services Division', city: 'Ankara', country: 'Turkey' }
];

const mockQueryState = {
  start: '2025-01-01',
  end: '2025-12-31',
  entities: '1,2'
};

const renderCompliance = (queryState = mockQueryState) => {
  const { queryState: mockQueryStateFn } = require('../../utils/queryState.js');
  mockQueryStateFn.mockReturnValue(queryState);

  return render(
    <BrowserRouter>
      <Compliance />
    </BrowserRouter>
  );
};

describe('Compliance Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getCompliance.mockResolvedValue(mockComplianceData);
    api.getFacilities.mockResolvedValue(mockEntities);
  });

  test('should render loading state initially', () => {
    renderCompliance();
    expect(screen.getByText('Loading compliance data...')).toBeInTheDocument();
  });

  test('should render compliance data after loading', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Compliance Hub')).toBeInTheDocument();
    });

    expect(screen.getByText('329.8')).toBeInTheDocument(); // Overshoot
    expect(screen.getByText('High')).toBeInTheDocument(); // Risk level
    expect(screen.getByText('€28,200')).toBeInTheDocument(); // YTD Cost
  });

  test('should render KPI cards with correct data', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Overshoot')).toBeInTheDocument();
      expect(screen.getByText('Risk Level')).toBeInTheDocument();
      expect(screen.getByText('YTD Cost')).toBeInTheDocument();
    });

    expect(screen.getByText('tCO₂e')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  test('should render charts section', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Allocation vs Actual')).toBeInTheDocument();
      expect(screen.getByText('Carbon Price Scenarios')).toBeInTheDocument();
    });

    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('should render price input chips', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('€90')).toBeInTheDocument();
      expect(screen.getByText('€120')).toBeInTheDocument();
      expect(screen.getByText('€150')).toBeInTheDocument();
    });
  });

  test('should render alert controls', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Set Alert Threshold:')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });
  });

  test('should render LLM insights with compliance context', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByTestId('llm-insights')).toBeInTheDocument();
    });

    expect(screen.getByText('LLM Insights for compliance')).toBeInTheDocument();
  });

  test('should handle price input changes', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('€90')).toBeInTheDocument();
    });

    // Click on price chip to edit
    const priceChip = screen.getByText('€90');
    fireEvent.click(priceChip);

    // Should show input field
    const priceInput = screen.getByDisplayValue('90');
    expect(priceInput).toBeInTheDocument();

    // Change value
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.blur(priceInput);

    // Should update the price
    expect(api.getCompliance).toHaveBeenCalledWith(
      '2025-01-01',
      '2025-12-31',
      [1, 2],
      [100, 120, 150]
    );
  });

  test('should handle adding new price input', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add price')).toBeInTheDocument();
    });

    const addInput = screen.getByPlaceholderText('Add price');
    const addButton = screen.getByText('+');

    fireEvent.change(addInput, { target: { value: '200' } });
    fireEvent.click(addButton);

    expect(api.getCompliance).toHaveBeenCalledWith(
      '2025-01-01',
      '2025-12-31',
      [1, 2],
      [90, 120, 150, 200]
    );
  });

  test('should handle alert threshold changes', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('95%')).toBeInTheDocument();
    });

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '90' } });

    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  test('should handle test alert button click', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    const testButton = screen.getByText('Test Alert');
    fireEvent.click(testButton);

    // Should show alert or alert message
    await waitFor(() => {
      expect(screen.getByText(/Current usage:/)).toBeInTheDocument();
    });
  });

  test('should handle date range changes', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument();
    });

    const startDateInput = screen.getByDisplayValue('2025-01-01');
    fireEvent.change(startDateInput, { target: { value: '2025-06-01' } });

    // Should trigger API call with new date
    expect(api.getCompliance).toHaveBeenCalledWith(
      '2025-06-01',
      '2025-12-31',
      [1, 2],
      [90, 120, 150]
    );
  });

  test('should handle entity selection changes', async () => {
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByTestId('entity-multi-select')).toBeInTheDocument();
    });

    const entityButton = screen.getByText('Services Division');
    fireEvent.click(entityButton);

    // Should trigger API call with new entities
    expect(api.getCompliance).toHaveBeenCalledWith(
      '2025-01-01',
      '2025-12-31',
      [1, 2, 3],
      [90, 120, 150]
    );
  });

  test('should handle API errors gracefully', async () => {
    api.getCompliance.mockRejectedValue(new Error('API Error'));
    
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load compliance data')).toBeInTheDocument();
    });
  });

  test('should show alert toast when threshold is reached', async () => {
    // Mock data that exceeds threshold
    const highOvershootData = {
      ...mockComplianceData,
      allowances: Array(12).fill({ allocated: 100, actual: 200, over_by: 100 })
    };
    
    api.getCompliance.mockResolvedValue(highOvershootData);
    
    renderCompliance();
    
    await waitFor(() => {
      expect(screen.getByText('Threshold reached: Actual emissions exceed 95% of allocation')).toBeInTheDocument();
    });
  });
});