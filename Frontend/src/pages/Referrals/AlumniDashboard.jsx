import { useState, useEffect, useContext, useMemo } from 'react';
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import { Button } from '@/components/ui/button.jsx';
import { CandidateTable } from "@/components/Referrals/shared/CandidateTable.jsx";
import { ReferralFilters } from "@/components/Referrals/shared/ReferralFilters.jsx";
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { cn } from '@/lib/Referrals/utils.js';
import { showToast, dismissToast } from '@/components/Referrals/TransactionToast.jsx';
import { AlumniStats } from '@/components/Referrals/Alumni/AlumniStats.jsx';
import { AlumniTabNavigation } from '@/components/Referrals/Alumni/AlumniTabNavigation.jsx';
import { CreateJobModal } from '@/components/Referrals/Alumni/CreateJobModal.jsx';
import { PostReferralModal } from '@/components/Referrals/Alumni/PostReferralModal.jsx';
import { InteractiveJobsTable } from '@/components/dashboard/alumni/InteractiveJobsTable.jsx';
import { EditOpportunityModal } from '@/components/Referrals/Alumni/EditOpportunityModal.jsx';
import { StudentProfileModal } from '@/components/Referrals/Alumni/StudentProfileModal.jsx';
import { ApplicationCard } from '@/components/Referrals/Alumni/ApplicationCard.jsx';
import { Briefcase, Plus, ArrowLeft, Star, Eye, Users, FileText, User, Trash2, Upload, TrendingUp, Globe, Edit3, Loader2 } from 'lucide-react';
import AlumniProfileView from "@/components/profile/AlumniProfileView.jsx";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton, DashboardGrid } from "@/components/dashboard/shared/Primitives";

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

import { opportunitiesApi } from '@/services/Referrals/opportunities.js';
import { applicationsApi } from '@/services/Referrals/application.js';
import { alumniProfileApi } from '@/services/Referrals/alumniProfile.js';
import { BASE_URL } from '@/services/api/tutorialsApi.js';

