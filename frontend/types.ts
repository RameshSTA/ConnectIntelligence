/**
 * types.ts — Shared TypeScript interfaces for Connect Intelligence
 * ================================================================
 * Defines the data contracts between the FastAPI backend and the
 * React frontend. Each interface mirrors the JSON shape returned by
 * the corresponding endpoint so TypeScript can catch mismatches at
 * compile time.
 */

// --------------------------------------------------------------------------
// /api/members — raw member dataset + portfolio KPIs
// --------------------------------------------------------------------------

export interface ApiMember {
  credit_score:         number;
  age:                  number;
  tenure:               number;
  balance:              number;
  products_number:      number;
  credit_card:          number;
  active_member:        number;
  estimated_salary:     number;
  country:              string;
  gender:               number;
  churn:                number;
  balance_salary_ratio: number;
  tenure_age_ratio:     number;
  engagement_score:     number;
  is_zero_balance:      number;
  country_Germany:      number;
  country_Spain:        number;
  grp_Adult:            number;
  grp_Mid_Age:          number;
  grp_Senior:           number;
  cluster:              number;
  age_group:            string;
  wealth_tier:          string;
}

export interface PortfolioMetrics {
  total_aum:  number;
  total_var:  number;
  churn_rate: number;
}

// --------------------------------------------------------------------------
// /api/member-ledger — enriched member list (names, decoded booleans)
// --------------------------------------------------------------------------

export interface LedgerMember {
  id:          string;
  name:        string;
  country:     string;
  gender:      string;
  age:         number;
  tenure:      number;
  balance:     number;
  products:    number;
  credit_card: string;
  active:      string;
  salary:      number;
  churn:       number;
  cluster:     string;
  engagement:  number;
}

// --------------------------------------------------------------------------
// /api/segmentation — PCA coordinates for cluster scatter chart
// --------------------------------------------------------------------------

export interface SegmentPoint {
  pcaX:                number;
  pcaY:                number;
  segment:             string;
  superBalance:        number;
  age:                 number;
  churnProbability:    number;
  appSessionsPerMonth: number;
}

// --------------------------------------------------------------------------
// /api/model-insights — pre-computed evaluation metrics
// --------------------------------------------------------------------------

export interface ModelReport {
  accuracy:         number;
  roc_auc:          number;
  cv_roc_auc_mean?: number;
  cv_roc_auc_std?:  number;
  precision:        number;
  recall:           number;
  f1:               number;
}

export interface ConfusionMatrix { tn: number; fp: number; fn: number; tp: number; }
export interface FeatureItem     { feature: string; importance: number; color: string; desc: string; }
export interface RocPoint        { fpr: number; tpr: number; }

export interface ModelInsights {
  report:             ModelReport;
  confusion_matrix:   ConfusionMatrix;
  feature_importance: FeatureItem[];
  roc_curve:          RocPoint[];
  sample_size:        number;
}

// --------------------------------------------------------------------------
// /api/audit — data quality health report
// --------------------------------------------------------------------------

export interface AuditResponse {
  health_score:  number;
  metrics:       { completeness: number; integrity: number; validity: number; };
  total_records: number;
  features:      { field: string; missing: string; outliers: number; quality: string; treatment: string; }[];
}

// --------------------------------------------------------------------------
// Legacy alias (keeps existing component imports working)
// --------------------------------------------------------------------------

/** @deprecated Use ApiMember instead. */
export type Member = ApiMember;

export enum SegmentType {
  WEALTH_BUILDERS    = 'Wealth Builders',
  PRE_RETIREES       = 'Pre-Retirees',
  DISENGAGED_YOUTH   = 'Disengaged Youth',
  HIGH_VALUE_AT_RISK = 'High Value At Risk',
  STABLE_SAVERS      = 'Stable Savers',
}
