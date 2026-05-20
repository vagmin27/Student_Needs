import React from 'react';

const Skeleton = ({ type = 'card', lines = 3 }) => {
  const classes = {
    card: "w-full h-32 rounded-2xl",
    tableRow: "w-full h-12 rounded-lg",
    stat: "w-1/2 h-8 rounded-lg mb-2",
    text: "w-full h-4 rounded mt-4",
    avatar: "w-12 h-12 rounded-full",
    chart: "w-full h-[300px] rounded-2xl"
  };

  const baseClass = "bg-white/10 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(lines)]?.map((_, i) => (
          <div key={i} className={`${classes.tableRow} ${baseClass}`}></div>
        ))}
      </div>
    );
  }

  if (type === 'statCard') {
    return (
       <div className={`glass-panel p-6 ${baseClass}`}>
          <div className="flex items-center gap-4 mb-4">
             <div className={`${classes.avatar} bg-slate-700/50`}></div>
             <div className="space-y-2 w-1/2">
                <div className="h-4 bg-slate-700/50 rounded w-full"></div>
                <div className="h-3 bg-slate-700/50 rounded w-2/3"></div>
             </div>
          </div>
          <div className={`${classes.stat} bg-slate-700/50 mt-4`}></div>
       </div>
    );
  }

  return <div className={`${classes[type] || classes.card} ${baseClass}`}></div>;
};

export default Skeleton;