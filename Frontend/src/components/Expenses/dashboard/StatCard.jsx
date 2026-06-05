import React from 'react';

const StatCard = ({ title, amount, icon, tendency, type }) => {
  const isPositive = tendency > 0;
  
  return (
    <div className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-brand-primary">
          {icon}
        </div>
        {tendency !== undefined && tendency !== null && !isNaN(Number(tendency)) && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-brand-accent' : tendency === 0 ? 'text-slate-400' : 'text-brand-danger'}`}>
            {isPositive ? '↑' : tendency === 0 ? '-' : '↓'}
            <span>{Math.abs(tendency)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-handjet text-white tracking-widest">
          ₹ {amount.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;