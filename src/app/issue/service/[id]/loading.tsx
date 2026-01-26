import React from 'react';
import Skeleton from '@/components/Skeleton';

const loading: React.FC = () => {
  return (
    <div className="w-full p-4 space-y-4">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  );
};
export default loading;
