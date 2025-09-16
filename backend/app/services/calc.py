from typing import Dict, Any, List, Optional
from datetime import date, timedelta
from ..schemas.emission import EmissionPoint, ScopeShare, CategoryEmission, EmissionsResponse
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

