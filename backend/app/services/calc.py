from typing import Dict, Any, List, Optional
from datetime import date, timedelta
import numpy as np
from ..schemas.emission import EmissionPoint, ScopeShare, CategoryEmission, EmissionsResponse
from ..schemas.compliance import AllowancePoint, PriceScenario, ComplianceResponse
from ..schemas.intensity import IntensitySeriesPoint, IntensityScatterPoint, IntensityResponse
from .mock_data import generate_time_series, get_mock_category_emissions


def compute_emissions_for_activity(amount: float, factor_kgco2_per_unit: float) -> float:
    if amount is None or factor_kgco2_per_unit is None:
        return 0.0
    return float(amount) * float(factor_kgco2_per_unit)


def aggregate_emissions(records: list[dict]) -> Dict[str, Any]:
    totals_by_scope: Dict[str, float] = {}
    total_kg = 0.0
    for rec in records:
        scope = rec.get("scope", "Unknown")
        kg = float(rec.get("co2e_kg", 0.0))
        totals_by_scope[scope] = totals_by_scope.get(scope, 0.0) + kg
        total_kg += kg
    return {
        "total_kg": total_kg,
        "totals_by_scope": totals_by_scope,
    }


def calc_emissions(date_range: tuple[date, date], entities: Optional[List[int]] = None, pareto: bool = False) -> EmissionsResponse:
    """
    Calculate emissions data for the given date range and entities.
    
    Args:
        date_range: Tuple of (start_date, end_date)
        entities: List of entity IDs to filter by (None for all)
        pareto: Whether to apply 80/20 Pareto analysis to categories
    
    Returns:
        EmissionsResponse with summary, series, scopes, and top_categories
    """
    start_date, end_date = date_range
    
    # Generate monthly series for 2025
    monthly_series = _generate_monthly_series(start_date, end_date)
    
    # Calculate total emissions
    total_tco2e = sum(point.tco2e for point in monthly_series)
    
    # Calculate YoY percentage (comparing to same period previous year)
    yoy_pct = _calculate_yoy_percentage(monthly_series, start_date, end_date)
    
    # Calculate scope breakdown
    scopes = _calculate_scope_breakdown(monthly_series)
    
    # Get top categories (with optional Pareto analysis)
    top_categories = _get_top_categories(pareto)
    
    return EmissionsResponse(
        summary={
            "total_tco2e": round(total_tco2e, 2),
            "yoy_pct": round(yoy_pct, 2) if yoy_pct else None
        },
        series=monthly_series,
        scopes=scopes,
        top_categories=top_categories
    )


def _generate_monthly_series(start_date: date, end_date: date) -> List[EmissionPoint]:
    """Generate monthly emission points for the date range."""
    monthly_points = []
    current_date = start_date.replace(day=1)  # Start from first day of month
    
    while current_date <= end_date:
        # Generate realistic monthly emissions with seasonal variation
        base_emissions = 200  # Base monthly emissions in tCO2e
        seasonal_factor = 1 + 0.4 * abs((current_date.month - 6) / 6)  # Higher in summer/winter
        monthly_variation = 0.8 + 0.4 * (hash(str(current_date)) % 100) / 100
        
        monthly_emissions = base_emissions * seasonal_factor * monthly_variation
        
        monthly_points.append(EmissionPoint(
            date=current_date,
            tco2e=round(monthly_emissions, 2)
        ))
        
        # Move to next month
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
    
    return monthly_points


def _calculate_yoy_percentage(monthly_series: List[EmissionPoint], start_date: date, end_date: date) -> Optional[float]:
    """Calculate year-over-year percentage change."""
    if not monthly_series:
        return None
    
    # Calculate current period total
    current_total = sum(point.tco2e for point in monthly_series)
    
    # Calculate previous year period total
    prev_start = start_date.replace(year=start_date.year - 1)
    prev_end = end_date.replace(year=end_date.year - 1)
    prev_series = _generate_monthly_series(prev_start, prev_end)
    prev_total = sum(point.tco2e for point in prev_series)
    
    if prev_total == 0:
        return None
    
    return ((current_total - prev_total) / prev_total) * 100


def _calculate_scope_breakdown(monthly_series: List[EmissionPoint]) -> List[ScopeShare]:
    """Calculate scope breakdown from monthly series."""
    total_emissions = sum(point.tco2e for point in monthly_series)
    
    # Typical scope distribution
    scope_distribution = {
        "Scope 1": 0.40,  # 40% Scope 1
        "Scope 2": 0.35,  # 35% Scope 2
        "Scope 3": 0.25   # 25% Scope 3
    }
    
    scopes = []
    for scope, percentage in scope_distribution.items():
        scope_emissions = total_emissions * percentage
        scopes.append(ScopeShare(
            scope=scope,
            tco2e=round(scope_emissions, 2),
            pct=round(percentage * 100, 1)
        ))
    
    return scopes


