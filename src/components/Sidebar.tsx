import React from 'react';

type ViewMode = 'analyze' | 'history' | 'info' | 'azubi-helper';
const IconAzubi: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

interface SidebarProps {
    activeView: ViewMode;
    setActiveView: (view: ViewMode) => void;
}

// Custom Icons for Sidebar
const IconAnalyze: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
const IconHistory: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconInfo: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
            isActive 
            ? 'bg-brand-primary/10 text-brand-primary' 
            : 'text-brand-text-secondary hover:bg-brand-surface-light hover:text-brand-text-primary'
        }`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="w-64 bg-brand-surface flex-shrink-0 flex flex-col p-4 border-r border-brand-surface-light">
            <div className="flex-grow">
                <nav className="space-y-2">
                    <NavItem 
                        icon={<IconAnalyze className="h-6 w-6" />}
                        label="Analysieren"
                        isActive={activeView === 'analyze'}
                        onClick={() => setActiveView('analyze')}
                    />
                    <NavItem 
                        icon={<IconHistory className="h-6 w-6" />}
                        label="Verlauf"
                        isActive={activeView === 'history'}
                        onClick={() => setActiveView('history')}
                    />
                     <NavItem 
                        icon={<IconInfo className="h-6 w-6" />}
                        label="Info"
                        isActive={activeView === 'info'}
                        onClick={() => setActiveView('info')}
                    />
                    <NavItem 
                        icon={<IconAzubi className="h-6 w-6" />} 
                        label="Azubi-Helper" 
                        isActive={activeView === 'azubi-helper'} 
                        onClick={() => setActiveView('azubi-helper')} 
                    />
                </nav>
            </div>
            <div className="flex-shrink-0 text-center">
                 <p className="text-brand-text-secondary text-xs">
                    Ein Projekt von Alexander Schneider
                </p>
                <a 
                href="https://alexle135.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-primary/80 hover:text-brand-primary transition-colors text-xs mt-1 inline-block"
                >
                AlexLE135.de
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;