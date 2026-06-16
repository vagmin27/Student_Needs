import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import { storage } from "@/lib/Referrals/storage.js";
import { Button } from "@/components/Referrals/ui/button.jsx";
import { StatusBadge } from "@/components/Referrals/StatusBadge.jsx";
import { PageLayout, SectionContainer, PremiumCard } from "@/components/dashboard/shared/Primitives";
import {
  showToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast";
import { ProfileForm } from "@/components/Referrals/Student/ProfileForm.jsx";
import { ResumeUpload } from "@/components/Referrals/Student/ResumeUpload.jsx";

import { ReferralsList } from "@/components/Referrals/Student/ReferralsList.jsx";
import { OpportunitiesList } from "@/components/Referrals/Student/OpportunitiesList.jsx";
import { QRCodeSection } from "@/components/Referrals/Student/QRCodeSection.jsx";
import { TabNavigation } from "@/components/Referrals/Student/TabNavigation.jsx";

import { StudentProfilePage } from "@/pages/Referrals/StudentProfile.jsx";
import { ProfileCompletionModal } from "@/components/Referrals/Student/ProfileCompletionModal.jsx";
import { OpportunityDetailModal } from "@/components/Referrals/Student/OpportunityDetailModal.jsx";
import { AppliedJobsList } from "@/components/Referrals/Student/AppliedJobsList.jsx";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/Referrals/utils.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { useWebSocket } from "@/hooks/useWebSocket.js";
import { chatApi } from "@/services/Referrals/chat.js";

export function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const isUnifiedLayout = useContext(LayoutContext);
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

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
    if (location.pathname.includes('/jobs') || location.pathname.includes('/browse-jobs')) return 'jobs';
    if (location.pathname.includes('/qrcode')) return 'qrcode';
    if (location.pathname.includes('/applied') || location.pathname.includes('/applied-jobs')) return 'applied';
    return 'referrals';
  };

  const activeTab = getActiveTab();
  const isReferralRoute = location.pathname.startsWith("/referrals");

  const { isConnected, on, off } = useWebSocket();
  const [unreadChatsCount, setUnreadChatsCount] = useState(0);

  // Fetch unread chats count and listen to WebSocket message events
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await chatApi.getChats();
        if (response.success && Array.isArray(response.data)) {
          const count = response.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
          setUnreadChatsCount(count);
        }
      } catch (error) {
        console.error('Error fetching unread chats count:', error);
      }
    };

    fetchUnreadCount();

    const handleNewMessage = () => {
      fetchUnreadCount();
    };

    on('message', handleNewMessage);

    const interval = setInterval(fetchUnreadCount, 10000);

    return () => {
      off('message', handleNewMessage);
      clearInterval(interval);
    };
  }, [isConnected, on, off]);

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
        const appliedIds = applications?.map(app => app.opportunity._id);
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



  // Redirect /student to /student/referrals by default
  if (location.pathname === '/student') {
    return <Navigate to="/student/referrals" />;
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
      
      const chatId = response.data?.chat?._id;
      if (chatId) {
        toast.success(
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-foreground dark:text-slate-100">
                Application Submitted Successfully
              </span>
            </div>
            <button
              onClick={() => {
                toast.dismiss();
                navigate(`/referrals/chat?chatId=${chatId}`);
              }}
              className="mt-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] transition-all text-center flex items-center justify-center gap-1.5 w-full sm:w-auto self-start font-medium"
            >
              Message Alumni
            </button>
          </div>,
          { duration: 6000 }
        );
      } else {
        showToast({
          type: "success",
          message: "Application Submitted Successfully",
        });
      }

      setAppliedOpportunities(prev => [...prev, jobId]);
      await fetchOpportunities();
      await fetchAppliedOpportunities();
      window.dispatchEvent(new CustomEvent("opportunity_applied"));

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
    <PageLayout
      className={cn(
        "pb-8",
        (isUnifiedLayout || isReferralRoute) ? "mt-0" : "mt-20 sm:mt-24",
      )}
    >
      {isUnifiedLayout && !isReferralRoute && <BackToStudentDashboard />}
      {/* Header */}
      {!isReferralRoute && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col items-start justify-center gap-4">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
              Student Referral Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your resume and apply for referrals
            </p>
          </div>
          {student && <StatusBadge status={student.resumeStatus} />}
        </div>
      )}

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
          <div className="mb-4">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              Referral Opportunities from Alumni
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with alumni from across the platform and get referred
            </p>
          </div>
          <OpportunitiesList
            opportunities={opportunities?.filter(opp => 
              (opp.opportunityType === 'Referral' || !opp.opportunityType) && 
              !appliedOpportunities.includes(opp._id)
            )}
            appliedOpportunities={appliedOpportunities}
            loading={loadingOpportunities}
            isApplying={isApplying}
            onApply={handleApplyJob}
            onViewDetails={handleViewDetails}
            canApply={true}
            profileStatus={profileStatus}
          />
        </motion.div>
      )}

      {/* Applied Jobs Tab */}
      {activeTab === "applied" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              My Applications
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track the status of your referral applications
            </p>
          </div>
          <AppliedJobsList
            applications={myApplications}
            loading={loadingApplications}
          />
        </motion.div>
      )}

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              Jobs Posted by Alumni
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse exclusive job openings posted by alumni
            </p>
          </div>
          <OpportunitiesList
            opportunities={opportunities?.filter(opp => 
              opp.opportunityType === 'Job' && 
              !appliedOpportunities.includes(opp._id)
            )}
            appliedOpportunities={appliedOpportunities}
            loading={loadingOpportunities}
            isApplying={isApplying}
            onApply={handleApplyJob}
            onViewDetails={handleViewDetails}
            canApply={true}
            profileStatus={profileStatus}
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
        chatId={selectedOpportunity ? myApplications.find(app => app.opportunity?._id === selectedOpportunity._id)?.chatId : null}
      />
    </PageLayout>
  );
}