import os
import joblib
import pytest
import pandas as pd
import numpy as np
from pathlib import Path

# Path Resolution
TEST_DIR = Path(__file__).resolve().parent
MODEL_PATH = str(TEST_DIR.parent / "models" / "churn_model_gb.pkl")
SCALER_PATH = str(TEST_DIR.parent / "models" / "standard_scaler.pkl")

@pytest.fixture
def sample_data():
    """
    Creates a mock dataframe with all required features. 
    The order here doesn't matter because the test will reorder it automatically below.
    """
    return pd.DataFrame({
        'credit_score': [619, 608],
        'age': [42, 41],
        'tenure': [2, 1],
        'balance': [0.0, 83807.86],
        'products_number': [1, 1],
        'credit_card': [1, 0],
        'active_member': [1, 1],
        'estimated_salary': [101348.88, 112542.58],
        'balance_salary_ratio': [0.0, 0.744],
        'tenure_age_ratio': [0.047, 0.024],
        'engagement_score': [2, 2],
        'is_zero_balance': [1, 0],
        'country_Germany': [0, 0],
        'country_Spain': [0, 1],
        'gender': [0, 0],
        'grp_Adult': [1, 1],
        'grp_Mid_Age': [0, 0],
        'grp_Senior': [0, 0]
    })

def test_model_loading():
    """Confirms artifacts exist and are loadable."""
    assert os.path.exists(MODEL_PATH), f"Model missing at {MODEL_PATH}"
    model = joblib.load(MODEL_PATH)
    assert hasattr(model, "predict")

def test_prediction_output(sample_data):
    """
    FIXED: Programmatically aligns column order with the trained model.
    """
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    # --- THE PROFESSIONAL FIX ---
    # Retrieve the exact column order the scaler was trained on
    expected_order = scaler.feature_names_in_
    
    # Reorder the sample_data columns to match that order perfectly
    aligned_data = sample_data[expected_order]
    
    # Now transform and predict will work without order errors
    X_scaled = scaler.transform(aligned_data)
    probs = model.predict_proba(X_scaled)[:, 1]
    
    assert len(probs) == 2
    assert np.all(probs >= 0) and np.all(probs <= 1)
    print(f"\n[PASS] Inference verified. Probabilities: {probs}")

def test_preprocessing_integrity():
    """Ensures input validation detects shape mismatch."""
    scaler = joblib.load(SCALER_PATH)
    with pytest.raises(ValueError):
        scaler.transform(pd.DataFrame({'error': [0]}))

if __name__ == "__main__":
    pytest.main([__file__])