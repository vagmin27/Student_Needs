import { useState, useEffect } from 'react';
import { useAuth } from '@/services/Referrals/Auth/AuthContext.jsx';
import { Button } from '@/components/Referrals/ui/button.jsx';
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
import { Briefcase, Plus, ArrowLeft, Star, Eye } from 'lucide-react';
import { opportunitiesApi } from '@/services/Referrals/opportunities.js';
import { applicationsApi } from '@/services/Referrals/application.js';

export function AlumniDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [backendOpportunities, setBackendOpportunities] = useState([]);
  const [selectedOpportunityApplications, setSelectedOpportunityApplications] = useState([]);
  const [selectedBackendOpportunity, setSelectedBackendOpportunity] = useState(null);
  const [showEditOpportunity, setShowEditOpportunity] = useState(false);
  const [isUpdatingOpportunity, setIsUpdatingOpportunity] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateReferral, setShowCreateReferral] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingReferral, setIsCreatingReferral] = useState(false);
  
  // Student Profile Modal state
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [loadingStudentProfile, setLoadingStudentProfile] = useState(false);

  // Get alumni name from backend auth or default
  const alumniName = user ? `${user.firstName} ${user.lastName}` : 'Alumni';
  const alumniCompany = user?.accountType === 'Alumni' ? user.company : '';

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
    if (user?.accountType === 'Alumni') {
      const company = user.company || '';
      setJobForm(prev => ({ ...prev, company: company || prev.company }));
      setReferralForm(prev => ({ ...prev, company: company || prev.company }));
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    // Fetch opportunities from backend if authenticated
    if (isAuthenticated && user) {
      try {
        const response = await opportunitiesApi.getMyOpportunities();
        if (response.success) {
          setBackendOpportunities(response.data);
        }
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      }
    }
  };

  // Load student profile
  const loadStudentProfile = async (studentId) => {
    setLoadingStudentProfile(true);
    setShowStudentProfile(true);
    try {
      const response = await applicationsApi.getStudentProfile(studentId);
      if (response.success) {
        setSelectedStudentProfile(response.data);
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
        roleDescription: jobForm.description,
        requiredSkills: jobForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: jobForm.type,
        numberOfReferrals: parseInt(jobForm.vacancy) || 1,
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
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to provide referral',
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
        
        await loadApplicationsForOpportunity(opportunityId);
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to reject application',
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
        roleDescription: referralForm.description,
        requiredSkills: referralForm.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        experienceLevel: referralForm.type,
        numberOfReferrals: parseInt(referralForm.vacancy) || 1,
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
                  <h3 className="text-lg font-semibold text-foreground">My Opportunities</h3>
                </div>
                <InteractiveJobsTable 
                  jobs={backendOpportunities}
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
                        {selectedOpportunityApplications.map((application) => (
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

      {activeTab === 'candidates' && (
        <div className="space-y-4 sm:space-y-6">
          {isAuthenticated && backendOpportunities.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Candidates from Backend Opportunities
              </h3>
              <InteractiveJobsTable 
                jobs={backendOpportunities}
                onRowClick={(opp) => {
                  setSelectedBackendOpportunity(opp);
                  loadApplicationsForOpportunity(opp._id);
                  setActiveTab('jobs');
                }}
                onActionClick={(opp) => {
                  setSelectedBackendOpportunity(opp);
                  loadApplicationsForOpportunity(opp._id);
                  setActiveTab('jobs');
                }}
                actionLabel="View Applications"
              />
            </div>
          )}

          {(!isAuthenticated || backendOpportunities.length === 0) && (
            <div className="bg-card rounded-xl p-6 sm:p-8 md:p-12 border border-border/50 text-center">
              <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                No Candidates Yet
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Post opportunities to start receiving applications from candidates
              </p>
              <Button 
                variant="alumni" 
                onClick={() => setActiveTab('jobs')}
                className='bg-primary text-background'
              >
                <Briefcase className="w-4 h-4" />
                Post Opportunity
              </Button>
            </div>
          )}
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