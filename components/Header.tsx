import React from 'react';
import Logo from './Logo';

const IconSettings: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const UserAvatar: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
        A
    </div>
)


const Header: React.FC = () => (
  <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-surface-light flex-shrink-0">
    <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Logo className="h-10 w-auto" />
        </div>
        <div className="flex items-center space-x-4">
            <button className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                <IconSettings className="h-6 w-6" />
            </button>
            <UserAvatar />
        </div>
    </div>
  </header>
);

export default Header;