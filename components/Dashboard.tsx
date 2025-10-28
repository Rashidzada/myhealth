
import React from 'react';
import { HealthData, BloodSugarData, BloodPressureData, WeightData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusIcon, ArrowRightIcon } from './icons';

interface DashboardProps {
  healthData: HealthData[];
  onLogData: () => void;
}

const MetricCard: React.FC<{ title: string; value: string; unit: string; date: string; }> = ({ title, value, unit, date }) => (
    <div className="bg-surface rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
        <div>
            <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
            <p className="text-3xl font-bold text-primary mt-2">{value} <span className="text-xl font-medium text-subtle">{unit}</span></p>
        </div>
        <p className="text-sm text-subtle mt-4">Last updated: {new Date(date).toLocaleString()}</p>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface rounded-xl shadow-md p-6 mt-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-on-surface mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>{children}</ResponsiveContainer>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ healthData, onLogData }) => {
  const latestBloodSugar = healthData.find(d => d.type === 'bloodSugar') as BloodSugarData | undefined;
  const latestBloodPressure = healthData.find(d => d.type === 'bloodPressure') as BloodPressureData | undefined;
  const latestWeight = healthData.find(d => d.type === 'weight') as WeightData | undefined;

  const chartData = healthData
    .map(d => ({
        ...d,
        date: new Date(d.date),
        name: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
    .sort((a,b) => a.date.getTime() - b.date.getTime());

  const bloodSugarHistory = chartData.filter(d => d.type === 'bloodSugar');
  const bloodPressureHistory = chartData.filter(d => d.type === 'bloodPressure');
  const weightHistory = chartData.filter(d => d.type === 'weight');

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-on-surface">Your Health Dashboard</h2>
            <button
                onClick={onLogData}
                className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-primary-focus transition-colors duration-300"
            >
                <PlusIcon className="h-5 w-5 mr-2" />
                Log New Data
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard 
                title="Blood Sugar" 
                value={latestBloodSugar?.value.toString() ?? 'N/A'}
                unit="mg/dL"
                date={latestBloodSugar?.date ?? ''}
            />
            <MetricCard 
                title="Blood Pressure" 
                value={latestBloodPressure ? `${latestBloodPressure.value.systolic}/${latestBloodPressure.value.diastolic}` : 'N/A'}
                unit="mmHg"
                date={latestBloodPressure?.date ?? ''}
            />
            <MetricCard 
                title="Weight" 
                value={latestWeight?.value.toString() ?? 'N/A'}
                unit="kg"
                date={latestWeight?.date ?? ''}
            />
        </div>

        {bloodSugarHistory.length > 1 && (
            <ChartCard title="Blood Sugar Trend">
                <LineChart data={bloodSugarHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} name="Blood Sugar (mg/dL)" />
                </LineChart>
            </ChartCard>
        )}

        {bloodPressureHistory.length > 1 && (
            <ChartCard title="Blood Pressure Trend">
                <LineChart data={bloodPressureHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip formatter={(value, name) => [`${value} mmHg`, name === 'value.systolic' ? 'Systolic' : 'Diastolic']} />
                    <Legend />
                    <Line type="monotone" dataKey="value.systolic" stroke="#3B82F6" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="value.diastolic" stroke="#EF4444" strokeWidth={2} name="Diastolic" />
                </LineChart>
            </ChartCard>
        )}

        {weightHistory.length > 1 && (
            <ChartCard title="Weight Trend">
                <LineChart data={weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} name="Weight (kg)" />
                </LineChart>
            </ChartCard>
        )}
        {healthData.length === 0 && (
             <div className="text-center py-20 bg-surface rounded-lg shadow-md mt-6">
                <h3 className="text-2xl font-semibold text-on-surface">Welcome to Health Guardian!</h3>
                <p className="text-subtle mt-2">Log your first health metric to see your dashboard.</p>
                <button onClick={onLogData} className="mt-6 inline-flex items-center bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-focus transition-transform duration-300 hover:scale-105">
                   Get Started <ArrowRightIcon className="h-5 w-5 ml-2"/>
                </button>
            </div>
        )}
    </div>
  );
};

export default Dashboard;
