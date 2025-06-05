
import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function MobileLayout({ children, title, className = "" }: MobileLayoutProps) {
  return (
    <div className={`min-h-full bg-gray-50 ${className}`}>
      {title && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      )}
      <div className="px-4 py-4 pb-20">
        {children}
      </div>
    </div>
  );
}
