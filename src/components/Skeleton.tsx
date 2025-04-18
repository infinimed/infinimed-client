import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

export default Skeleton;
