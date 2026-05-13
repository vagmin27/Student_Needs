import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.js';
import {
  FileText,
  Briefcase,
  QrCode,
  Users,
  CheckSquare,
} from 'lucide-react';

/**
 * TabNavigation Component
 * Handles switching between different views in the student dashboard.
 * @param {Object} props
 * @param {'profile' | 'jobs' | 'referrals' | 'qrcode' | 'applied'} props.activeTab - The currently active route
 * @param {Object|null} props.student - Student profile data (used to check for resumeHash)
 * @param {number} [props.appliedCount=0] - Number of jobs applied to, shown as a badge
 */
export function TabNavigation({ activeTab, student, appliedCount = 0 }) {
  return (
    <div className="flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-muted rounded-lg w-full sm:w-fit mx-auto flex-wrap justify-center">
      {/* Referrals Tab */}
      <Link
        to="/student/referrals"
        className={cn(
          'px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center',
          activeTab === 'referrals'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Referrals
      </Link>

      {/* Applied Jobs Tab with Count Badge */}
      <Link
        to="/student/applied"
        className={cn(
          'px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2',
          activeTab === 'applied'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Applied Jobs
        {appliedCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
            {appliedCount}
          </span>
        )}
      </Link>

      {/* Browse Jobs Tab */}
      <Link
        to="/student/jobs"
        className={cn(
          'px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center',
          activeTab === 'jobs'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Browse Jobs
      </Link>

      {/* My Profile Tab */}
      <Link
        to="/student/profile"
        className={cn(
          'px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center',
          activeTab === 'profile'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        My Profile
      </Link>

      {/* QR Code Tab - Only visible if the student has a resumeHash (on-chain record) */}
      {student?.resumeHash && (
        <Link
          to="/student/qrcode"
          className={cn(
            'px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center',
            activeTab === 'qrcode'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          My QR Code
        </Link>
      )}
    </div>
  );
}