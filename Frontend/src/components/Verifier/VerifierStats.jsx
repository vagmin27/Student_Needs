import { cn } from '@/lib/utils.js';

/**
 * VerifierStats Component
 * Displays summary statistics for student resume verifications and acts as a filter controller.
 * * @param {Object} props
 * @param {Array} props.students - Array of student objects to calculate stats from.
 * @param {'all' | 'unverified' | 'verified' | 'rejected'} props.filter - The currently active filter.
 * @param {Function} props.onFilterChange - Callback function triggered when a stat card is clicked.
 */
export function VerifierStats({ students = [], filter, onFilterChange }) {
  // Logic to calculate counts based on student resume status
  const stats = [
    { 
      label: 'Total', 
      count: students.length, 
      filter: 'all' 
    },
    { 
      label: 'Pending', 
      count: students.filter(s => s.resumeStatus === 'unverified').length, 
      filter: 'unverified' 
    },
    { 
      label: 'Verified', 
      count: students.filter(s => s.resumeStatus === 'verified').length, 
      filter: 'verified' 
    },
    { 
      label: 'Rejected', 
      count: students.filter(s => s.resumeStatus === 'rejected').length, 
      filter: 'rejected' 
    },
  ];

  return (
    <div className="grid sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <button
          key={stat.label}
          onClick={() => onFilterChange(stat.filter)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all text-left',
            filter === stat.filter
              ? 'border-primary bg-primary/5'
              : 'border-border/50 bg-card hover:border-primary/50'
          )}
        >
          <p className="text-2xl font-bold text-foreground">{stat.count}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </button>
      ))}
    </div>
  );
}