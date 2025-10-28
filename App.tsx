
import React, { useState, useCallback } from 'react';
import { HealthData, MealAnalysisResult, AppView } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LogDataForm from './components/LogDataForm';
import MealAnalyzer from './components/MealAnalyzer';
import HealthAssistant from './components/HealthAssistant';
import { analyzeMealWithGemini, getHealthAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [healthData, setHealthData] = useState<HealthData[]>([
    // Some initial data for demonstration
    { type: 'bloodSugar', value: 110, date: new Date('2023-10-26T08:00:00').toISOString() },
    { type: 'bloodPressure', value: { systolic: 120, diastolic: 80 }, date: new Date('2023-10-26T08:00:00').toISOString() },
    { type: 'weight', value: 75, date: new Date('2023-10-26T08:00:00').toISOString() },
    { type: 'bloodSugar', value: 140, date: new Date('2023-10-26T14:00:00').toISOString() },
    { type: 'bloodSugar', value: 105, date: new Date('2023-10-27T08:30:00').toISOString() },
    { type: 'bloodPressure', value: { systolic: 122, diastolic: 81 }, date: new Date('2023-10-27T08:30:00').toISOString() },
    { type: 'weight', value: 74.8, date: new Date('2023-10-27T08:30:00').toISOString() },
  ]);
  
  const [mealAnalysisResult, setMealAnalysisResult] = useState<MealAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const addHealthData = useCallback((data: Omit<HealthData, 'date'>) => {
    setHealthData(prevData => [
      ...prevData,
      { ...data, date: new Date().toISOString() }
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const handleAnalyzeMeal = useCallback(async (mealDescription: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setMealAnalysisResult(null);
    try {
      const result = await analyzeMealWithGemini(mealDescription);
      setMealAnalysisResult(result);
    } catch (error) {
      console.error("Meal analysis failed:", error);
      setAnalysisError("Sorry, I couldn't analyze the meal. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.LOG_DATA:
        return <LogDataForm onSubmit={addHealthData} onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.MEAL_ANALYZER:
        return <MealAnalyzer 
                  onAnalyze={handleAnalyzeMeal} 
                  result={mealAnalysisResult} 
                  isLoading={isAnalyzing} 
                  error={analysisError}
                />;
      case AppView.HEALTH_ASSISTANT:
        return <HealthAssistant getAdvice={getHealthAdvice} />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard healthData={healthData} onLogData={() => setCurrentView(AppView.LOG_DATA)} />;
    }
  };

  return (
    <div className="bg-background min-h-screen font-sans text-on-surface">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
