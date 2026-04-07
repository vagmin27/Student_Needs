import { useState, useEffect } from 'react';
import { useAuth } from '@/services/Auth/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { showToast, dismissToast } from '@/components/TransactionToast';
import { AlumniStats } from '@/components/Alumni/AlumniStats';
import { AlumniTabNavigation } from '@/components/Alumni/AlumniTabNavigation';
import { CreateJobModal } from '@/components/Alumni/CreateJobModal';
import { PostReferralModal } from '@/components/Alumni/PostReferralModal';
import { BackendOpportunitiesList } from '@/components/Alumni/BackendOpportunitiesList';
import { EditOpportunityModal } from '@/components/Alumni/EditOpportunityModal';
import { StudentProfileModal } from '@/components/Alumni/StudentProfileModal';
import { ApplicationCard } from '@/components/Alumni/ApplicationCard';
import { Briefcase, Plus, ArrowLeft, Star, Eye } from 'lucide-react';
import { opportunitiesApi } from '@/services/opportunities';
import { applicationsApi } from '@/services/applications';

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
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
  const [loadingStudentProfile, setLoadingStudentProfile] = useState(false);

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
        message: error?.response?.data?.message || 'Failed to load student profile',
      });
      setShowStudentProfile(false);
    } finally {
      setLoadingStudentProfile(false);
    }
  };

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
        message: error?.response?.data?.message || error.message || 'Failed to create job opportunity',
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
        message: error?.response?.data?.message || error.message || 'Failed to shortlist candidate',
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
        message: error?.response?.data?.message || error.message || 'Failed to provide referral',
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
        message: error?.response?.data?.message || error.message || 'Failed to reject application',
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
        message: error?.response?.data?.message || error.message || 'Failed to update opportunity',
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
        message: error?.response?.data?.message || error.message || 'Failed to close opportunity',
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
        message: error?.response?.data?.message || error.message || 'Failed to create referral opportunity',
      });
    } finally {
      setIsCreatingReferral(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-20 sm:mt-24 px-4 sm:px-6 md:px-8">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl font-bold tracking-tight">Alumni Dashboard</h2>
    <div className="mt-2 sm:mt-0 flex gap-2">
      <Button
        variant="default"
        onClick={() => setShowCreateJob(true)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Post Job
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowCreateReferral(true)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Post Referral
      </Button>
    </div>
  </div>

  {/* Alumni Stats */}
  <AlumniStats user={user} />

  {/* Tab Navigation */}
  <AlumniTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

  {/* Tabs Content */}
  {activeTab === 'jobs' && (
    <BackendOpportunitiesList
      opportunities={backendOpportunities}
      onEditOpportunity={handleEditOpportunityClick}
      onDeleteOpportunity={handleDeleteOpportunity}
      onViewApplications={loadApplicationsForOpportunity}
    />
  )}

  {activeTab === 'candidates' && (
    <div className="grid gap-4">
      {selectedOpportunityApplications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onShortlist={() => handleShortlistBackend(application.id, selectedBackendOpportunity?.id)}
          onRefer={() => handleReferBackend(application.id, selectedBackendOpportunity?.id)}
          onReject={() => handleRejectBackend(application.id, selectedBackendOpportunity?.id)}
          onViewStudent={() => loadStudentProfile(application.studentId)}
        />
      ))}
    </div>
  )}

  {/* Modals */}
  {showCreateJob && (
    <CreateJobModal
      isOpen={showCreateJob}
      onClose={() => setShowCreateJob(false)}
      jobForm={jobForm}
      setJobForm={setJobForm}
      onSubmit={handleCreateJob}
      isSubmitting={isCreating}
    />
  )}

  {showCreateReferral && (
    <PostReferralModal
      isOpen={showCreateReferral}
      onClose={() => setShowCreateReferral(false)}
      referralForm={referralForm}
      setReferralForm={setReferralForm}
      onSubmit={handleCreateReferral}
      isSubmitting={isCreatingReferral}
    />
  )}

  {showEditOpportunity && selectedBackendOpportunity && (
    <EditOpportunityModal
      isOpen={showEditOpportunity}
      onClose={() => setShowEditOpportunity(false)}
      opportunity={selectedBackendOpportunity}
      onSubmit={handleUpdateOpportunity}
      isSubmitting={isUpdatingOpportunity}
    />
  )}

  {showStudentProfile && selectedStudentProfile && (
    <StudentProfileModal
      isOpen={showStudentProfile}
      onClose={() => setShowStudentProfile(false)}
      student={selectedStudentProfile}
      isLoading={loadingStudentProfile}
    />
  )}
</div>
  );
}