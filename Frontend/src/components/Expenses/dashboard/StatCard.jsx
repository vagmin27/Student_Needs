import React from 'react';

const StatCard = ({ title, amount, icon, tendency, type }) => {
  const isPositive = tendency > 0;
  
  return (
    <div className="glass-card flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-[var(--radius-md)] bg-secondary border border-border text-primary">
          {icon}
        </div>
        {tendency !== undefined && tendency !== null && !isNaN(Number(tendency)) && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : tendency === 0 ? 'text-muted-foreground' : 'text-rose-500'}`}>
            {isPositive ? '↑' : tendency === 0 ? '-' : '↓'}
            <span>{Math.abs(tendency)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground">
          ₹ {amount.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;