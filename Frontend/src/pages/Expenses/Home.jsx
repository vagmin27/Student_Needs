import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expensesApi } from "../../services/api/expensesApi";
import StatCard from "../../components/Expenses/dashboard/StatCard";
import { CategoryPieChart } from "../../components/Expenses/dashboard/CategoryPieChart";
import MonthlyExpenseChart from "../../components/Expenses/dashboard/MonthlyExpenseChart";
import TransactionsTable from "../../components/Expenses/dashboard/TransactionsTable";
import Modal from "../../components/Expenses/ui/Modal";
import Skeleton from "../../components/Expenses/ui/Skeleton";
import EmptyState from "../../components/Expenses/ui/EmptyState";
import {
  MdAdd,
  MdAccountBalanceWallet,
  MdWarning,
  MdShowChart,
  MdOutlineFileDownload,
} from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const navigate = useNavigate();
  const [userdata] = useState(() => JSON.parse(localStorage.getItem("User")));
  const [userexp, setUserexp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Settings
  const userSettings = JSON.parse(
    localStorage.getItem(`user_settings_${userdata._id}`),
  ) || {
    monthlyBudget: 0,
    currency: "INR",
  };
  useEffect(() => {
    if (!userSettings.monthlyBudget || userSettings.monthlyBudget === 0) {
      navigate("/expenses-tracker/settings");
    }
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Other",
    date: new Date(),
  });

  const fetchExpenses = async () => {
    setIsLoading(true);

    if (!userdata) {
      navigate("/expenses-tracker/login");
      return;
    }

    const data = await expensesApi.getUserExpenses(userdata._id);
      setUserexp(data || []);

    setTimeout(() => setIsLoading(false), 800); // Simulate realistic loading
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await expensesApi.createExpense({
      userId: userdata._id,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date.toISOString(),
    });
    setIsModalOpen(false);
    setFormData({ amount: "", category: "Other", date: new Date() });
    fetchExpenses();
  };

  const totalSpent = userexp.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = userSettings.monthlyBudget - totalSpent;
  const budgetPercentage = Math.min(
    (totalSpent / userSettings.monthlyBudget) * 100,
    100,
  );

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ["Date", "Category", "Amount (INR)"];
    csvRows.push(headers.join(","));
    userexp.forEach((exp) => {
      csvRows.push(
        `${new Date(exp.date).toLocaleDateString()},${exp.category},${exp.amount}`,
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "expenses_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-mont text-white tracking-tight flex items-center gap-3">
            <span className="text-brand-primary">Overview</span> Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here's your financial snapshot.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all hover:-translate-y-0.5"
        >
          <MdAdd size={20} /> Add Expense
        </button>
      </div>

      {/* Widgets & Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left col span 3 for StatCards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton type="statCard" />
              <Skeleton type="statCard" />
              <Skeleton type="statCard" />
            </>
          ) : (
            <>
              <StatCard
                title="Monthly Budget"
                amount={userSettings.monthlyBudget}
                type="neutral"
              />
              <StatCard
                title="Total Spent"
                amount={totalSpent}
                type="warning"
              />
              <StatCard
                title="Remaining"
                amount={remainingBudget > 0 ? remainingBudget : 0}
                type={remainingBudget < 0 ? "warning" : "success"}
              />
            </>
          )}
        </div>

        {/* Right Col Quick Action / Budget Warning */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {isLoading ? (
            <Skeleton type="card" lines={1} />
          ) : (
            <div
              className={`glass-panel p-6 border ${budgetPercentage > 90 ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-white/10"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-bold">Budget Health</h4>
                {budgetPercentage > 90 && (
                  <MdWarning
                    className="text-amber-500 animate-pulse"
                    size={20}
                  />
                )}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2 mt-4 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                {budgetPercentage.toFixed(1)}% of ₹
                {userSettings.monthlyBudget.toLocaleString()} used up.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MdShowChart className="text-brand-primary" /> Expense Trends
            </h3>
          </div>
          {isLoading ? (
            <Skeleton type="chart" />
          ) : userexp.length === 0 ? (
            <EmptyState
              title="No Chart Data"
              message="Record expenses to populate your trends."
            />
          ) : (
            <MonthlyExpenseChart exdata={userexp} />
          )}
        </div>

        <div className="lg:col-span-1 glass-panel p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">
            Category Breakdown
          </h3>
          {isLoading ? (
            <Skeleton type="chart" />
          ) : userexp.length === 0 ? (
            <EmptyState title="No Breakdown Found" />
          ) : (
            <CategoryPieChart exdata={userexp} />
          )}
        </div>
      </div>

      {/* Transactions Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="glass-panel p-6 space-y-4">
              <Skeleton type="table" lines={5} />
            </div>
          ) : (
            <TransactionsTable
              transactions={userexp}
              onUpdate={fetchExpenses}
            />
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <button
            onClick={() => navigate("/expenses-tracker/recurring")}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <MdAccountBalanceWallet className="text-purple-400" size={20} />
              <span className="text-slate-200 font-medium text-sm group-hover:text-white">
                Recurring Rules
              </span>
            </div>
          </button>
          <button
            onClick={downloadCSV}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <MdOutlineFileDownload className="text-emerald-400" size={20} />
              <span className="text-slate-200 font-medium text-sm group-hover:text-white">
                Export CSV
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Expense"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="premium-input font-handjet tracking-wider text-xl"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="premium-input text-slate-300 cursor-pointer appearance-none"
              required
            >
              {[
                "Grocery",
                "Vehicle",
                "Shopping",
                "Travel",
                "Food",
                "Fun",
                "Other",
              ].map((c) => (
                <option key={c} value={c} className="bg-brand-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 flex flex-col items-stretch z-50">
            <label className="text-sm font-medium text-slate-300">Date</label>
            <div className="relative z-50">
              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
                className="premium-input w-full cursor-pointer z-50 inline-block"
                dateFormat="MMM d, yyyy"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
