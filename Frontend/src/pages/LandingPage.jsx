import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
        Choose Your Feature
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">

        {/* Tutorial Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:scale-105 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Tutorial</h2>
          <p className="text-gray-400">
            Learn how to use the platform (Coming Soon)
          </p>
        </div>

        {/* Referral Card */}
        <div
          onClick={() => navigate("/role-selector")}
          className="bg-gray-900 border border-green-500 rounded-xl p-6 hover:scale-105 transition cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2 text-green-400">
            Referral
          </h2>
          <p className="text-gray-400">
            Get verified referrals from alumni network
          </p>
        </div>

        {/* Expense Tracker Card */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:scale-105 transition cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">Expense Tracker</h2>
          <p className="text-gray-400">
            Manage your finances (Coming Soon)
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;