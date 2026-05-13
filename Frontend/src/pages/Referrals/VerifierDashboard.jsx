import { useState, useEffect } from 'react';
import { useAuth } from '@/services/Auth/AuthContext.jsx';
import { storage } from '@/lib/storage.js';
import { VerifierStats } from '@/components/Verifier/VerifierStats.jsx';
import { StudentList } from '@/components/Verifier/StudentList.jsx';
import { StudentDetails } from '@/components/Verifier/StudentDetails.jsx';
import { showToast, dismissToast } from '@/components/TransactionToast.jsx';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';

export function VerifierDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const verifierName = user ? `${user.firstName} ${user.lastName}` : 'Verifier';

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, filter]);

  const loadStudents = () => {
    // Get all students from storage
    const allStudents = Object.values(storage.getStudents());
    setStudents(allStudents);
  };

  const filterStudents = () => {
    if (filter === 'all') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(s => s.resumeStatus === filter));
    }
  };

  const handleVerify = async (approved) => {
    if (!selectedStudent) return;

    const action = approved ? 'verify' : 'reject';
    setProcessingAction(action);
    setIsProcessing(true);

    const toastId = showToast({
      type: 'pending',
      message: `${approved ? 'Verifying' : 'Rejecting'} resume...`,
    });

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update student status
      const updatedStudent = {
        ...selectedStudent,
        resumeStatus: approved ? 'verified' : 'rejected',
        verifiedAt: new Date().toISOString(),
        verifiedBy: user?._id || 'unknown',
      };

      // Save to storage
      storage.saveStudent(updatedStudent);

      dismissToast(toastId);
      showToast({
        type: 'success',
        message: `Resume ${approved ? 'verified' : 'rejected'} successfully`,
      });

      // Reload data
      loadStudents();
      setSelectedStudent(updatedStudent);
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.message || 'Action failed',
      });
    } finally {
      setIsProcessing(false);
      setProcessingAction(null);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6 mt-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Verifier Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {verifierName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-verifier">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-semibold">Verifier Role</span>
        </div>
      </div>

      {/* Stats */}
      <VerifierStats
        students={students}
        filter={filter}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        <StudentList
          students={filteredStudents}
          selectedStudent={selectedStudent}
          onSelectStudent={setSelectedStudent}
        />
        <StudentDetails
          student={selectedStudent}
          isProcessing={isProcessing}
          processingAction={processingAction}
          onVerify={handleVerify}
        />
      </div>
    </div>
  );
}