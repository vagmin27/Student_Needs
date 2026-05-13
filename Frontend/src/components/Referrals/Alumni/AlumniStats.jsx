/**
 * AlumniStats component to display summary metrics of posted opportunities.
 * @param {Object} props
 * @param {Array} props.backendOpportunities - List of opportunity objects from the backend
 */
export function AlumniStats({ backendOpportunities = [] }) {
  // Backend stats
  const opportunitiesCount = backendOpportunities.length;
  const totalReferralsGiven = backendOpportunities.reduce((acc, opp) => acc + (opp.referralsGiven || 0), 0);
  const activeOpportunities = backendOpportunities.filter(opp => opp.isActive || opp.status === 'Open').length;
  const totalReferralsPossible = backendOpportunities.reduce((acc, opp) => acc + (opp.numberOfReferrals || 0), 0);

  return (
    <div className="mx-auto grid sm:grid-cols-4 gap-4">
      {/* Opportunities Posted */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{opportunitiesCount}</p>
        <p className="text-sm text-muted-foreground">Opportunities Posted</p>
      </div>

      {/* Active Opportunities */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{activeOpportunities}</p>
        <p className="text-sm text-muted-foreground">Active Opportunities</p>
      </div>

      {/* Referrals Given */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{totalReferralsGiven}</p>
        <p className="text-sm text-muted-foreground">Referrals Given</p>
      </div>

      {/* Total Referrals Limit */}
      <div className="bg-card rounded-lg px-4 py-6 border border-border/50 space-y-2">
        <p className="text-3xl font-bold text-foreground">{totalReferralsPossible}</p>
        <p className="text-sm text-muted-foreground">Total Referrals</p>
      </div>
    </div>
  );
}