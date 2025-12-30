export enum SegmentType {
  WEALTH_BUILDERS = "Wealth Builders",
  PRE_RETIREES = "Pre-Retirees",
  DISENGAGED_YOUTH = "Disengaged Youth",
  HIGH_VALUE_AT_RISK = "High Value At Risk",
  STABLE_SAVERS = "Stable Savers"
}

export enum Sentiment {
  POSITIVE = "Positive",
  NEUTRAL = "Neutral",
  NEGATIVE = "Negative"
}

/**
 * MEMBER INTERFACE
 * This matches the row structure of 'segmented_members_final.csv'
 */
export interface Member {
  // Identifiers
  id: string;
  name: string;
  
  // Model Input Features (The "Cleaned 18")
  credit_score: number;
  age: number;
  tenure: number;
  balance: number;
  products_number: number;
  credit_card: number;      // Binary 0/1
  active_member: number;    // Binary 0/1
  estimated_salary: number;
  
  // Engineered Features (Notebook 02/03)
  balance_salary_ratio: number;
  tenure_age_ratio: number;
  engagement_score: number;
  is_zero_balance: number;  // Binary 0/1
  
  // Categorical Encoding (One-Hot Result)
  country_Germany: number;
  country_Spain: number;
  gender: number;           // 0 for Female, 1 for Male (per our test_pipeline)
  grp_Adult: number;
  grp_Mid_Age: number;
  grp_Senior: number;

  // Metadata & Analytics (For UI components)
  region: string;           // Original string for display
  churnProbability: number; // The 'y_prob' from our model
  retirementReadinessScore: number;
  segment: SegmentType;
  lastNote: string;
  noteSentiment: Sentiment;
  pcaX: number;             // t-SNE coordinate for Segmentation plot
  pcaY: number;             // t-SNE coordinate for Segmentation plot
  missingDataScore: number; 
}

/**
 * PREDICTION REQUEST
 * This is the JSON object sent to FastAPI for the Live Simulator
 */
export type PredictionRequest = Pick<Member, 
  | 'credit_score' | 'age' | 'tenure' | 'balance' | 'products_number' 
  | 'credit_card' | 'active_member' | 'estimated_salary' 
  | 'balance_salary_ratio' | 'tenure_age_ratio' | 'engagement_score' 
  | 'is_zero_balance' | 'country_Germany' | 'country_Spain' 
  | 'gender' | 'grp_Adult' | 'grp_Mid_Age' | 'grp_Senior'
>;