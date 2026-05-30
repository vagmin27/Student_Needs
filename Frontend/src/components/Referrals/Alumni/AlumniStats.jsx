/**
 * AlumniStats component to display summary metrics of posted opportunities.
 * @param {Object} props
 * @param {Array} props.backendOpportunities - List of opportunity objects from the backend
 */
export function AlumniStats({ backendOpportunities = [] }) {
  // Backend stats
  const jobsCount = backendOpportunities.filter(opp => opp.opportunityType === 'Job').length;
  const referralsCount = backendOpportunities.filter(opp => opp.opportunityType === 'Referral' || !opp.opportunityType).length;
  const totalReferralsGiven = backendOpportunities.reduce((acc, opp) => acc + (opp.referralsGiven || 0), 0);
  const activeOpportunities = backendOpportunities?.filter(opp => opp.isActive || opp.status === 'Open').length;
  const totalReferralsPossible = backendOpportunities
    .filter(opp => opp.opportunityType === 'Referral' || !opp.opportunityType)
    .reduce((acc, opp) => acc + (opp.numberOfReferrals || 0), 0);

  // Advanced AI/Analytics stats
  const applicationsReceived = backendOpportunities.reduce((acc, opp) => acc + (opp.applicationsCount || 0), 0);
  const conversionRate = applicationsReceived > 0 
    ? ((totalReferralsGiven / applicationsReceived) * 100).toFixed(1) 
    : 0;

  return (
    <div className="mx-auto grid sm:grid-cols-2 lg:grid-cols-7 gap-4">
      {/* Jobs Posted */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{jobsCount}</p>
        <p className="text-sm text-muted-foreground">Jobs Posted</p>
      </div>

      {/* Referrals Posted */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{referralsCount}</p>
        <p className="text-sm text-muted-foreground">Referrals Posted</p>
      </div>

      {/* Active Opportunities */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{activeOpportunities}</p>
        <p className="text-sm text-muted-foreground">Active Opportunities</p>
      </div>

      {/* Applications Received (New) */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-blue-500">{applicationsReceived}</p>
        <p className="text-sm text-muted-foreground">Applications Received</p>
      </div>

      {/* Referrals Given */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-success">{totalReferralsGiven}</p>
        <p className="text-sm text-muted-foreground">Referrals Given</p>
      </div>

      {/* Conversion Rate (New) */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-purple-500">{conversionRate}%</p>
        <p className="text-sm text-muted-foreground">Referral Conversion</p>
      </div>

      {/* Total Referrals Limit */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{totalReferralsPossible}</p>
        <p className="text-sm text-muted-foreground">Total Referrals Limit</p>
      </div>
    </div>
  );
}