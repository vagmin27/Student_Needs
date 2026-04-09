import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { storage } from "@/lib/storage.js";
import { Button } from "@/components/ui/button.jsx";
import { StatusBadge } from "@/components/StatusBadge.jsx";
import {
  showToast,
  dismissToast,
} from "@/components/TransactionToast";
import { ProfileForm } from "@/components/Student/ProfileForm.jsx";
import { ResumeUpload } from "@/components/Student/ResumeUpload.jsx";
import { JobsList } from "@/components/Student/JobsList.jsx";
import { ReferralsList } from "@/components/Student/ReferralsList.jsx";
import { OpportunitiesList } from "@/components/Student/OpportunitiesList.jsx";
import { QRCodeSection } from "@/components/Student/QRCodeSection.jsx";
import { TabNavigation } from "@/components/Student/TabNavigation.jsx";
import { ExternalJobsList } from "@/components/Student/ExternalJobsList.jsx";
import { StudentProfilePage } from "@/pages/StudentProfile.jsx";
import { ProfileCompletionModal } from "@/components/Student/ProfileCompletionModal.jsx";
import { OpportunityDetailModal } from "@/components/Student/OpportunityDetailModal.jsx";
import { AppliedJobsList } from "@/components/Student/AppliedJobsList.jsx";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { externalJobsApi } from "@/services/externalJobs.js";
import { opportunitiesApi } from "@/services/opportunities.js";
import { studentProfileApi } from "@/services/studentProfile.js";

