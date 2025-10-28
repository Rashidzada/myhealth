
import React, { useState } from 'react';
import { HealthData } from '../types';

interface LogDataFormProps {
  onSubmit: (data: Omit<HealthData, 'date'>) => void;
  onCancel: () => void;
}

type DataType = 'bloodSugar' | 'bloodPressure' | 'weight';

const LogDataForm: React.FC<LogDataFormProps> = ({ onSubmit, onCancel }) => {
  const [dataType, setDataType] = useState<DataType>('bloodSugar');
  const [bloodSugar, setBloodSugar] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let data: Omit<HealthData, 'date'> | null = null;
    switch (dataType) {
      case 'bloodSugar':
        if (bloodSugar) data = { type: 'bloodSugar', value: parseFloat(bloodSugar) };
        break;
      case 'bloodPressure':
        if (systolic && diastolic) data = { type: 'bloodPressure', value: { systolic: parseInt(systolic), diastolic: parseInt(diastolic) } };
        break;
      case 'weight':
        if (weight) data = { type: 'weight', value: parseFloat(weight) };
        break;
    }
    if (data) {
      onSubmit(data);
    }
  };

  const renderFormFields = () => {
    switch (dataType) {
      case 'bloodSugar':
        return (
          <div>
            <label htmlFor="bloodSugar" className="block text-sm font-medium text-gray-700">Blood Sugar (mg/dL)</label>
            <input
              type="number"
              id="bloodSugar"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., 120"
              required
            />
          </div>
        );
      case 'bloodPressure':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="systolic" className="block text-sm font-medium text-gray-700">Systolic (mmHg)</label>
              <input
                type="number"
                id="systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., 120"
                required
              />
            </div>
            <div>
              <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700">Diastolic (mmHg)</label>
              <input
                type="number"
                id="diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., 80"
                required
              />
            </div>
          </div>
        );
      case 'weight':
        return (
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="e.g., 75.5"
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-surface rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-on-surface mb-6">Log New Health Data</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Select data type</label>
        <div className="mt-2 flex rounded-md shadow-sm">
          {(['bloodSugar', 'bloodPressure', 'weight'] as DataType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setDataType(type)}
              className={`flex-1 px-4 py-2 text-sm font-medium border
                ${dataType === type ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
                ${type === 'bloodSugar' ? 'rounded-l-md' : ''}
                ${type === 'weight' ? 'rounded-r-md' : ''}`}
            >
              {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFormFields()}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogDataForm;
