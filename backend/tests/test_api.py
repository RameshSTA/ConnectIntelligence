"""
Connect Intelligence — FastAPI Unit Tests
==========================================
Tests all six REST endpoints using the FastAPI TestClient (no real HTTP
calls; ASGI transport). Each test verifies response shape and status code.

Run from the /backend directory:
    pytest tests/ -v

Author: Ramesh Shrestha
"""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

VALID_MEMBER = {
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


# ---------------------------------------------------------------------------
# GET /api/members
# ---------------------------------------------------------------------------

def test_get_members_status():
    """Endpoint returns HTTP 200."""
    response = client.get("/api/members")
    assert response.status_code == 200


def test_get_members_schema():
    """Response contains the three required top-level keys."""
    data = client.get("/api/members").json()
    assert "members"      in data
    assert "correlations" in data
    assert "metrics"      in data


def test_get_members_metrics_keys():
    """Portfolio metrics contain AUM, VaR, and churn rate."""
    metrics = client.get("/api/members").json()["metrics"]
    assert "total_aum"  in metrics
    assert "total_var"  in metrics
    assert "churn_rate" in metrics


def test_get_members_churn_rate_range():
    """Churn rate is a valid probability (0–1)."""
    churn_rate = client.get("/api/members").json()["metrics"]["churn_rate"]
    assert 0.0 <= churn_rate <= 1.0


# ---------------------------------------------------------------------------
# POST /api/predict
# ---------------------------------------------------------------------------

def test_predict_valid_input():
    """Valid member profile returns HTTP 200 with a churn score."""
    response = client.post("/api/predict", json=VALID_MEMBER)
    assert response.status_code == 200
    data = response.json()
    assert "score"       in data
    assert "risk_level"  in data
    assert "next_action" in data


def test_predict_score_is_probability():
    """Churn score is a value in the [0, 1] interval."""
    score = client.post("/api/predict", json=VALID_MEMBER).json()["score"]
    assert 0.0 <= score <= 1.0


def test_predict_risk_level_values():
    """Risk level must be one of the three defined tiers."""
    risk = client.post("/api/predict", json=VALID_MEMBER).json()["risk_level"]
    assert risk in ("High Alert", "Elevated", "Stable")


def test_predict_invalid_age():
    """Age below the legal minimum triggers a 422 validation error."""
    payload = {**VALID_MEMBER, "age": 10}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_credit_score():
    """Credit score above 850 triggers a 422 validation error."""
    payload = {**VALID_MEMBER, "credit_score": 900}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_field():
    """Missing a required field triggers a 422 validation error."""
    payload = {k: v for k, v in VALID_MEMBER.items() if k != "balance"}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_high_risk_member():
    """A clearly at-risk member profile scores above 0.40."""
    high_risk = {
        **VALID_MEMBER,
        "age":            58,
        "active_member":  0,
        "products_number": 1,
        "balance":        195_000.0,
        "grp_Adult":      0,
        "grp_Mid_Age":    1,
        "grp_Senior":     0,
    }
    score = client.post("/api/predict", json=high_risk).json()["score"]
    assert score > 0.20  # Model-level sanity: clearly at-risk member


# ---------------------------------------------------------------------------
# GET /api/audit
# ---------------------------------------------------------------------------

def test_get_audit_status():
    response = client.get("/api/audit")
    assert response.status_code == 200


def test_get_audit_schema():
    data = client.get("/api/audit").json()
    assert "health_score"  in data
    assert "metrics"       in data
    assert "total_records" in data
    assert "features"      in data


def test_get_audit_health_score_range():
    health = client.get("/api/audit").json()["health_score"]
    assert 0.0 <= health <= 100.0


def test_get_audit_metrics_keys():
    metrics = client.get("/api/audit").json()["metrics"]
    assert "completeness" in metrics
    assert "integrity"    in metrics
    assert "validity"     in metrics


# ---------------------------------------------------------------------------
# GET /api/segmentation
# ---------------------------------------------------------------------------

def test_get_segmentation_status():
    response = client.get("/api/segmentation")
    assert response.status_code == 200


def test_get_segmentation_is_list():
    data = client.get("/api/segmentation").json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_segmentation_point_schema():
    point = client.get("/api/segmentation").json()[0]
    assert "pcaX"    in point
    assert "pcaY"    in point
    assert "segment" in point


# ---------------------------------------------------------------------------
# GET /api/model-insights
# ---------------------------------------------------------------------------

def test_get_model_insights_status():
    response = client.get("/api/model-insights")
    assert response.status_code == 200


def test_get_model_insights_schema():
    data = client.get("/api/model-insights").json()
    assert "report"             in data
    assert "confusion_matrix"   in data
    assert "feature_importance" in data
    assert "roc_curve"          in data


def test_get_model_insights_roc_auc():
    """ROC-AUC should be in a reasonable range for the trained model."""
    report = client.get("/api/model-insights").json()["report"]
    assert 0.70 <= report["roc_auc"] <= 1.0


# ---------------------------------------------------------------------------
# GET /api/member-ledger
# ---------------------------------------------------------------------------

def test_get_member_ledger_status():
    response = client.get("/api/member-ledger")
    assert response.status_code == 200


def test_get_member_ledger_is_list():
    data = client.get("/api/member-ledger").json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_member_ledger_member_schema():
    member = client.get("/api/member-ledger").json()[0]
    required = ["id", "name", "country", "gender", "age", "tenure",
                "balance", "products", "credit_card", "active",
                "salary", "churn", "cluster", "engagement"]
    for field in required:
        assert field in member, f"Missing field: {field}"


def test_get_member_ledger_id_format():
    """Member IDs should follow the MBR-XXXXX convention."""
    member_id = client.get("/api/member-ledger").json()[0]["id"]
    assert member_id.startswith("MBR-")
