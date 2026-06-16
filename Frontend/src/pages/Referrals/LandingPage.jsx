import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-main-page)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-[var(--text-primary)]">
        Choose Your Feature
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        {/* Tutorial Card */}
        <div className="bg-[var(--bg-nav-container)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-6 hover:scale-105 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Tutorial</h2>
          <p className="text-muted-foreground">
            Learn how to use the platform (Coming Soon)
          </p>
        </div>

        {/* Referral Card */}
        <div
          onClick={() => navigate("/role-selector")}
          className="bg-[var(--bg-nav-container)] border-2 border-green-500 rounded-[var(--radius-md)] p-6 hover:scale-105 transition cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.15)]"
        >
          <h2 className="text-xl font-semibold mb-2 text-green-500">
            Referral
          </h2>
          <p className="text-muted-foreground">
            Get verified referrals from alumni network
          </p>
        </div>

        {/* Expense Tracker Card */}
        <div className="bg-[var(--bg-nav-container)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-6 hover:scale-105 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Expense Tracker</h2>
          <p className="text-muted-foreground">
            Manage your finances (Coming Soon)
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;