def _get_top_categories(pareto: bool = False) -> List[CategoryEmission]:
    """Get top emission categories, optionally applying Pareto analysis."""
    categories = get_mock_category_emissions()
    
    # Convert to CategoryEmission format
    category_emissions = [
        CategoryEmission(category=cat.category, tco2e=cat.emissions)
        for cat in categories
    ]
    
    if pareto:
        # Apply 80/20 Pareto analysis
        total_emissions = sum(cat.tco2e for cat in category_emissions)
        target_80_percent = total_emissions * 0.8
        
        cumulative_emissions = 0
        top_categories = []
        
        for cat in sorted(category_emissions, key=lambda x: x.tco2e, reverse=True):
            top_categories.append(cat)
            cumulative_emissions += cat.tco2e
            if cumulative_emissions >= target_80_percent:
                break
        
        return top_categories
    else:
        # Return top 5 categories
        return sorted(category_emissions, key=lambda x: x.tco2e, reverse=True)[:5]


def pareto_80_20_cutoff(categories: List[CategoryEmission]) -> bool:
    """
    Determine if the top categories represent 80% of total emissions.
    
    Args:
        categories: List of CategoryEmission objects sorted by emissions (descending)
    
    Returns:
        True if top categories represent 80% or more of total emissions
    """
    if not categories:
        return False
    
    total_emissions = sum(cat.tco2e for cat in categories)
    if total_emissions == 0:
        return False
    
    # Calculate how many categories are needed for 80%
    target_80_percent = total_emissions * 0.8
    cumulative_emissions = 0
    
    for i, cat in enumerate(categories):
        cumulative_emissions += cat.tco2e
        if cumulative_emissions >= target_80_percent:
            # Check if we need more than 20% of categories for 80% of emissions
            required_percentage = (i + 1) / len(categories) * 100
            return required_percentage <= 20
    
    return False


def calc_compliance(date_range: tuple[date, date], entities: Optional[List[int]] = None, price_inputs: List[float] = [90, 120, 150]) -> ComplianceResponse:
    """
    Calculate compliance data for EU ETS allowances and cost scenarios.
    
    Args:
        date_range: Tuple of (start_date, end_date)
        entities: List of entity IDs to filter by (None for all)
        price_inputs: List of price scenarios in EUR per tCO2e
    
    Returns:
        ComplianceResponse with overshoot, costs, allowances, and scenarios
    """
    start_date, end_date = date_range
    
    # Calculate current emissions for the period
    emissions_data = calc_emissions(date_range, entities, pareto=False)
    current_emissions = emissions_data.summary["total_tco2e"]
    
    # Mock EU ETS allowance data for 2025
    # In reality, this would come from a database or external API
    allocated_allowances = _get_mock_allowances(start_date.year)
    
    # Calculate overshoot
    current_overshoot = max(0, current_emissions - allocated_allowances)
    
    # Current EU ETS price (mock data - in reality from market API)
    current_price = 85.5  # EUR per tCO2e
    
    # Calculate YTD cost
    ytd_cost = current_overshoot * current_price
    
    # Generate allowance points for the year
    allowances = _generate_allowance_points(start_date.year, allocated_allowances, current_emissions)
    
    # Generate price scenarios
    scenarios = _generate_price_scenarios(price_inputs, current_overshoot)
    
    return ComplianceResponse(
        current_overshoot_tco2e=round(current_overshoot, 2),
        ytd_cost_eur=round(ytd_cost, 2),
        allowances=allowances,
        scenarios=scenarios
    )


def _get_mock_allowances(year: int) -> float:
    """Get mock EU ETS allowances for the given year."""
    # Mock allowance data - in reality this would come from EU ETS registry
    allowance_data = {
        2025: 2500.0,  # 2500 tCO2e allocated for 2025
        2024: 2600.0,  # 2600 tCO2e allocated for 2024
        2023: 2700.0   # 2700 tCO2e allocated for 2023
    }
    return allowance_data.get(year, 2500.0)


def _generate_allowance_points(year: int, allocated: float, actual: float) -> List[AllowancePoint]:
    """Generate allowance points for the year showing monthly progression."""
    points = []
    
    # Distribute actual emissions across months (simplified)
    monthly_actual = actual / 12
    
    for month in range(1, 13):
        # Allocated allowances are typically distributed evenly
        monthly_allocated = allocated / 12
        
        # Actual emissions with some monthly variation
        monthly_variation = 0.8 + 0.4 * (month % 3) / 3  # Some seasonal variation
        monthly_actual_emissions = monthly_actual * monthly_variation
        
        # Calculate overshoot for this month
        monthly_overshoot = max(0, monthly_actual_emissions - monthly_allocated)
        
        points.append(AllowancePoint(
            year=year,
            allocated=round(monthly_allocated, 2),
            actual=round(monthly_actual_emissions, 2),
            over_by=round(monthly_overshoot, 2)
        ))
    
    return points


def _generate_price_scenarios(price_inputs: List[float], overshoot: float) -> List[PriceScenario]:
    """Generate price scenarios with exposure calculations."""
    scenarios = []
    
    for price in price_inputs:
        exposure = overshoot * price
        scenarios.append(PriceScenario(
            price_eur=price,
            exposure_eur=round(exposure, 2)
        ))
    
    return scenarios


