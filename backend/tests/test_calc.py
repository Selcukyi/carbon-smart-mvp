from backend.app.services.calc import compute_emissions_for_activity


def test_compute_emissions_for_activity():
    assert compute_emissions_for_activity(10, 2.5) == 25.0
    assert compute_emissions_for_activity(0, 2.5) == 0.0
    assert compute_emissions_for_activity(10, 0) == 0.0

