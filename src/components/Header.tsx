
import React from 'react';

const Header = () => {
  return (
    <div className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/b294f686-9842-4bdf-9bdd-3f0252e30686.png" 
          alt="FinControl Logo" 
          className="w-8 h-8 object-contain"
        />
        <h1 className="text-xl font-bold text-foreground">FinControl</h1>
      </div>
    </div>
  );
};

export default Header;
