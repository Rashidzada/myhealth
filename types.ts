
export type BloodSugarData = {
  type: 'bloodSugar';
  value: number; // in mg/dL
  date: string;
};

export type BloodPressureData = {
  type: 'bloodPressure';
  value: {
    systolic: number;
    diastolic: number;
  };
  date: string;
};

export type WeightData = {
  type: 'weight';
  value: number; // in kg
  date: string;
};

export type HealthData = BloodSugarData | BloodPressureData | WeightData;

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LOG_DATA = 'LOG_DATA',
  MEAL_ANALYZER = 'MEAL_ANALYZER',
  HEALTH_ASSISTANT = 'HEALTH_ASSISTANT',
}

export interface MealAnalysisResult {
  summary: string;
  good_for_sugar: string[];
  bad_for_sugar: string[];
  suggestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
