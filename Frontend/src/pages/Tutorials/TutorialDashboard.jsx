import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, MessageSquare, CheckCircle, 
  Search, Video, ArrowRight, Activity, GraduationCap, 
  History, User 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { useTutorialDashboard } from "@/hooks/useTutorialDashboard";

const MetricCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="hover:border-primary/50 transition-colors bg-card shadow-sm h-full">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-[var(--radius-sm)] bg-opacity-10 ${colorClass} bg-current`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const QuickAction = ({ title, icon: Icon, to, primary }) => (
  <Link to={to} className="block h-full">
    <Card className={`h-full hover:scale-105 transition-all duration-300 ${primary ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary/50 bg-card'}`}>
      <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full text-center">
        <div className={`p-2 rounded-[var(--radius-sm)] ${primary ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium text-xs sm:text-sm">{title}</span>
      </CardContent>
    </Card>
  </Link>
);

const LoadingSkeleton = () => (
  <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-[var(--radius-md)]" />)}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 w-full rounded-[var(--radius-md)]" />)}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="h-64 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-64 w-full rounded-[var(--radius-md)]" />
    </div>
  </div>
);

const EmptyExperience = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
      <GraduationCap className="w-12 h-12" />
    </div>
    <h2 className="text-3xl font-bold tracking-tight mb-3">Start your learning journey</h2>
    <p className="text-muted-foreground max-w-md mx-auto mb-8">
      You haven't booked any sessions or started any conversations yet. Discover the perfect tutor and kickstart your progress.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Button asChild size="lg">
        <Link to={TUTORIAL_PATHS.studentSearch}>
          <Search className="w-4 h-4 mr-2" /> Find Tutor
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link to="/tutorials/profile">
          Complete Profile
        </Link>
      </Button>
    </div>
  </div>
);

export default function TutorialDashboard() {
  const { metrics, upcomingSessions, recentActivity, hasData, loading } = useTutorialDashboard();

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Tutorials Dashboard</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manage tutoring, bookings and learning activity</p>
      </div>

      {!hasData ? (
        <EmptyExperience />
      ) : (
        <>
          {/* Real Analytics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Upcoming Bookings" 
              value={metrics.upcomingBookings} 
              icon={Calendar} 
              colorClass="text-[var(--primary)]" 
            />
            <MetricCard 
              title="Completed Classes" 
              value={metrics.completedClasses} 
              icon={CheckCircle} 
              colorClass="text-green-500" 
            />
            <MetricCard 
              title="Active Conversations" 
              value={metrics.activeConversations} 
              icon={MessageSquare} 
              colorClass="text-pink-500" 
            />
            <MetricCard 
              title="Pending Requests" 
              value={metrics.pendingRequests} 
              icon={Clock} 
              colorClass="text-orange-500" 
            />
          </div>

          {/* Quick Actions */}
          <section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <QuickAction title="Find Tutor" icon={Search} to={TUTORIAL_PATHS.studentSearch} primary />
              <QuickAction title="My Bookings" icon={Calendar} to="/tutorials/bookings" />
              <QuickAction title="Open Chats" icon={MessageSquare} to="/tutorials/chat" />
              <QuickAction title="Attendance" icon={CheckCircle} to="/tutorials/online-attendance" />
              <QuickAction title="View History" icon={History} to="/tutorials/history" />
              <QuickAction title="Profile" icon={User} to="/tutorials/profile" />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upcoming Sessions</h2>
                <Button variant="link" size="sm" asChild className="px-0">
                  <Link to="/tutorials/bookings">See all <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  {upcomingSessions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No upcoming sessions
                    </div>
                  ) : (
                    <div className="divide-y">
                      {upcomingSessions.slice(0, 5).map((session, i) => (
                        <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${session.status === 'accepted' || session.status === 'upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                  {session.status || "Pending"}
                                </span>
                              </div>
                              <p className="font-semibold text-foreground">{session.subject || "Tutoring Session"}</p>
                              <p className="text-sm text-muted-foreground truncate">with {session.tutorName || "Tutor"}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-medium">{session.date}</p>
                              <p className="text-xs text-muted-foreground">{session.time}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
                              <Link to={`/tutorials/chat`}><MessageSquare className="w-3 h-3 mr-2"/> Message</Link>
                            </Button>
                            {session.meetingLink && (
                              <Button size="sm" className="h-8 text-xs flex-1" onClick={() => window.open(session.meetingLink, '_blank')}>
                                <Video className="w-3 h-3 mr-2"/> Join
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-0">
                  {recentActivity.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No recent activity
                    </div>
                  ) : (
                    <div className="divide-y border-transparent">
                      {recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                          <div className={`p-2 rounded-full bg-muted/50 ${activity.type === 'chat' ? 'text-pink-500' : 'text-[var(--primary)]'}`}>
                            {activity.type === 'chat' ? <MessageSquare className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{activity.desc}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(activity.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

          </div>
        </>
      )}
    </div>
  );
}
