import React from 'react';

type SkeletonProps = {
  className?: string;
  variant?: 'default' | 'card' | 'list-item' | 'text' | 'circle';
  lines?: number;
};

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'default',
  lines = 1 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded-md';
  
  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="h-48 bg-gray-300 rounded-t-md mb-3"></div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    );
  }
  
  if (variant === 'list-item') {
    return (
      <div className={`${baseClasses} flex items-center gap-3 p-2 ${className}`}>
        <div className="h-12 w-12 bg-gray-300 rounded-md flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
      </div>
    );
  }
  
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    );
  }
  
  if (variant === 'circle') {
    return (
      <div className={`${baseClasses} rounded-full ${className}`}></div>
    );
  }
  
  return <div className={`${baseClasses} ${className}`}></div>;
};

export default Skeleton;
