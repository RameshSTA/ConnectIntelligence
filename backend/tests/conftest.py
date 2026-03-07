"""
Pytest configuration and shared fixtures for Connect Intelligence tests.

Author: Ramesh Shrestha
"""

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    """FastAPI TestClient shared across all tests in the session.

    Session-scoped so the app is instantiated only once — this also
    ensures the metrics cache (_CACHED_METRICS) is populated on the
    first request and reused for all subsequent calls, mirroring the
    behaviour of the production server.
    """
    return TestClient(app)


@pytest.fixture(scope="session")
def valid_member() -> dict:
    """A representative member profile that passes all Pydantic validation rules.

    Used by predict-endpoint tests as a reusable baseline. Override individual
    fields in each test to exercise boundary conditions.
    """
    return {
        "credit_score":         650,
        "age":                  35,
        "tenure":               5,
        "balance":              85_000.0,
        "products_number":      1,
        "credit_card":          1,
        "active_member":        1,
        "estimated_salary":     75_000.0,
        "gender":               1,
        "country_Germany":      1,
        "country_Spain":        0,
        "balance_salary_ratio": 1.133,
        "is_zero_balance":      0,
        "tenure_age_ratio":     0.143,
        "engagement_score":     2.0,
        "grp_Adult":            1,
        "grp_Mid_Age":          0,
        "grp_Senior":           0,
        "cluster":              1,
    }
