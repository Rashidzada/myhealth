
import React from 'react';
import { AppView } from '../types';
import { ChartBarIcon, DocumentAddIcon, SparklesIcon, ChatAlt2Icon } from './icons';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const NavItem: React.FC<{
  label: string;
  view: AppView;
  currentView: AppView;
  onClick: (view: AppView) => void;
  icon: React.ReactNode;
}> = ({ label, view, currentView, onClick, icon }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-surface shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <div className="flex-shrink-0 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
             </div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface ml-3">Health Guardian AI</h1>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <NavItem
              label="Dashboard"
              view={AppView.DASHBOARD}
              currentView={currentView}
              onClick={setCurrentView}
              icon={<ChartBarIcon className="h-5 w-5"/>}
            />
            <NavItem
              label="Log Data"
              view={AppView.LOG_DATA}
              currentView={currentView}
              onClick={setCurrentView}
              icon={<DocumentAddIcon className="h-5 w-5"/>}
            />
            <NavItem
              label="Meal AI"
              view={AppView.MEAL_ANALYZER}
              currentView={currentView}
              onClick={setCurrentView}
              icon={<SparklesIcon className="h-5 w-5"/>}
            />
             <NavItem
              label="Assistant"
              view={AppView.HEALTH_ASSISTANT}
              currentView={currentView}
              onClick={setCurrentView}
              icon={<ChatAlt2Icon className="h-5 w-5"/>}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
