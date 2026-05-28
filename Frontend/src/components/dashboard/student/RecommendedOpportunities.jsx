import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTrendingUp, MdLocationOn, MdWorkOutline, MdStar, MdArrowForward } from 'react-icons/md';
import { apiClient } from '@/services/apiClient';

export const RecommendedOpportunities = ({ refreshTrigger }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/api/v1/recommendations/opportunities');
        if (res.data?.success) {
          setRecommendations(res.data.data || []);
        } else {
          setError(res.data?.message || 'Failed to fetch recommendations');
        }
      } catch (err) {
        console.error('Recommendations fetch error:', err);
        setError('Unable to load AI recommendations at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [refreshTrigger]); // re-fetch when refreshTrigger changes (from websocket)

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-secondary/20 p-4 rounded-xl border border-border">
            <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
        {error}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed border-border rounded-xl bg-secondary/10">
        <MdStar className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-foreground">No recommendations yet</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[250px] mx-auto">
          Update your profile skills and resume to help our AI find the perfect opportunities for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations?.filter(Boolean)?.slice(0, 3).map((rec, index) => {
        const opportunity = rec?.opportunity;
        const similarityScore = rec?.similarityScore || 0;
        const matchedSkills = rec?.matchedSkills || [];
        
        if (!opportunity) return null;
        
        return (
          <div 
            key={opportunity._id || index}
            onClick={() => navigate(`/referrals/opportunities/${opportunity._id}`)}
            className="group relative bg-card p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            {/* AI Match Badge */}
            <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded-bl-xl border-b border-l border-primary/20 flex items-center gap-1">
              <MdTrendingUp /> {similarityScore}% Match
            </div>

            <div className="pr-20">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {opportunity.jobTitle || "Untitled Opportunity"}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MdWorkOutline className="shrink-0" />
                <span className="line-clamp-1">{opportunity.postedBy?.company || 'Confidential'}</span>
                <span className="mx-1">•</span>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                  {opportunity.experienceLevel || "Entry Level"}
                </span>
              </p>
            </div>

            {/* Matched Skills */}
            {matchedSkills && matchedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {matchedSkills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-sm">
                    {skill}
                  </span>
                ))}
                {matchedSkills.length > 3 && (
                  <span className="text-[10px] font-medium text-muted-foreground px-1 py-0.5">
                    +{matchedSkills.length - 3} more
                  </span>
                )}
              </div>
            )}
            
            {/* View Details Hint */}
            <div className="mt-3 pt-3 border-t border-border/50 flex justify-end">
              <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View Details <MdArrowForward />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