def calc_intensity(date_range: tuple[date, date], entities: Optional[List[int]] = None) -> IntensityResponse:
    """
    Calculate carbon intensity data for the given date range and entities.
    
    Args:
        date_range: Tuple of (start_date, end_date)
        entities: List of entity IDs to filter by (None for all)
    
    Returns:
        IntensityResponse with intensity series, site scatter data, and correlation
    """
    start_date, end_date = date_range
    
    # Generate monthly intensity series
    intensity_series = _generate_intensity_series(start_date, end_date)
    
    # Calculate current intensity (latest month)
    current_intensity = intensity_series[-1].intensity if intensity_series else 0.0
    
    # Calculate YoY change
    yoy_change_pct = _calculate_intensity_yoy_change(intensity_series)
    
    # Generate site-level scatter data
    site_scatter = _generate_site_scatter_data()
    
    # Calculate correlation between revenue and emissions
    correlation = _calculate_revenue_emissions_correlation(site_scatter)
    
    return IntensityResponse(
        current_intensity=round(current_intensity, 2),
        yoy_change_pct=round(yoy_change_pct, 1),
        series=intensity_series,
        site_scatter=site_scatter,
        correlation=round(correlation, 3)
    )


def _generate_intensity_series(start_date: date, end_date: date) -> List[IntensitySeriesPoint]:
    """Generate monthly intensity time series with realistic patterns"""
    series = []
    current_date = start_date.replace(day=1)  # Start from first day of month
    
    # Base intensity values (tCO₂e per €M revenue)
    base_intensity = 2.5
    seasonal_factor = 0.3
    trend_factor = -0.02  # Slight downward trend
    
    month_count = 0
    while current_date <= end_date:
        # Add seasonal variation (higher in winter months)
        seasonal = seasonal_factor * np.sin(2 * np.pi * current_date.month / 12)
        
        # Add trend
        trend = trend_factor * month_count
        
        # Add some random noise
        noise = np.random.normal(0, 0.1)
        
        intensity = base_intensity + seasonal + trend + noise
        intensity = max(0.5, intensity)  # Ensure positive values
        
        series.append(IntensitySeriesPoint(
            date=current_date,
            intensity=round(intensity, 2)
        ))
        
        # Move to next month
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)
        month_count += 1
    
    return series


def _calculate_intensity_yoy_change(series: List[IntensitySeriesPoint]) -> float:
    """Calculate year-over-year percentage change in intensity"""
    if len(series) < 12:
        return 0.0
    
    # Compare current year average to previous year average
    current_year_avg = np.mean([point.intensity for point in series[-12:]])
    previous_year_avg = np.mean([point.intensity for point in series[-24:-12]]) if len(series) >= 24 else current_year_avg
    
    if previous_year_avg == 0:
        return 0.0
    
    return ((current_year_avg - previous_year_avg) / previous_year_avg) * 100


def _generate_site_scatter_data() -> List[IntensityScatterPoint]:
    """Generate site-level scatter plot data with realistic revenue-emissions relationship"""
    sites = [
        "Munich HQ", "Berlin Office", "Hamburg Plant", "Frankfurt Lab",
        "Stuttgart Facility", "Cologne Branch", "Düsseldorf Center", "Leipzig Site"
    ]
    
    scatter_data = []
    base_revenue = 15.0  # Base revenue in M€
    base_emissions = 35.0  # Base emissions in tCO₂e
    
    for i, site in enumerate(sites):
        # Generate correlated revenue and emissions
        revenue_factor = np.random.uniform(0.5, 2.0)
        revenue_meur = base_revenue * revenue_factor
        
        # Emissions correlate with revenue but with some variation
        correlation_factor = 0.8  # Strong positive correlation
        noise_factor = np.random.uniform(0.7, 1.3)
        emissions_factor = (correlation_factor * revenue_factor + (1 - correlation_factor)) * noise_factor
        tco2e = base_emissions * emissions_factor
        
        # Calculate intensity
        intensity = tco2e / revenue_meur if revenue_meur > 0 else 0
        
        scatter_data.append(IntensityScatterPoint(
            site=site,
            revenue_meur=round(revenue_meur, 1),
            tco2e=round(tco2e, 1),
            intensity=round(intensity, 2)
        ))
    
    return scatter_data


def _calculate_revenue_emissions_correlation(scatter_data: List[IntensityScatterPoint]) -> float:
    """Calculate Pearson correlation between revenue and emissions"""
    if len(scatter_data) < 2:
        return 0.0
    
    revenues = [point.revenue_meur for point in scatter_data]
    emissions = [point.tco2e for point in scatter_data]
    
    # Calculate Pearson correlation coefficient
    correlation_matrix = np.corrcoef(revenues, emissions)
    correlation = correlation_matrix[0, 1]
    
    # Handle NaN values
    if np.isnan(correlation):
        return 0.0
    
    return correlation

