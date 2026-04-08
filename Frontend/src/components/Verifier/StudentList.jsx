import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

/**
 * StudentList Component
 * Renders a selectable list of students and their resume statuses for the verifier dashboard.
 * * @param {Object} props
 * @param {Array} props.students - Array of student objects
 * @param {Object|null} props.selectedStudent - The currently active student object
 * @param {Function} props.onSelectStudent - Callback function when a student is clicked
 */
export function StudentList({ students = [], selectedStudent, onSelectStudent }) {
  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Student Resumes
        </h3>
      </div>

      {/* List Container */}
      <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
        {students.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No resumes to review
          </div>
        ) : (
          students.map((student) => (
            <motion.button
              key={student.walletAddress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => onSelectStudent(student)}
              className={cn(
                'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                selectedStudent?.walletAddress === student.walletAddress &&
                  'bg-verifier/5'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.college} • {student.department}
                  </p>
                </div>
                {/* StatusBadge handles the visual representation of 'verified', 'unverified', etc. */}
                <StatusBadge status={student.resumeStatus} />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}