export function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [externalJobs, setExternalJobs] = useState([]);
  const [loadingExternalJobs, setLoadingExternalJobs] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isApplying, setIsApplying] = useState(null);
  
  // Profile completion modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [pendingOpportunityId, setPendingOpportunityId] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  
  // Opportunity detail modal state
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Applied jobs state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }
  }, [navigate]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    department: "",
    graduationYear: new Date().getFullYear() + 1,
  });

  // Determine active tab from URL
  const getActiveTab = () => {
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/jobs')) return 'jobs';
    if (location.pathname.includes('/qrcode')) return 'qrcode';
    if (location.pathname.includes('/applied')) return 'applied';
    return 'referrals';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setJobs(storage.getJobs());
      
      // Fetch opportunities from backend
      fetchOpportunities();
      
      // Fetch profile status
      fetchProfileStatus();
      
      // Fetch applied opportunities
      fetchAppliedOpportunities();
    }
  }, []);

  // Fetch external jobs when jobs tab is active
  useEffect(() => {
    if (activeTab === 'jobs' && externalJobs.length === 0) {
      fetchExternalJobs();
    }
  }, [activeTab, externalJobs.length]);

  const fetchProfileStatus = async () => {
    try {
      const response = await studentProfileApi.getProfileStatus();
      if (response.success) {
        setProfileStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile status:', error);
    }
  };

  const fetchAppliedOpportunities = async () => {
    setLoadingApplications(true);
    try {
      const response = await opportunitiesApi.getMyApplications();
      if (response.success && response.data) {
        const applications = response.data.applications || [];
        setMyApplications(applications);
        const appliedIds = applications.map(app => app.opportunity._id);
        setAppliedOpportunities(appliedIds);
      }
    } catch (error) {
      console.error('Error fetching applied opportunities:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewDetails = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDetailModal(true);
  };

  const fetchOpportunities = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }

    setLoadingOpportunities(true);
    try {
      const response = await opportunitiesApi.getOpportunities();
      if (response.success) {
        setOpportunities(response.data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      if (error.response?.status !== 401) {
        showToast({
          type: "error",
          message: error.response?.data?.message || "Failed to load opportunities",
        });
      }
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const fetchExternalJobs = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/auth/student/login');
      return;
    }

    setLoadingExternalJobs(true);
    try {
      const response = await externalJobsApi.getExternalJobs(1);
      if (response.success) {
        setExternalJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching external jobs:', error);
      if (error.response?.status !== 401) {
        showToast({
          type: "error",
          message: "Failed to load external jobs",
        });
      }
    } finally {
      setLoadingExternalJobs(false);
    }
  };

  // Redirect /student to /student/referrals by default
  if (location.pathname === '/student') {
    return <Navigate to="/student/referrals" replace />;
  }

  const handleSubmitResume = async (resumeFile) => {
    if (!resumeFile) return;

    setIsUploading(true);
    const toastId = showToast({
      type: "pending",
      message: "Uploading resume...",
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      dismissToast(toastId);
      showToast({
        type: "success",
        message: "Resume uploaded successfully!",
      });

      const userId = localStorage.getItem('user_id') || 'guest';
      const newStudent = {
        walletAddress: userId,
        ...formData,
        resumeFileName: resumeFile.name,
        resumeHash: `hash_${Date.now()}`,
        resumeStatus: "unverified",
        submittedAt: new Date().toISOString(),
        appliedJobs: student?.appliedJobs || [],
        txHash: `tx_${Date.now()}`,
        ipfsCid: `cid_${Date.now()}`,
        ipfsUrl: `https://example.com/resume`,
      };

      storage.saveStudent(newStudent);
      setStudent(newStudent);
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: "error",
        message: error.message || "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const statusResponse = await studentProfileApi.getProfileStatus();
      setProfileStatus(statusResponse.data);
      
      if (statusResponse.data.completeness < 100) {
        setPendingOpportunityId(jobId);
        setShowProfileModal(true);
        return;
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      showToast({
        type: "error",
        message: "Failed to check profile status. Please try again.",
      });
      return;
    }

    await submitApplication(jobId);
  };

  const submitApplication = async (jobId) => {
    setIsApplying(jobId);
    const toastId = showToast({
      type: "pending",
      message: "Submitting application...",
    });

    try {
      const response = await opportunitiesApi.applyForReferral(jobId);

      dismissToast(toastId);
      showToast({
        type: "success",
        message: response.message || "Application submitted successfully!",
      });

      setAppliedOpportunities(prev => [...prev, jobId]);
      await fetchOpportunities();
      await fetchAppliedOpportunities();

    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Application failed",
      });
    } finally {
      setIsApplying(null);
    }
  };

  const handleProfileComplete = async () => {
    setShowProfileModal(false);
    await fetchProfileStatus();
    
    if (pendingOpportunityId) {
      await submitApplication(pendingOpportunityId);
      setPendingOpportunityId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-20 sm:mt-24 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-foreground">
            <span className="gradient-text2">Student </span>
            <span className="gradient-text3">Dashboard</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload your resume and apply for referrals
          </p>
        </div>
        {student && <StatusBadge status={student.resumeStatus} />}
      </div>

      {/* Tabs */}
      <TabNavigation
        activeTab={activeTab}
        student={student}
        appliedCount={myApplications.length}
      />

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StudentProfilePage />
        </motion.div>
      )}

      {/* Referrals Tab */}
      {activeTab === "referrals" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Referral Opportunities from Alumni
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Connect with alumni from your college and get referred
            </p>
          </div>
          <OpportunitiesList
            opportunities={opportunities.filter(opp => !appliedOpportunities.includes(opp._id))}
            appliedOpportunities={appliedOpportunities}
            loading={loadingOpportunities}
            isApplying={isApplying}
            onApply={handleApplyJob}
            onViewDetails={handleViewDetails}
            canApply={true}
          />
        </motion.div>
      )}

      {/* Applied Jobs Tab */}
      {activeTab === "applied" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              My Applications
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track the status of your referral applications
            </p>
          </div>
          <AppliedJobsList
            applications={myApplications}
            loading={loadingApplications}
          />
        </motion.div>
      )}

      {/* Jobs Tab - External Jobs */}
      {activeTab === "jobs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Browse Jobs from Around the World
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover opportunities from global companies
            </p>
          </div>
          <ExternalJobsList 
            jobs={externalJobs} 
            loading={loadingExternalJobs}
          />
        </motion.div>
      )}

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <JobsList
            jobs={jobs}
            student={student}
            isApplying={isApplying}
            onApply={handleApplyJob}
          />
        </motion.div>
      )}

      {/* QR Code Tab */}
      {activeTab === "qrcode" && student && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QRCodeSection student={student} address={student.walletAddress || ''} />
        </motion.div>
      )}

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setPendingOpportunityId(null);
        }}
        onComplete={handleProfileComplete}
        profileStatus={profileStatus}
      />

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedOpportunity(null);
        }}
        onApply={async (opportunityId) => {
          setShowDetailModal(false);
          await handleApplyJob(opportunityId);
        }}
        isApplying={isApplying === selectedOpportunity?._id}
        hasApplied={selectedOpportunity ? appliedOpportunities.includes(selectedOpportunity._id) : false}
      />
    </div>
  );
}