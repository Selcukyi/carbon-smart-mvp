import pytest
from fastapi.testclient import TestClient
from datetime import date
from app.main import app

client = TestClient(app)

def test_emissions_endpoint_basic():
    """Test basic emissions endpoint functionality."""
    response = client.get("/emissions")
    
    assert response.status_code == 200
    data = response.json()
    
    # Check required keys
    assert "summary" in data
    assert "series" in data
    assert "scopes" in data
    assert "top_categories" in data
    
    # Check summary structure
    summary = data["summary"]
    assert "total_tco2e" in summary
    assert "yoy_pct" in summary
    assert isinstance(summary["total_tco2e"], (int, float))
    
    # Check series structure
    series = data["series"]
    assert isinstance(series, list)
    assert len(series) > 0
    
    # Check first series item
    if series:
        first_point = series[0]
        assert "date" in first_point
        assert "tco2e" in first_point
        assert isinstance(first_point["tco2e"], (int, float))
    
    # Check scopes structure
    scopes = data["scopes"]
    assert isinstance(scopes, list)
    assert len(scopes) == 3  # Should have 3 scopes
    
    for scope in scopes:
        assert "scope" in scope
        assert "tco2e" in scope
        assert "pct" in scope
        assert isinstance(scope["tco2e"], (int, float))
        assert isinstance(scope["pct"], (int, float))
    
    # Check top_categories structure
    top_categories = data["top_categories"]
    assert isinstance(top_categories, list)
    assert len(top_categories) >= 5  # Should have at least 5 categories
    
    for category in top_categories:
        assert "category" in category
        assert "tco2e" in category
        assert isinstance(category["tco2e"], (int, float))

def test_emissions_endpoint_with_params():
    """Test emissions endpoint with query parameters."""
    response = client.get("/emissions?start=2025-01-01&end=2025-12-31&entities=1,2&pareto=false")
    
    assert response.status_code == 200
    data = response.json()
    
    # Check that we have 12 months of data
    series = data["series"]
    assert len(series) == 12
    
    # Check that all dates are in 2025
    for point in series:
        date_str = point["date"]
        assert date_str.startswith("2025-")

def test_emissions_endpoint_pareto():
    """Test emissions endpoint with Pareto analysis."""
    response = client.get("/emissions?pareto=true")
    
    assert response.status_code == 200
    data = response.json()
    
    # With Pareto analysis, we should have fewer categories
    top_categories = data["top_categories"]
    assert len(top_categories) <= 5  # Pareto should reduce categories

def test_emissions_endpoint_invalid_entities():
    """Test emissions endpoint with invalid entity IDs."""
    response = client.get("/emissions?entities=invalid,ids")
    
    assert response.status_code == 400
    assert "Invalid entity IDs format" in response.json()["detail"]

def test_emissions_endpoint_date_range():
    """Test emissions endpoint with custom date range."""
    response = client.get("/emissions?start=2025-06-01&end=2025-08-31")
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have 3 months of data
    series = data["series"]
    assert len(series) == 3
    
    # Check that dates are in the specified range
    for point in series:
        date_str = point["date"]
        assert "2025-06" in date_str or "2025-07" in date_str or "2025-08" in date_str

# Legacy endpoint test removed - requires database setup
# def test_emissions_legacy_endpoint():
#     """Test legacy emissions endpoint for backward compatibility."""
#     response = client.get("/emissions/legacy")
#     
#     assert response.status_code == 200
#     data = response.json()
#     
#     # Check legacy structure
#     assert "page" in data
#     assert "size" in data
#     assert "total" in data
#     assert "items" in data
#     assert "totals_by_scope" in data
#     assert "total_kg" in data