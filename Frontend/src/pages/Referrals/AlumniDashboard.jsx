import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { Button } from '@/components/Referrals/ui/button.jsx';
import { Input } from '@/components/Referrals/ui/input.jsx';
import { Label } from '@/components/Referrals/ui/label.jsx';
import { Textarea } from '@/components/Referrals/ui/textarea.jsx';
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
  
  // Search queries
  const [appsSearchQuery, setAppsSearchQuery] = useState("");
  const [candidatesSearchQuery, setCandidatesSearchQuery] = useState("");

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
  const loadStudentProfile = async (studentId, chatId = null) => {
    setLoadingStudentProfile(true);
    setShowStudentProfile(true);
    try {
      const response = await applicationsApi.getStudentProfile(studentId);
      if (response.success) {
        setSelectedStudentProfile({
          ...response.data,
          chatId: chatId
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

  // Filter and group pending applications by role
  const filteredApps = Object.entries(groupedApplications || {}).reduce((acc, [roleName, list]) => {
    if (!Array.isArray(list)) return acc;
    const filteredList = list.filter(app => {
      const student = app.student || app.profileSnapshot || {};
      const studentName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const jobTitle = (app.opportunity?.jobTitle || '').toLowerCase();
      const search = appsSearchQuery.toLowerCase();
      return studentName.includes(search) || jobTitle.includes(search);
    });
    if (filteredList.length > 0) {
      acc[roleName] = filteredList;
    }
    return acc;
  }, {});

  // Filter and group verified candidates by role
  const filteredCandidates = Object.entries(verifiedCandidates || {}).reduce((acc, [roleName, list]) => {
    if (!Array.isArray(list)) return acc;
    const filteredList = list.filter(app => {
      const student = app.student || app.profileSnapshot || {};
      const studentName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
      const jobTitle = (app.opportunity?.jobTitle || '').toLowerCase();
      const search = candidatesSearchQuery.toLowerCase();
      return studentName.includes(search) || jobTitle.includes(search);
    });
    if (filteredList.length > 0) {
      acc[roleName] = filteredList;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 mt-20 sm:mt-24 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-foreground">
              <span className="gradient-text2">Alumni </span> 
              <span className="gradient-text3">Dashboard</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {user ? `Welcome back, ${alumniName}!` : 'Create jobs and provide signed referrals to verified students'}
            </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button variant="alumni" onClick={() => setShowCreateJob(true)}
          className='text-background rounded-md hover:bg-muted-foreground bg-primary text-sm sm:text-base'>
            <Briefcase className="w-4 h-4" />
            Post Job
          </Button>
          <Button variant="success" onClick={() => setShowCreateReferral(true)}
          className='text-background rounded-md bg-muted-foreground hover:bg-primary text-sm sm:text-base'>
            <Star className="w-4 h-4" />
            Post Referral
          </Button>
        </div>
      </div>

      <AlumniStats backendOpportunities={backendOpportunities} />

      <AlumniTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {(activeTab === 'referrals' || activeTab === 'jobs') && (
        <div className="space-y-4 sm:space-y-6">
          {isAuthenticated && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card rounded-xl border border-border/50 p-4">
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
              <div className="bg-card rounded-xl border border-border/50">
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
                        {selectedOpportunityApplications?.map((application) => (
                          <ApplicationCard
                            key={application._id}
                            application={application}
                            opportunityId={selectedBackendOpportunity._id}
                            onViewProfile={loadStudentProfile}
                            onShortlist={handleShortlistBackend}
                            onReject={handleRejectBackend}
                            onRefer={handleReferBackend}
                          />
                        ))}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-md rounded-xl border border-border/50 p-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pending Applications</h3>
              <p className="text-xs text-muted-foreground">Review applications grouped dynamically by role</p>
            </div>
            <Input
              type="text"
              placeholder="Search by student name or role..."
              value={appsSearchQuery}
              onChange={(e) => setAppsSearchQuery(e.target.value)}
              className="max-w-md w-full bg-muted/50 border-border/50 text-foreground"
            />
          </div>

          {Object.keys(filteredApps).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(filteredApps).map(([roleName, apps]) => (
                <div key={roleName} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground capitalize">
                      {roleName} <span className="text-xs bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium ml-2">{apps.length} pending</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {apps.map((app) => (
                      <ApplicationCard
                        key={app._id}
                        application={app}
                        opportunityId={app.opportunity?._id}
                        onViewProfile={loadStudentProfile}
                        onApprove={handleApproveBackend}
                        onReject={handleRejectBackend}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 sm:p-8 md:p-12 border border-border/50 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                No Pending Applications
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                All applications have been reviewed or no matches were found.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-md rounded-xl border border-border/50 p-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Verified Candidates</h3>
              <p className="text-xs text-muted-foreground">Candidates approved for referral grouped dynamically by role</p>
            </div>
            <Input
              type="text"
              placeholder="Search by student name or role..."
              value={candidatesSearchQuery}
              onChange={(e) => setCandidatesSearchQuery(e.target.value)}
              className="max-w-md w-full bg-muted/50 border-border/50 text-foreground"
            />
          </div>

          {Object.keys(filteredCandidates).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(filteredCandidates).map(([roleName, candidates]) => (
                <div key={roleName} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-lg font-semibold text-foreground capitalize">
                      {roleName} <span className="text-xs bg-emerald-400/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-medium ml-2">{candidates.length} verified</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {candidates.map((candidate) => (
                      <ApplicationCard
                        key={candidate._id}
                        application={candidate}
                        opportunityId={candidate.opportunity?._id}
                        onViewProfile={loadStudentProfile}
                        onReject={handleRejectBackend}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 sm:p-8 md:p-12 border border-border/50 text-center">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                No Verified Candidates Yet
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Review applications and approve candidates to see them here.
              </p>
              <Button 
                variant="alumni" 
                onClick={() => setActiveTab('jobs')}
                className='bg-primary text-background'
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Go to Opportunities
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="relative bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-lg">
            <div className="h-32 bg-gradient-to-r from-primary/30 via-accent/30 to-purple-600/30" />
            <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-muted flex items-center justify-center shrink-0 shadow-md">
                {alumniProfile?.image ? (
                  <img
                    src={getAlumniImageUrl(alumniProfile.image)}
                    alt="Alumni Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-muted-foreground">
                    {alumniProfile?.firstName?.[0]}{alumniProfile?.lastName?.[0]}
                  </span>
                )}
                <label htmlFor="alumni-avatar-file" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                  <input
                    id="alumni-avatar-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleAlumniImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {alumniProfile?.firstName} {alumniProfile?.lastName}
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {alumniProfile?.jobTitle || 'No Title'} at {alumniProfile?.company || 'No Company'}
                    </p>
                  </div>
                  {alumniProfile?.image && !alumniProfile.image.startsWith('https://api.dicebear.com') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAlumniImageRemove}
                      className="text-rose-400 border-rose-500/20 hover:bg-rose-950/20 w-fit"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-md">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Profile Completeness
                </h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary/10 text-primary">
                        Score
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold inline-block text-primary">
                        {alumniProfile?.profileCompleteness || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded bg-muted">
                    <div
                      style={{ width: `${alumniProfile?.profileCompleteness || 0}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to build credibility with candidate applications.
                  </p>
                </div>
              </div>

              <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-md">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Social Connections
                </h3>
                <div className="space-y-3">
                  {alumniProfile?.linkedinUrl ? (
                    <a
                      href={alumniProfile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30"
                    >
                      <Linkedin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm truncate">{alumniProfile.linkedinUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                      <Linkedin className="w-5 h-5" />
                      <span className="text-sm italic">No LinkedIn linked</span>
                    </div>
                  )}

                  {alumniProfile?.githubUrl ? (
                    <a
                      href={alumniProfile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30"
                    >
                      <Github className="w-5 h-5 text-foreground" />
                      <span className="text-sm truncate">{alumniProfile.githubUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                      <Github className="w-5 h-5" />
                      <span className="text-sm italic">No GitHub linked</span>
                    </div>
                  )}

                  {alumniProfile?.portfolioUrl ? (
                    <a
                      href={alumniProfile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30"
                    >
                      <Globe className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm truncate">{alumniProfile.portfolioUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm italic">No Portfolio linked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-md h-full">
                {!isEditingProfile ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-border/30 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Alumni Profile Details</h3>
                        <p className="text-sm text-muted-foreground">Detailed professional information</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                        className="border-primary/20 text-primary hover:bg-primary/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Company</h4>
                        <p className="text-foreground font-medium">{alumniProfile?.company || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Job Title</h4>
                        <p className="text-foreground font-medium">{alumniProfile?.jobTitle || 'Not Specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Experience</h4>
                        <p className="text-foreground font-medium">{alumniProfile?.yearsOfExperience || 0} Years</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Referral Preferences</h4>
                        <p className="text-foreground font-medium">{alumniProfile?.referralPreferences || 'None set'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills / Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {alumniProfile?.skills && alumniProfile.skills.length > 0 ? (
                          alumniProfile.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm italic text-muted-foreground">No skills added yet</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Hiring Interests</h4>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">{alumniProfile?.hiringInterests || 'No hiring interests declared.'}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Bio</h4>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">{alumniProfile?.bio || 'Add a bio to introduce yourself.'}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Career Journey</h4>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">{alumniProfile?.careerJourney || 'Share your career journey and achievements.'}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAlumniProfile} className="space-y-6">
                    <div className="flex justify-between items-start border-b border-border/30 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Edit Alumni Profile</h3>
                        <p className="text-sm text-muted-foreground">Keep your professional information updated</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="alumni"
                          size="sm"
                          disabled={profileSaving}
                          className="bg-primary text-background font-semibold"
                        >
                          {profileSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : 'Save'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="company" className="text-foreground">Company</Label>
                        <Input
                          id="company"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="jobTitle" className="text-foreground">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={profileForm.jobTitle}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="yearsOfExperience" className="text-foreground">Years of Experience</Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          min="0"
                          value={profileForm.yearsOfExperience}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="skills" className="text-foreground">Skills (comma-separated)</Label>
                        <Input
                          id="skills"
                          value={profileForm.skills}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
                          placeholder="React, Node.js, AWS, Python"
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/20 pt-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="linkedinUrl" className="text-foreground">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          value={profileForm.linkedinUrl}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                          placeholder="https://linkedin.com/in/username"
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="githubUrl" className="text-foreground">GitHub URL</Label>
                        <Input
                          id="githubUrl"
                          value={profileForm.githubUrl}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                          placeholder="https://github.com/username"
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="portfolioUrl" className="text-foreground">Portfolio URL</Label>
                        <Input
                          id="portfolioUrl"
                          value={profileForm.portfolioUrl}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                          placeholder="https://portfolio.com"
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-border/20 pt-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="referralPreferences" className="text-foreground">Referral Preferences</Label>
                        <Input
                          id="referralPreferences"
                          value={profileForm.referralPreferences}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, referralPreferences: e.target.value }))}
                          placeholder="E.g., Preferred CGPA > 8.0, Software developer roles"
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="hiringInterests" className="text-foreground">Hiring Interests</Label>
                        <Textarea
                          id="hiringInterests"
                          value={profileForm.hiringInterests}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, hiringInterests: e.target.value }))}
                          placeholder="Describe your current or upcoming hiring requirements..."
                          rows={2}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bio" className="text-foreground">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="A short intro about yourself..."
                          rows={3}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="careerJourney" className="text-foreground">Career Journey</Label>
                        <Textarea
                          id="careerJourney"
                          value={profileForm.careerJourney}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, careerJourney: e.target.value }))}
                          placeholder="Tell us about your professional path..."
                          rows={4}
                          className="bg-muted/50 border-border/50 text-foreground"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
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
        }}
        student={selectedStudentProfile}
        loading={loadingStudentProfile}
      />
    </div>
  );
}