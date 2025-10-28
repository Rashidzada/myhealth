
import React, { useState } from 'react';
import { MealAnalysisResult } from '../types';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon } from './icons';

interface MealAnalyzerProps {
  onAnalyze: (mealDescription: string) => void;
  result: MealAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const AnalysisCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: 'green' | 'red' | 'amber' }> = ({ title, items, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
  };
  if (!items || items.length === 0) return null;
  
  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <h3 className="font-bold flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  );
};

const MealAnalyzer: React.FC<MealAnalyzerProps> = ({ onAnalyze, result, isLoading, error }) => {
  const [meal, setMeal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meal.trim()) {
      onAnalyze(meal);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center">
        <SparklesIcon className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-2 text-3xl font-bold text-on-surface">AI Meal Analyzer</h2>
        <p className="mt-2 text-lg text-subtle">
          Describe your meal, and our AI will give you insights on its potential impact on your blood sugar.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8">
        <textarea
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder="e.g., A bowl of oatmeal with brown sugar, bananas, and a glass of orange juice"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition"
          rows={4}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !meal.trim()}
          className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-focus disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze My Meal'
          )}
        </button>
      </form>

      {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-8 bg-surface rounded-xl shadow-md p-6 animate-fade-in">
          <h3 className="text-2xl font-bold text-on-surface">Analysis Results</h3>
          <p className="mt-2 text-subtle italic">"{result.summary}"</p>
          <div className="mt-6 space-y-4">
            <AnalysisCard title="Good for Sugar" items={result.good_for_sugar} icon={<CheckCircleIcon className="h-5 w-5" />} color="green" />
            <AnalysisCard title="Consider Moderation" items={result.bad_for_sugar} icon={<XCircleIcon className="h-5 w-5" />} color="red" />
            <AnalysisCard title="Healthier Suggestions" items={result.suggestions} icon={<LightBulbIcon className="h-5 w-5" />} color="amber" />
          </div>
          <p className="text-xs text-subtle mt-6 text-center">Disclaimer: This analysis is AI-generated and for informational purposes only. It is not a substitute for professional medical advice.</p>
        </div>
      )}
    </div>
  );
};

export default MealAnalyzer;
