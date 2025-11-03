import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-brand-surface shadow-glow rounded-2xl overflow-hidden border border-brand-surface-light hover:border-brand-primary/30 hover:shadow-glow-lg transition-all duration-300 ${className}`}>
      {title && (
        <div className="p-4 sm:p-6 border-b border-brand-surface-light">
          <h3 className="text-xl font-bold text-brand-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;