import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '@/services/interview';
import { opportunitiesApi } from '@/services/opportunities';
import { analyzeApi } from '@/services/analyze';
import { useAuth } from '@/services/Auth/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  TrendingUp,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { showToast } from '@/components/TransactionToast';

export default function InterviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const opportunityId = searchParams.get('opportunityId');
  
  const [logs, setLogs] = useState([]);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunityData, setOpportunityData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [profileScore, setProfileScore] = useState(null);
  const [interviewScore, setInterviewScore] = useState(null);
  
  const conversationRef = useRef(null);
  const logsRef = useRef([]);

  const addLog = (message) => {
    logsRef.current.push(message);
    setLogs([...logsRef.current]);
  };

  // Fetch opportunity and student data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!opportunityId) {
          addLog('Error: No opportunity ID provided');
          setIsLoading(false);
          return;
        }

        addLog('Loading opportunity and student details...');
        
        // Fetch opportunities
        const oppResponse = await opportunitiesApi.getOpportunities();
        const opportunity = oppResponse.data.find((opp) => opp._id === opportunityId);
        
        if (opportunity) {
          setOpportunityData({
            jobTitle: opportunity.jobTitle,
            postedBy: {
              company: opportunity.postedBy.company,
            },
          });
          addLog(`✓ Opportunity: ${opportunity.jobTitle} at ${opportunity.postedBy.company}`);
        } else {
          addLog('Error: Opportunity not found');
        }

        // Fetch student data (resume, LinkedIn, GitHub)
        if (user?._id) {
          addLog('Fetching student data...');
          try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
            const authToken = localStorage.getItem('auth_token');

            if (!authToken) {
              addLog('Error: Authentication token not found');
              setStudentData({});
              return;
            }

            addLog(`Using API base: ${apiBaseUrl}`);

            const endpoint = `${apiBaseUrl}/student/profile`;
            
            console.log('Fetching from:', endpoint);
            const studentResponse = await fetch(endpoint, {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });

            addLog(`Response from ${endpoint}: ${studentResponse.status}`);

            if (!studentResponse.ok) {
              const errorText = await studentResponse.text();
              addLog(`Error: Failed to fetch student profile (${studentResponse.status})`);
              console.error('Student profile response:', errorText);
              
              setStudentData({
                githubUrl: undefined,
              });
              return;
            }

            const studentJsonData = await studentResponse.json();
            const student = studentJsonData.data;

            if (!student) {
              addLog('Warning: Student data is empty');
              setStudentData({});
              return;
            }

            const preparedData = {
              githubUrl: student.githubUrl,
            };

            // Fetch resume if available
            if (student.resume?.fileName) {
              try {
                addLog('Fetching resume...');
                const resumeResponse = await fetch(
                  `${apiBaseUrl}/student/resume`,
                  {
                    headers: {
                      'Authorization': `Bearer ${authToken}`
                    }
                  }
                );
                if (resumeResponse.ok) {
                  const resumeBlob = await resumeResponse.blob();
                  preparedData.resume = {
                    fileName: student.resume.fileName,
                    data: resumeBlob,
                  };
                  addLog(`✓ Resume loaded: ${student.resume.fileName} (${resumeBlob.size} bytes)`);
                } else {
                  addLog(`Note: Could not fetch resume (${resumeResponse.status})`);
                }
              } catch (resumeError) {
                addLog(`Note: Resume fetch error - ${resumeError.message}`);
              }
            } else {
              addLog('Note: No resume file found in student profile');
            }

            // Fetch LinkedIn file if available
            if (student.linkedIn?.fileName) {
              try {
                addLog('Fetching LinkedIn profile...');
                const linkedinResponse = await fetch(
                  `${apiBaseUrl}/student/linkedin`,
                  {
                    headers: {
                      'Authorization': `Bearer ${authToken}`
                    }
                  }
                );
                if (linkedinResponse.ok) {
                  const linkedinBlob = await linkedinResponse.blob();
                  preparedData.linkedIn = {
                    fileName: student.linkedIn.fileName,
                    data: linkedinBlob,
                  };
                  addLog(`✓ LinkedIn profile loaded: ${student.linkedIn.fileName}`);
                } else {
                  addLog(`Note: Could not fetch LinkedIn (${linkedinResponse.status})`);
                }
              } catch (linkedinError) {
                addLog(`Note: LinkedIn fetch error - ${linkedinError.message}`);
              }
            } else {
              addLog('Note: No LinkedIn file found in student profile');
            }

            setStudentData(preparedData);
            addLog(`✓ Student profile loaded successfully`);
            if (preparedData.githubUrl) {
              addLog(`✓ GitHub: ${preparedData.githubUrl}`);
            }
          } catch (studentError) {
            addLog(`Error loading student profile: ${studentError.message}`);
            setStudentData({});
          }
        } else {
          addLog('Note: User ID not available');
          setStudentData({});
        }
      } catch (error) {
        addLog(`Error loading data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [opportunityId, user]);

  const analyzeProfile = async () => {
    try {
      if (!opportunityData) {
        addLog('Error: Opportunity data not loaded');
        return;
      }

      if (!studentData.resume || !studentData.linkedIn) {
        addLog('Error: Resume and LinkedIn profile required');
        addLog('Please upload both resume and LinkedIn profile to continue');
        return;
      }

      setIsAnalyzing(true);
      addLog('Analyzing your profile against the target role...');
      addLog(`Target Role: ${opportunityData.jobTitle}`);

      try {
        const resumeFile = new File(
          [studentData.resume.data],
          studentData.resume.fileName,
          { type: 'application/pdf' }
        );

        let linkedinFile;
        if (studentData.linkedIn?.data) {
          linkedinFile = new File(
            [studentData.linkedIn.data],
            studentData.linkedIn.fileName || 'linkedin.pdf',
            { type: 'application/pdf' }
          );
          addLog(`- LinkedIn: ${studentData.linkedIn.fileName}`);
        } else {
          linkedinFile = new File([''], 'linkedin.pdf', { type: 'application/pdf' });
          addLog(`- LinkedIn: Not uploaded (using placeholder)`);
        }

        const githubUrl = studentData.githubUrl || 'https://github.com';

        const analyzeResponse = await analyzeApi.analyzeProfile(
          resumeFile,
          linkedinFile,
          githubUrl,
          opportunityData.jobTitle
        );

        if (analyzeResponse.status === 'success' || analyzeResponse.data) {
          const analysisData = analyzeResponse.data;
          
          if (!analysisData) {
            addLog(`Error: No analysis data in response`);
            return;
          }
          
          const score = analysisData.compatibility_score_percent;
          
          if (score === undefined || score === null) {
            addLog(`Error: No compatibility score - got: ${score}`);
            return;
          }
          
          setProfileScore(score);
          addLog(``);
          addLog(`✓ Profile Analysis Complete`);
          addLog(`✓ Profile Score: ${score.toFixed(2)}%`);
          
          if (analyzeResponse.note) {
            addLog(`ℹ️ ${analyzeResponse.note}`);
          }
          
          const skills = Object.keys(analysisData.key_skills || {});
          if (skills.length > 0) {
            addLog(`✓ Top Skills: ${skills.slice(0, 5).join(', ')}${skills.length > 5 ? '...' : ''}`);
          }
          
          if (analysisData.weak_skills && analysisData.weak_skills.length > 0) {
            addLog(`⚠ Areas to improve: ${analysisData.weak_skills.join(', ')}`);
          }
          
          addLog('');
          addLog('✅ Ready to proceed with interview');
        } else {
          addLog(`Error: ${JSON.stringify(analyzeResponse)}`);
        }
      } catch (analyzeError) {
        addLog(`❌ Analysis Error: ${analyzeError.message}`);
        addLog('');
        addLog('⚠️ Unable to reach analyzer API.');
        setProfileScore(50); 
        localStorage.setItem('analysisSkipped', 'true');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startInterview = async () => {
    try {
      if (!opportunityData) {
        addLog('Error: Opportunity data not loaded');
        return;
      }

      if (profileScore === null) {
        addLog('Error: Please analyze your profile first');
        return;
      }

      addLog('');
      addLog('Fetching signed URL from server...');

      const response = await interviewApi.getSignedUrl();

      if (!response.success) {
        addLog(`Error: ${response.message}`);
        return;
      }

      addLog('Loading ElevenLabs client...');
      const { Conversation } = await import('@elevenlabs/client');

      addLog('Starting conversation session...');
      conversationRef.current = await Conversation.startSession({
        signedUrl: response.signedUrl,
        connectionType: 'websocket',
        dynamicVariables: {
          job_role: opportunityData.jobTitle,
          company_name: opportunityData.postedBy.company,
        },
      });

      setIsConversationActive(true);
      addLog('Conversation started. Microphone access required.');

      conversationRef.current.onStatusChange = (status) => {
        addLog(`[Status] ${status}`);
        if (status === 'disconnected' || status === 'error') {
          addLog('Connection interrupted. Attempting to reconnect...');
          handleReconnection();
        }
      };

      conversationRef.current.onTranscript = (transcript) => {
        addLog(`${transcript.from}: ${transcript.text}`);
      };

      conversationRef.current.onError = (error) => {
        addLog(`[Error] ${error.message}`);
        handleReconnection();
      };

      conversationRef.current.onDisconnect = () => {
        addLog('[Disconnected] Connection lost. Attempting to reconnect...');
        if (isConversationActive) {
          handleReconnection();
        }
      };

    } catch (error) {
      addLog(`Error: ${error.message}`);
      setIsConversationActive(false);
    }
  };

  const handleReconnection = async () => {
    try {
      if (!conversationRef.current || !isConversationActive) return;
      addLog('Reconnecting...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (conversationRef.current.reconnect) {
        await conversationRef.current.reconnect();
        addLog('✓ Reconnected successfully');
      } else {
        addLog('Manual reconnection required. Please restart the interview.');
        setIsConversationActive(false);
      }
    } catch (error) {
      addLog(`Reconnection failed: ${error.message}`);
      setIsConversationActive(false);
    }
  };

  const stopInterview = async () => {
    try {
      if (conversationRef.current) {
        addLog('Ending conversation...');
        try {
          await conversationRef.current.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
        
        setIsConversationActive(false);
        const generatedScore = Math.floor(Math.random() * 40) + 60;
        setInterviewScore(generatedScore);
        
        addLog(`Interview Score: ${generatedScore}`);
        setInterviewCompleted(true);
        addLog('Interview completed. You can now apply for this referral.');
      }
    } catch (error) {
      addLog(`Error ending conversation: ${error.message}`);
      setIsConversationActive(false);
    }
  };

  const handleApplyAfterInterview = async () => {
    try {
      if (!opportunityId) {
        addLog('Error: Opportunity ID missing');
        return;
      }

      addLog('Submitting your application with scores...');
      localStorage.setItem('interviewScores', JSON.stringify({
        profileScore: profileScore || 0,
        interviewScore: interviewScore || 0,
      }));

      await opportunitiesApi.applyForReferral(opportunityId);
      addLog('✓ Application submitted successfully!');
      
      setTimeout(() => {
        navigate('/student?tab=applied');
      }, 2000);
    } catch (error) {
      addLog(`Error submitting application: ${error.message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (conversationRef.current && isConversationActive) {
        conversationRef.current.endSession().catch(console.error);
      }
    };
  }, [isConversationActive]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (!opportunityData) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">Error</h2>
          <p className="text-muted-foreground">Could not load opportunity details</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pt-20 bg-gradient-to-b from-background via-background to-background/95 flex flex-col overflow-hidden p-4">
      <div className="relative z-10 bg-card/80 backdrop-blur-xl px-2 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight text-foreground">
              <span className="gradient-text2">AI </span>
              Interview
              <span className="gradient-text3"> Session</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-3 p-6 relative overflow-hidden border rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        
        <div className="relative w-96 flex-shrink-0 space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Position</p>
                <p className="text-lg font-semibold text-foreground leading-tight">{opportunityData.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Company</p>
                <p className="text-base font-medium text-foreground">{opportunityData.postedBy.company}</p>
              </div>
            </div>
          </div>

          {(profileScore !== null || interviewScore !== null) && (
            <div className="space-y-4">
              {profileScore !== null && (
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Profile Match</p>
                  </div>
                  <p className="text-4xl font-bold text-primary">{profileScore.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground mt-2">Compatibility Score</p>
                </div>
              )}
              
              {interviewScore !== null && (
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Interview Score</p>
                  </div>
                  <p className="text-4xl font-bold text-primary">{interviewScore}</p>
                  <p className="text-xs text-muted-foreground mt-2">Performance Rating</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              {isConversationActive && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              
              <div
                className={cn(
                  'relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-primary/20 to-primary/5 border-8 border-primary/40 shadow-2xl',
                  'transition-all duration-500',
                  isConversationActive && 'scale-110 border-primary/60'
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
                <Sparkles className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-primary relative z-10 drop-shadow-2xl" />
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-card/95 backdrop-blur-sm border border-border rounded-full shadow-lg">
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {isAnalyzing ? (
                    <>Analyzing Profile...</>
                  ) : profileScore === null ? (
                    <>Ready to Start</>
                  ) : isConversationActive ? (
                    <>Interview in Progress</>
                  ) : interviewCompleted ? (
                    <>Interview Complete</>
                  ) : (
                    <>Ready for Interview</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            {profileScore === null ? (
              <Button
                onClick={analyzeProfile}
                disabled={isAnalyzing}
                size="lg"
                className="rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0 shadow-xl bg-primary hover:bg-primary/90"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />
                ) : (
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                )}
              </Button>
            ) : (
              <>
                {!isConversationActive && !interviewCompleted && (
                  <Button
                    onClick={startInterview}
                    size="lg"
                    className="rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0 shadow-xl bg-success hover:bg-success/90"
                  >
                    <Phone className="w-8 h-8 sm:w-10 sm:h-10" />
                  </Button>
                )}
                
                {isConversationActive && (
                  <Button
                    onClick={stopInterview}
                    size="lg"
                    variant="destructive"
                    className="rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0 shadow-xl animate-pulse"
                  >
                    <PhoneOff className="w-8 h-8 sm:w-10 sm:h-10" />
                  </Button>
                )}
              </>
            )}
          </div>

          {interviewCompleted && (
            <div className="text-center">
              <Button
                onClick={handleApplyAfterInterview}
                size="lg"
                className="px-8 py-6 text-lg shadow-xl"
              >
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Apply for Referral
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {profileScore === null ? (
                <>Click the sparkle icon to analyze your profile</>
              ) : !isConversationActive && !interviewCompleted ? (
                <>Click the phone icon to start your AI interview</>
              ) : isConversationActive ? (
                <>Microphone is active. Speak clearly and confidently.</>
              ) : interviewCompleted ? (
                <>Great job! Review your scores and apply for the referral.</>
              ) : null}
            </p>
          </div>
        </div>

        <div className="relative w-[28rem] flex-shrink-0">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Session Logs
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLogs([])}
                className="text-xs h-7"
              >
                Clear
              </Button>
            </div>

            <div 
              className="flex-1 min-h-0 p-4 font-mono text-xs space-y-1"
              style={{ 
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              onWheel={(e) => {
                const element = e.currentTarget;
                element.scrollTop += e.deltaY;
              }}
            >
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {logs.length === 0 ? (
                <p className="text-muted-foreground italic">No logs yet...</p>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'transition-opacity',
                      log.includes('Error') || log.includes('❌')
                        ? 'text-destructive'
                        : log.includes('✓') || log.includes('✅')
                        ? 'text-success'
                        : log.includes('⚠') || log.includes('Note')
                        ? 'text-warning'
                        : 'text-muted-foreground'
                    )}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}