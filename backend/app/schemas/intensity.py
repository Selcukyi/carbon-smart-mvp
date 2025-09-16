"""
Carbon Intensity Hub Schemas

Provides data structures for carbon intensity analysis including:
- Time series intensity data
- Site-level scatter plot data
- Revenue vs emissions correlation analysis
"""

from datetime import date
from typing import List
from pydantic import BaseModel


class IntensitySeriesPoint(BaseModel):
    """Single data point in intensity time series"""
    date: date
    intensity: float  # tCO₂e per €M revenue


class IntensityScatterPoint(BaseModel):
    """Single data point for site-level scatter plot"""
    site: str
    revenue_meur: float  # Revenue in millions EUR
    tco2e: float  # Total CO2e emissions
    intensity: float  # tCO₂e per €M revenue


class IntensityResponse(BaseModel):
    """Complete intensity analysis response"""
    current_intensity: float  # Current intensity value
    yoy_change_pct: float  # Year-over-year change percentage
    series: List[IntensitySeriesPoint]  # Time series data
    site_scatter: List[IntensityScatterPoint]  # Site-level scatter data
    correlation: float  # Pearson correlation between revenue and emissions