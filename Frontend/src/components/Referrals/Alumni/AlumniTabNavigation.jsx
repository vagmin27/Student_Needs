import { cn } from '@/lib/Referrals/utils.js';
import { Briefcase, Users, Star, FileText, User } from 'lucide-react';

/**
 * Tab navigation for the Alumni Dashboard.
 * @param {Object} props
 * @param {'jobs' | 'candidates' | 'referrals' | 'applications' | 'profile'} props.activeTab - Currently active tab
 * @param {Function} props.setActiveTab - State setter to change the active tab
 */
export function AlumniTabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit flex-wrap">
      {/* Referrals Tab */}
      <button
        onClick={() => setActiveTab('referrals')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'referrals'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Star className="w-4 h-4 inline-block mr-2" />
        My Referrals
      </button>

      {/* Jobs Tab */}
      <button
        onClick={() => setActiveTab('jobs')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'jobs'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Briefcase className="w-4 h-4 inline-block mr-2" />
        Posted Jobs
      </button>

      {/* Applications Tab */}
      <button
        onClick={() => setActiveTab('applications')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'applications'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <FileText className="w-4 h-4 inline-block mr-2" />
        Applications
      </button>

      {/* Candidates Tab */}
      <button
        onClick={() => setActiveTab('candidates')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'candidates'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Users className="w-4 h-4 inline-block mr-2" />
        Verified Candidates
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => setActiveTab('profile')}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeTab === 'profile'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <User className="w-4 h-4 inline-block mr-2" />
        Profile
      </button>
    </div>
  );
}