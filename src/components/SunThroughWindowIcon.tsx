import React, { ReactNode } from 'react';

const SunThroughWindowIcon = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-fit h-fit p-2 rounded-full bg-[#ececec] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]">
      {/* Content goes here */} {children}
    </div>
  );
};

export default SunThroughWindowIcon;
