import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, description, icon, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {icon && <div className="mb-4 text-indigo-600">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};
