import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Mail,
  Building2,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';

/**
 * StudentDetails Component
 * Displays the profile and resume information for a selected student and provides verification actions.
 * * @param {Object} props
 * @param {Object|null} props.student - The student data object
 * @param {boolean} props.isProcessing - Loading state for the verify/reject actions
 * @param {'verify' | 'reject' | null} props.processingAction - Specifically which action is currently loading
 * @param {Function} props.onVerify - Async handler for verification (receives true for approve, false for reject)
 */
export function StudentDetails({ student, isProcessing, processingAction, onVerify }) {
  
  // Empty State: No student selected
  if (!student) {
    return (
      <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Student Details</h3>
        </div>
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Select a student to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Student Details</h3>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-6"
      >
        {/* Profile Info Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium text-foreground">{student.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-foreground">{student.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">College:</span>
            <span className="font-medium text-foreground">{student.college}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Department:</span>
            <span className="font-medium text-foreground">{student.department}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Graduation:</span>
            <span className="font-medium text-foreground">{student.graduationYear}</span>
          </div>
        </div>

        {/* Resume Info Section */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Resume File</p>
              <p className="font-medium text-foreground text-sm">
                {student.resumeFileName || 'Resume uploaded'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section: Only shown if student is unverified */}
        {student.resumeStatus === 'unverified' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Review Resume:</strong> Your decision will be recorded in the system.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="success"
                className="flex-1"
                onClick={() => onVerify(true)}
                disabled={isProcessing}
              >
                {processingAction === 'verify' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Verify Resume
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onVerify(false)}
                disabled={isProcessing}
              >
                {processingAction === 'reject' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject Resume
              </Button>
            </div>
          </div>
        )}

        {/* Status Display: Shown if student is already processed */}
        {student.resumeStatus !== 'unverified' && (
          <div className="p-4 rounded-xl bg-muted/50 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This resume has been{' '}
              <span className={cn(
                'font-medium capitalize',
                student.resumeStatus === 'verified' ? 'text-success' : 'text-destructive'
              )}>
                {student.resumeStatus}
              </span>
            </p>
            {student.verifiedAt && (
              <p className="text-xs text-muted-foreground">
                on {new Date(student.verifiedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}