export function AlumniDashboard() {
  const isUnifiedLayout = useContext(LayoutContext);
  const { user, isAuthenticated } = useAuth();
  const [backendOpportunities, setBackendOpportunities] = useState([]);
  const [verifiedCandidates, setVerifiedCandidates] = useState({});
  const [groupedApplications, setGroupedApplications] = useState({});
  const [selectedOpportunityApplications, setSelectedOpportunityApplications] = useState([]);
  const [selectedBackendOpportunity, setSelectedBackendOpportunity] = useState(null);
  const [showEditOpportunity, setShowEditOpportunity] = useState(false);
  const [isUpdatingOpportunity, setIsUpdatingOpportunity] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateReferral, setShowCreateReferral] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);
  
  // Search queries & filters
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [appsFilters, setAppsFilters] = useState({
    search: "",
    company: "",
    role: "",
    status: "pending",
    stage: "",
    sortBy: "date-desc"
  });
  const [candidatesFilters, setCandidatesFilters] = useState({
    search: "",
    company: "",
    role: "",
    status: "verified",
    stage: "",
    sortBy: "date-desc"
  });

  // Alumni profile states
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    jobTitle: '',
    yearsOfExperience: 0,
    skills: '',
    referralPreferences: '',
    hiringInterests: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    bio: '',
    careerJourney: ''
  });

  // Student Profile Modal state
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [loadingStudentProfile, setLoadingStudentProfile] = useState(false);

  // Get alumni name from backend auth or default
  const alumniName = user ? `${user.firstName} ${user.lastName}` : 'Alumni';
  const alumniCompany = user?.accountType?.toLowerCase() === 'alumni' ? user.company : '';

  const [jobForm, setJobForm] = useState({
    title: '',
    company: alumniCompany || '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    vacancy: '',
  });

  const [referralForm, setReferralForm] = useState({
    title: '',
    company: alumniCompany || '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    vacancy: '',
  });

  // Update company in forms when user data loads
  useEffect(() => {
    if (user?.accountType?.toLowerCase() === 'alumni') {
      const company = user.company || '';
      setJobForm(prev => ({ ...prev, company: company || prev.company }));
      setReferralForm(prev => ({ ...prev, company: company || prev.company }));
    }
  }, [user]);

  useEffect(() => {
    loadData();
    if (isAuthenticated) {
      fetchAlumniProfile();
    }
  }, [user]);

  const fetchAlumniProfile = async () => {
    try {
      const response = await alumniProfileApi.getProfile();
      if (response.success) {
        setAlumniProfile(response.data);
        setProfileForm({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          company: response.data.company || '',
          jobTitle: response.data.jobTitle || '',
          yearsOfExperience: response.data.yearsOfExperience || 0,
          skills: (response.data.skills || []).join(', '),
          referralPreferences: response.data.referralPreferences || '',
          hiringInterests: response.data.hiringInterests || '',
          linkedinUrl: response.data.linkedinUrl || '',
          githubUrl: response.data.githubUrl || '',
          portfolioUrl: response.data.portfolioUrl || '',
          bio: response.data.bio || '',
          careerJourney: response.data.careerJourney || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch alumni profile:', error);
    }
  };

  const loadData = async () => {
    if (isAuthenticated && user) {
      try {
        const [oppsResponse, candidatesResponse, appsResponse] = await Promise.all([
          opportunitiesApi.getMyOpportunities(),
          applicationsApi.getVerifiedCandidates().catch(() => ({ success: false, data: {} })),
          applicationsApi.getApplications().catch(() => ({ success: false, data: {} }))
        ]);
        
        if (oppsResponse.success) {
          setBackendOpportunities(oppsResponse.data);
        }
        
        if (candidatesResponse.success) {
          setVerifiedCandidates(candidatesResponse.data);
        }

        if (appsResponse.success) {
          setGroupedApplications(appsResponse.data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
  };

  // Load student profile
  const loadStudentProfile = async (studentId, application = null) => {
    setLoadingStudentProfile(true);
    setShowStudentProfile(true);
    setSelectedApplication(application);
    try {
      const response = await applicationsApi.getStudentProfile(studentId);
      if (response.success) {
        setSelectedStudentProfile({
          ...response.data,
          chatId: application?.chatId || null
        });
      }
    } catch (error) {
      console.error('Failed to load student profile:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load student profile',
      });
      setShowStudentProfile(false);
    } finally {
      setLoadingStudentProfile(false);
    }
  };

  // Load applications for a selected opportunity
  const loadApplicationsForOpportunity = async (opportunityId) => {
    try {
      const response = await applicationsApi.getApplicationsForOpportunity(opportunityId);
      if (response.success && response.data) {
        const applications = response.data.all || response.data;
        setSelectedOpportunityApplications(Array.isArray(applications) ? applications : []);
      } else {
        setSelectedOpportunityApplications([]);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      setSelectedOpportunityApplications([]);
    }
  };

  const handleCreateJob = async () => {
    if (!isAuthenticated || !user) {
      showToast({
        type: 'error',
        message: 'Please login to post job opportunities',
      });
      return;
    }

    setIsCreating(true);
    const toastId = showToast({
      type: 'pending',
      message: 'Creating job opportunity...',
    });

    try {
      const payload = {
        jobTitle: jobForm.title,
        opportunityType: 'Job',
        roleDescription: jobForm.description,
        requiredSkills: jobForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: jobForm.type,
        numberOfReferrals: parseInt(jobForm.vacancy) || 1,
        company: jobForm.company,
        location: jobForm.location,
      };

      const response = await opportunitiesApi.createOpportunity(payload);

      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Job opportunity posted successfully!',
        });

        loadData();
        setShowCreateJob(false);
        setJobForm({
          title: '',
          company: alumniCompany || '',
          location: '',
          type: 'full-time',
          description: '',
          requirements: '',
          vacancy: '',
        });
      } else {
        throw new Error(response.message || 'Failed to create opportunity');
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to create job opportunity',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleShortlistBackend = async (applicationId, opportunityId) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Shortlisting candidate...',
    });

    try {
      const response = await applicationsApi.shortlistApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Candidate shortlisted successfully!',
        });
        
        await loadApplicationsForOpportunity(opportunityId);
        await loadData();
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to shortlist candidate',
      });
    }
  };

  const handleReferBackend = async (applicationId, opportunityId) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Processing referral...',
    });

    try {
      const response = await applicationsApi.referApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Referral provided successfully!',
        });
        
        await loadApplicationsForOpportunity(opportunityId);
        await loadData();
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to provide referral',
      });
    }
  };

  const handleApproveBackend = async (applicationId) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Approving application...',
    });

    try {
      const response = await applicationsApi.approveApplication(applicationId);
      dismissToast(toastId);
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Application approved successfully and moved to Verified Candidates!',
        });
        await loadData();
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to approve application',
      });
    }
  };

  const handleRejectBackend = async (applicationId, opportunityId) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Rejecting application...',
    });

    try {
      const response = await applicationsApi.rejectApplication(applicationId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Application rejected',
        });
        
        await loadData();
        if (opportunityId) {
          await loadApplicationsForOpportunity(opportunityId);
        }
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to reject application',
      });
    }
  };

  const handleSaveAlumniProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    const toastId = showToast({
      type: 'pending',
      message: 'Saving profile...',
    });

    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        company: profileForm.company,
        jobTitle: profileForm.jobTitle,
        yearsOfExperience: parseInt(profileForm.yearsOfExperience) || 0,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        referralPreferences: profileForm.referralPreferences,
        hiringInterests: profileForm.hiringInterests,
        linkedinUrl: profileForm.linkedinUrl,
        githubUrl: profileForm.githubUrl,
        portfolioUrl: profileForm.portfolioUrl,
        bio: profileForm.bio,
        careerJourney: profileForm.careerJourney
      };

      const response = await alumniProfileApi.updateProfile(payload);
      dismissToast(toastId);
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Profile saved successfully!',
        });
        setAlumniProfile(response.data);
        setIsEditingProfile(false);
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to save profile',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAlumniImageUpload = async (file) => {
    if (!file) return;
    const toastId = showToast({
      type: 'pending',
      message: 'Uploading profile image...',
    });

    try {
      const response = await alumniProfileApi.uploadProfileImage(file);
      dismissToast(toastId);
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Profile image updated!',
        });
        setAlumniProfile(response.data);
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload profile image',
      });
    }
  };

  const handleAlumniImageRemove = async () => {
    const toastId = showToast({
      type: 'pending',
      message: 'Removing profile image...',
    });

    try {
      const response = await alumniProfileApi.removeProfileImage();
      dismissToast(toastId);
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Profile image removed.',
        });
        setAlumniProfile(response.data);
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to remove profile image',
      });
    }
  };

  const handleUpdateOpportunity = async (opportunityId, updateData) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Updating opportunity...',
    });

    setIsUpdatingOpportunity(true);

    try {
      const response = await opportunitiesApi.updateOpportunity(opportunityId, updateData);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Opportunity updated successfully!',
        });
        
        setShowEditOpportunity(false);
        setSelectedBackendOpportunity(null);
        await loadData();
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to update opportunity',
      });
    } finally {
      setIsUpdatingOpportunity(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    const toastId = showToast({
      type: 'pending',
      message: 'Closing opportunity...',
    });

    try {
      const response = await opportunitiesApi.deleteOpportunity(opportunityId);
      
      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Opportunity closed successfully!',
        });
        
        await loadData();
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to close opportunity',
      });
    }
  };

  const handleEditOpportunityClick = (opportunity) => {
    setSelectedBackendOpportunity(opportunity);
    setShowEditOpportunity(true);
  };

  const handleCreateReferral = async () => {
    if (!isAuthenticated || !user) {
      showToast({
        type: 'error',
        message: 'Please login to post referral opportunities',
      });
      return;
    }

    setIsCreatingReferral(true);
    const toastId = showToast({
      type: 'pending',
      message: 'Creating referral opportunity...',
    });

    try {
      const payload = {
        jobTitle: referralForm.title,
        opportunityType: 'Referral',
        roleDescription: referralForm.description,
        requiredSkills: referralForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: referralForm.type,
        numberOfReferrals: parseInt(referralForm.vacancy) || 1,
        company: referralForm.company,
        location: referralForm.location,
      };

      const response = await opportunitiesApi.createOpportunity(payload);

      dismissToast(toastId);
      
      if (response.success) {
        showToast({
          type: 'success',
          message: 'Referral opportunity posted successfully!',
        });

        loadData();
        setShowCreateReferral(false);
        setReferralForm({
          title: '',
          company: alumniCompany || '',
          location: '',
          type: 'full-time',
          description: '',
          requirements: '',
          vacancy: '',
        });
      } else {
        throw new Error(response.message || 'Failed to create opportunity');
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to create referral opportunity',
      });
    } finally {
      setIsCreatingReferral(false);
    }
  };

  const getAlumniImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`}`;
  };

  // Flatten maps
  const allApps = useMemo(() => {
    return Object.values(groupedApplications || {}).flat();
  }, [groupedApplications]);

  const allCandidates = useMemo(() => {
    return Object.values(verifiedCandidates || {}).flat();
  }, [verifiedCandidates]);

  // Companies & Roles
  const appsCompanies = useMemo(() => {
    const cos = new Set();
    allApps.forEach(app => {
      const co = app.opportunity?.postedBy?.company || app.alumni?.company || app.company;
      if (co) cos.add(co);
    });
    return Array.from(cos);
  }, [allApps]);

  const appsRoles = useMemo(() => {
    const rs = new Set();
    allApps.forEach(app => {
      const r = app.opportunity?.jobTitle || app.role;
      if (r) rs.add(r);
    });
    return Array.from(rs);
  }, [allApps]);

  const candidatesCompanies = useMemo(() => {
    const cos = new Set();
    allCandidates.forEach(c => {
      const co = c.opportunity?.postedBy?.company || c.alumni?.company || c.company;
      if (co) cos.add(co);
    });
    return Array.from(cos);
  }, [allCandidates]);

  const candidatesRoles = useMemo(() => {
    const rs = new Set();
    allCandidates.forEach(c => {
      const r = c.opportunity?.jobTitle || c.role;
      if (r) rs.add(r);
    });
    return Array.from(rs);
  }, [allCandidates]);

  // Filter apps
  const filteredAppsList = useMemo(() => {
    let result = [...allApps];
    if (appsFilters.search) {
      const s = appsFilters.search.toLowerCase();
      result = result.filter(app => {
        const student = app.student || {};
        const name = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
        const role = (app.opportunity?.jobTitle || app.role || "").toLowerCase();
        const co = (app.opportunity?.postedBy?.company || app.alumni?.company || app.company || "").toLowerCase();
        return name.includes(s) || role.includes(s) || co.includes(s);
      });
    }
    if (appsFilters.company) {
      result = result.filter(app => {
        const co = app.opportunity?.postedBy?.company || app.alumni?.company || app.company || "";
        return co.toLowerCase() === appsFilters.company.toLowerCase();
      });
    }
    if (appsFilters.role) {
      result = result.filter(app => {
        const r = app.opportunity?.jobTitle || app.role || "";
        return r.toLowerCase() === appsFilters.role.toLowerCase();
      });
    }
    if (appsFilters.status) {
      result = result.filter(app => (app.status || "").toLowerCase() === appsFilters.status.toLowerCase());
    }
    if (appsFilters.stage) {
      result = result.filter(app => (app.stage || app.interviewStage || "").toLowerCase() === appsFilters.stage.toLowerCase());
    }
    if (appsFilters.sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.createdAt || b.appliedAt || 0) - new Date(a.createdAt || a.appliedAt || 0));
    } else if (appsFilters.sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.createdAt || a.appliedAt || 0) - new Date(b.createdAt || b.appliedAt || 0));
    } else if (appsFilters.sortBy === "name-asc") {
      result.sort((a, b) => {
        const nameA = `${a.student?.firstName || ""} ${a.student?.lastName || ""}`.toLowerCase();
        const nameB = `${b.student?.firstName || ""} ${b.student?.lastName || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (appsFilters.sortBy === "name-desc") {
      result.sort((a, b) => {
        const nameA = `${a.student?.firstName || ""} ${a.student?.lastName || ""}`.toLowerCase();
        const nameB = `${b.student?.firstName || ""} ${b.student?.lastName || ""}`.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }
    return result;
  }, [allApps, appsFilters]);

  // Filter candidates
  const filteredCandidatesList = useMemo(() => {
    let result = [...allCandidates];
    if (candidatesFilters.search) {
      const s = candidatesFilters.search.toLowerCase();
      result = result.filter(c => {
        const student = c.student || {};
        const name = `${student.firstName || ""} ${student.lastName || ""}`.toLowerCase();
        const role = (c.opportunity?.jobTitle || c.role || "").toLowerCase();
        const co = (c.opportunity?.postedBy?.company || c.alumni?.company || c.company || "").toLowerCase();
        return name.includes(s) || role.includes(s) || co.includes(s);
      });
    }
    if (candidatesFilters.company) {
      result = result.filter(c => {
        const co = c.opportunity?.postedBy?.company || c.alumni?.company || c.company || "";
        return co.toLowerCase() === candidatesFilters.company.toLowerCase();
      });
    }
    if (candidatesFilters.role) {
      result = result.filter(c => {
        const r = c.opportunity?.jobTitle || c.role || "";
        return r.toLowerCase() === candidatesFilters.role.toLowerCase();
      });
    }
    if (candidatesFilters.status) {
      result = result.filter(c => (c.status || "").toLowerCase() === candidatesFilters.status.toLowerCase());
    }
    if (candidatesFilters.stage) {
      result = result.filter(c => (c.stage || c.interviewStage || "").toLowerCase() === candidatesFilters.stage.toLowerCase());
    }
    if (candidatesFilters.sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.createdAt || b.appliedAt || 0) - new Date(a.createdAt || a.appliedAt || 0));
    } else if (candidatesFilters.sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.createdAt || a.appliedAt || 0) - new Date(b.createdAt || b.appliedAt || 0));
    } else if (candidatesFilters.sortBy === "name-asc") {
      result.sort((a, b) => {
        const nameA = `${a.student?.firstName || ""} ${a.student?.lastName || ""}`.toLowerCase();
        const nameB = `${b.student?.firstName || ""} ${b.student?.lastName || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (candidatesFilters.sortBy === "name-desc") {
      result.sort((a, b) => {
        const nameA = `${a.student?.firstName || ""} ${a.student?.lastName || ""}`.toLowerCase();
        const nameB = `${b.student?.firstName || ""} ${b.student?.lastName || ""}`.toLowerCase();
        return nameB.localeCompare(nameA);
      });
    }
    return result;
  }, [allCandidates, candidatesFilters]);  return (
    <PageLayout
      className={cn(
        "pb-8",
        isUnifiedLayout ? "mt-0" : "mt-20 sm:mt-24"
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start justify-center">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
            Alumni Referral Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user ? `Welcome back, ${alumniName}!` : 'Create jobs and provide signed referrals to verified students'}
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <PremiumButton
            variant="primary"
            onClick={() => setShowCreateJob(true)}
            leftIcon={Briefcase}
            className="text-sm font-semibold animate-fade-in"
          >
            Post Job
          </PremiumButton>
          <PremiumButton
            variant="success"
            onClick={() => setShowCreateReferral(true)}
            leftIcon={Star}
            className="text-sm font-semibold animate-fade-in"
          >
            Post Referral
          </PremiumButton>
        </div>
      </div>
      <AlumniStats backendOpportunities={backendOpportunities} />

      <AlumniTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {(activeTab === 'referrals' || activeTab === 'jobs') && (
        <div className="space-y-4 sm:space-y-6">
          {isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card rounded-[var(--radius-md)] border border-border/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeTab === 'jobs' ? 'My Posted Jobs' : 'My Posted Referrals'}
                  </h3>
                </div>
                <InteractiveJobsTable 
                  jobs={backendOpportunities.filter(opp => 
                    activeTab === 'jobs' 
                      ? opp.opportunityType === 'Job' 
                      : (opp.opportunityType === 'Referral' || !opp.opportunityType)
                  )}
                  onRowClick={(opp) => {
                    setSelectedBackendOpportunity(opp);
                    loadApplicationsForOpportunity(opp._id);
                  }}
                  onActionClick={handleEditOpportunityClick}
                  actionLabel="Edit"
                />
              </div>
              <div className="bg-card rounded-[var(--radius-md)] border border-border/50">
                {selectedBackendOpportunity ? (
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 truncate">
                      Applications for "{selectedBackendOpportunity.jobTitle}"
                    </h3>
                    {!Array.isArray(selectedOpportunityApplications) || selectedOpportunityApplications.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-muted-foreground">
                        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                        <p className="text-sm sm:text-base">No applications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                    <CandidateTable
                      candidates={selectedOpportunityApplications}
                      onActionClick={(app) => {
                        loadStudentProfile(app.student?._id || app._id, app);
                      }}
                      actionLabel="Review"
                      emptyMessage="No applications yet"
                    />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px] sm:min-h-[300px] text-sm sm:text-base text-muted-foreground px-4">
                    <p className="text-center">Select an opportunity to view applications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pending Applications</h3>
              <p className="text-xs text-muted-foreground">Review applications for your posted jobs and referrals</p>
            </div>
            <ReferralFilters
              filters={appsFilters}
              onFilterChange={setAppsFilters}
              companies={appsCompanies}
              roles={appsRoles}
            />
          </div>

          <CandidateTable
            candidates={filteredAppsList}
            onActionClick={(app) => {
              loadStudentProfile(app.student?._id || app._id, app);
            }}
            actionLabel="Review"
            emptyMessage="No pending applications found."
          />
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Verified Candidates</h3>
              <p className="text-xs text-muted-foreground">Review blockchain-verified student candidates for referral</p>
            </div>
            <ReferralFilters
              filters={candidatesFilters}
              onFilterChange={setCandidatesFilters}
              companies={candidatesCompanies}
              roles={candidatesRoles}
            />
          </div>

          <CandidateTable
            candidates={filteredCandidatesList}
            onActionClick={(candidate) => {
              loadStudentProfile(candidate.student?._id || candidate._id, candidate);
            }}
            actionLabel="Review"
            emptyMessage="No verified candidates found."
          />
        </div>
      )}

      {activeTab === 'profile' && (
        <AlumniProfileView />
      )}

      <CreateJobModal
        showModal={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        jobForm={jobForm}
        setJobForm={setJobForm}
        onSubmit={handleCreateJob}
        isCreating={isCreating}
      />

      <PostReferralModal
        showModal={showCreateReferral}
        onClose={() => setShowCreateReferral(false)}
        referralForm={referralForm}
        setReferralForm={setReferralForm}
        onSubmit={handleCreateReferral}
        isCreating={isCreatingReferral}
      />

      <EditOpportunityModal
        showModal={showEditOpportunity}
        onClose={() => {
          setShowEditOpportunity(false);
          setSelectedBackendOpportunity(null);
        }}
        opportunity={selectedBackendOpportunity}
        onSubmit={handleUpdateOpportunity}
        isUpdating={isUpdatingOpportunity}
      />

      <StudentProfileModal
        isOpen={showStudentProfile}
        onClose={() => {
          setShowStudentProfile(false);
          setSelectedStudentProfile(null);
          setSelectedApplication(null);
        }}
        student={selectedStudentProfile}
        loading={loadingStudentProfile}
        application={selectedApplication}
        onShortlist={handleShortlistBackend}
        onReject={handleRejectBackend}
        onRefer={handleReferBackend}
        onApprove={handleApproveBackend}
      />
    </PageLayout>
  );
}