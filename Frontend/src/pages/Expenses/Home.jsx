import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { expensesApi } from "../../services/api/expensesApi";
import { getUserId } from "../../utils/Expenses/authHelper";
import { MetricCard } from "../../components/ui/card";
import { CategoryPieChart } from "../../components/Expenses/dashboard/CategoryPieChart";
import MonthlyExpenseChart from "../../components/Expenses/dashboard/MonthlyExpenseChart";
import TransactionsTable from "../../components/Expenses/dashboard/TransactionsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { MetricCardSkeleton, ChartSkeleton, CardSkeleton } from "../../components/dashboard/shared/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  MdAdd,
  MdWarning,
  MdOutlineFileDownload,
  MdDelete,
  MdEdit,
  MdCheckCircle,
} from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { getExpenseStatus } from "../../utils/Expenses/helpers";

const STUDENT_CATEGORIES = [
  "Tuition Fees",
  "Hostel Fees",
  "Mess Fees",
  "Books",
  "Transportation",
  "Internet",
  "Mobile Recharge",
  "Subscriptions",
  "Food",
  "Shopping",
  "Healthcare",
  "Other"
];

const Home = () => {
  const navigate = useNavigate();
  const [userdata] = useState(() => JSON.parse(localStorage.getItem("User")));
  const userId = getUserId(userdata);
  const [userexp, setUserexp] = useState([]);
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [isEditBillOpen, setIsEditBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  // Forms
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "Food",
    date: new Date(),
    title: "",
    type: "expense",
    paymentMethod: "UPI",
    note: ""
  });

  const [billForm, setBillForm] = useState({
    billName: "",
    amount: "",
    dueDate: "",
    priority: "Medium",
    isRecurring: false,
    recurringType: "None"
  });

  const loadData = async () => {
    setIsLoading(true);
    if (!userdata) {
      navigate("/expenses-tracker/login");
      return;
    }

    try {
      const [expData, billsData, summaryData, settingsData] = await Promise.all([
        expensesApi.getUserExpenses(userId),
        expensesApi.getBills(),
        expensesApi.getDashboardSummary(),
        expensesApi.getSettings()
      ]);

      setUserexp(expData || []);
      setBills(billsData || []);
      setSummary(summaryData);
      setSettings(settingsData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const res = await expensesApi.createExpense({
      ...expenseForm,
      userId: userId,
      amount: Number(expenseForm.amount),
      date: expenseForm.date.toISOString(),
      title: expenseForm.title || expenseForm.category
    });
    if (res) {
      toast.success("Expense added successfully!");
      setIsAddExpenseOpen(false);
      setExpenseForm({
        amount: "",
        category: "Food",
        date: new Date(),
        title: "",
        type: "expense",
        paymentMethod: "UPI",
        note: ""
      });
      loadData();
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    const res = await expensesApi.createBill({
      ...billForm,
      amount: Number(billForm.amount)
    });
    if (res.statusCode === 201) {
      toast.success("Bill scheduled successfully!");
      setIsAddBillOpen(false);
      setBillForm({
        billName: "",
        amount: "",
        dueDate: "",
        priority: "Medium",
        isRecurring: false,
        recurringType: "None"
      });
      loadData();
    } else {
      toast.error(res.message || "Failed to add bill");
    }
  };

  const handleEditBillSubmit = async (e) => {
    e.preventDefault();
    const res = await expensesApi.updateBill(editingBill._id, {
      billName: editingBill.billName,
      amount: Number(editingBill.amount),
      dueDate: editingBill.dueDate,
      priority: editingBill.priority,
      isRecurring: editingBill.isRecurring,
      recurringType: editingBill.recurringType
    });
    if (res.statusCode === 200) {
      toast.success("Bill updated successfully!");
      setIsEditBillOpen(false);
      setEditingBill(null);
      loadData();
    } else {
      toast.error(res.message || "Failed to update bill");
    }
  };

  const handleDeleteBill = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      const res = await expensesApi.deleteBill(id);
      if (res.statusCode === 200) {
        toast.success("Bill deleted successfully!");
        loadData();
      }
    }
  };

  const handlePayBill = async (id) => {
    const res = await expensesApi.payBill(id);
    if (res.statusCode === 200) {
      toast.success("Bill marked as paid & history updated!");
      loadData();
    } else {
      toast.error(res.message || "Failed to pay bill");
    }
  };

  const getCurrencySymbol = () => {
    return settings?.currency === "USD" ? "$" : settings?.currency === "EUR" ? "€" : settings?.currency === "GBP" ? "£" : "₹";
  };

  // CSV Export Trigger
  const downloadCSV = () => {
    expensesApi.downloadReportCSV();
  };

  // PDF Export Trigger
  const downloadPDF = () => {
    expensesApi.downloadReportPDF();
  };

  // Calculations for prediction
  const budgetPercentage = summary?.utilizationPercentage || 0;
  const currencySymbol = getCurrencySymbol();

  // Status mapping via helper
  const utilizationStatus = getExpenseStatus(budgetPercentage > 90 ? "Critical" : budgetPercentage > 75 ? "High" : "Active");

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fade-in-up relative pb-16 px-6 py-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-foreground tracking-tight flex items-center gap-3">
            <span className="text-[var(--primary)] font-sans">Expense</span> Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage student budgets, track recurring bills, check predictions, and export financial summaries.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddBillOpen(true)}
            className="btn btn-secondary flex items-center gap-2 h-10 px-4"
          >
            <MdAdd size={18} /> Add Bill
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="btn btn-primary flex items-center gap-2 h-10 px-4"
          >
            <MdAdd size={18} /> Add Expense
          </button>
        </div>
      </div>

      {/* Primary Analytics & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Stats cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Monthly Budget Limit"
                value={`${currencySymbol} ${(summary?.monthlyBudget || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Spent This Month"
                value={`${currencySymbol} ${(summary?.totalSpent || 0).toLocaleString()}`}
              />
              <MetricCard
                title="Remaining Budget"
                value={`${currencySymbol} ${(summary?.remainingBudget || 0).toLocaleString()}`}
              />
            </>
          )}
        </div>

        {/* Right Side: Prediction & Budget Health */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <CardSkeleton rows={2} />
          ) : (
            <div className={`glass-card flex flex-col justify-between h-full border border-border bg-card p-6 rounded-[var(--radius-lg)] shadow-sm ${budgetPercentage > 90 ? "border-rose-500/50 shadow-lg shadow-rose-500/5" : ""}`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-foreground font-bold text-sm uppercase tracking-wide">Budget Prediction</h4>
                  {budgetPercentage > 90 && (
                    <MdWarning className="text-rose-500 animate-pulse" size={20} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Based on your current month-to-date spending rates.</p>
              </div>

              <div className="my-4">
                <div className="flex justify-between text-xs font-semibold mb-1 text-foreground">
                  <span>Projected Spent: {currencySymbol}{summary?.projectedSpend?.toLocaleString()}</span>
                  <span>{budgetPercentage}% used</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      utilizationStatus.badgeVariant === "destructive" 
                        ? "bg-rose-500" 
                        : utilizationStatus.badgeVariant === "warning" 
                        ? "bg-amber-500" 
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-secondary/30 p-2.5 rounded-[var(--radius-md)] border border-border/40 text-[11px] text-muted-foreground">
                Expected month-end savings: <span className="font-bold text-foreground">{currencySymbol}{(summary?.savingsGoal - (summary?.projectedSpend || 0)) > 0 ? (summary?.savingsGoal - (summary?.projectedSpend || 0)).toLocaleString() : "0"}</span>. Target was: <span className="font-semibold text-foreground">{currencySymbol}{summary?.savingsGoal?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Layout Splits: Analytics & Bills */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Analytics Section: Trends & Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="glass-card flex flex-col h-[320px] gap-4">
                <ChartSkeleton />
              </div>
            ) : userexp.length === 0 ? (
              <div className="glass-card flex flex-col h-[320px] justify-center items-center gap-4 border border-border rounded-[var(--radius-lg)] p-6 bg-card">
                <EmptyState title="No Trend Data" message="Add transactions to view monthly progress." />
              </div>
            ) : (
              <MonthlyExpenseChart exdata={userexp} />
            )}

            {isLoading ? (
              <div className="glass-card flex flex-col h-[320px] gap-4">
                <ChartSkeleton />
              </div>
            ) : userexp.length === 0 ? (
              <div className="glass-card flex flex-col h-[320px] justify-center items-center gap-4 border border-border rounded-[var(--radius-lg)] p-6 bg-card">
                <EmptyState title="No Breakdown Found" />
              </div>
            ) : (
              <CategoryPieChart exdata={userexp} />
            )}
          </div>

          {/* Recent Transactions Table */}
          {isLoading ? (
            <div className="glass-card p-6 border border-border rounded-[var(--radius-lg)] bg-card">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <TransactionsTable
              transactions={userexp}
              onUpdate={loadData}
            />
          )}
        </div>

        {/* Bills Tracker Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-[var(--radius-md)] border border-border bg-card text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Due Today</span>
              <span className="block text-xl font-extrabold text-amber-500 mt-1">{summary?.dueTodayCount || 0}</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] border border-border bg-card text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Overdue Bills</span>
              <span className="block text-xl font-extrabold text-rose-500 mt-1">{summary?.overdueCount || 0}</span>
            </div>
          </div>

          {/* Active Bills List */}
          <div className="glass-card border border-border bg-card p-5 rounded-[var(--radius-lg)] shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h3 className="text-base font-bold text-foreground">Active Bills</h3>
              <Badge variant="secondary">
                {bills.length} active
              </Badge>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : bills.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8 italic">No active bills scheduled. Add one to stay alerted.</p>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {bills.map((bill) => {
                  const billStatus = getExpenseStatus(bill.status);
                  const billPriority = getExpenseStatus(bill.priority);
                  return (
                    <div
                      key={bill._id}
                      className={`p-3.5 rounded-[var(--radius-md)] border flex flex-col justify-between gap-3 bg-secondary/15 ${
                        bill.status === "Overdue" 
                          ? "border-rose-500/30 bg-rose-500/5" 
                          : bill.status === "Due Today" 
                          ? "border-amber-500/30 bg-amber-500/5" 
                          : "border-border/60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-foreground">{bill.billName}</h4>
                            {bill.isRecurring && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                                {bill.recurringType}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-foreground">
                          {currencySymbol}{bill.amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/30">
                        <div className="flex gap-1.5 items-center">
                          <Badge variant={billPriority.badgeVariant}>
                            {bill.priority}
                          </Badge>
                          <Badge variant={billStatus.badgeVariant}>
                            {bill.status}
                          </Badge>
                        </div>

                        <div className="flex gap-1.5 items-center">
                          <button
                            onClick={() => handlePayBill(bill._id)}
                            className="btn btn-success h-8 px-2.5 text-xs flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-[var(--radius-sm)]"
                          >
                            <MdCheckCircle size={12} />
                            {bill.status === "Overdue" ? "Clear" : "Pay"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingBill({
                                ...bill,
                                dueDate: new Date(bill.dueDate).toISOString().split("T")[0]
                              });
                              setIsEditBillOpen(true);
                            }}
                            className="btn btn-secondary h-8 w-8 p-0 border border-border flex items-center justify-center rounded-[var(--radius-sm)] text-foreground hover:bg-secondary"
                            title="Edit Bill"
                          >
                            <MdEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill._id)}
                            className="btn btn-danger h-8 w-8 p-0 bg-rose-600/10 text-rose-500 hover:bg-rose-600/20 border border-rose-500/20 flex items-center justify-center rounded-[var(--radius-sm)]"
                            title="Delete Bill"
                          >
                            <MdDelete size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick PDF/CSV Export buttons card */}
          <div className="glass-card border border-border bg-card p-4 rounded-[var(--radius-lg)] shadow-sm flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-foreground">Monthly Reports</span>
            <div className="flex gap-2">
              <button 
                onClick={downloadCSV}
                className="btn btn-secondary h-8 px-3 text-xs flex items-center gap-1 border border-border rounded-[var(--radius-sm)] hover:bg-secondary"
              >
                <MdOutlineFileDownload /> CSV
              </button>
              <button 
                onClick={downloadPDF}
                className="btn btn-primary h-8 px-3 text-xs flex items-center gap-1 bg-primary text-white rounded-[var(--radius-sm)] hover:bg-primary-hover"
              >
                <MdOutlineFileDownload /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Global action button bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center shadow-[var(--shadow-lg)] shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 transition-all hover:scale-110 active:scale-95 duration-200 cursor-pointer"
          title="Quick Add Expense"
        >
          <MdAdd size={28} />
        </button>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Title / Description</label>
              <input
                type="text"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="e.g. Starbucks Coffee, Reference Book"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                >
                  {STUDENT_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                <select
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                >
                  <option value="UPI" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">UPI</option>
                  <option value="Cash" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Cash</option>
                  <option value="Card" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Card</option>
                  <option value="Bank" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 flex flex-col items-stretch">
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <DatePicker
                selected={expenseForm.date}
                onChange={(d) => setExpenseForm({ ...expenseForm, date: d })}
                className="premium-input w-full cursor-pointer bg-secondary"
                dateFormat="MMM d, yyyy"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Notes (Optional)</label>
              <input
                type="text"
                value={expenseForm.note}
                onChange={(e) => setExpenseForm({ ...expenseForm, note: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="Add brief details..."
              />
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Bill Dialog */}
      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Bill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBill} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
              <input
                type="text"
                value={billForm.billName}
                onChange={(e) => setBillForm({ ...billForm, billName: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="e.g. Internet Bill, Tuition Payments"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
              <input
                type="number"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                className="premium-input text-foreground h-10 w-full"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
              <input
                type="date"
                value={billForm.dueDate}
                onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                <select
                  value={billForm.priority}
                  onChange={(e) => setBillForm({ ...billForm, priority: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                >
                  <option value="Low" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Low</option>
                  <option value="Medium" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Medium</option>
                  <option value="High" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">High</option>
                  <option value="Critical" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Critical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Recurring Frequency</label>
                <select
                  value={billForm.recurringType}
                  onChange={(e) => setBillForm({ 
                    ...billForm, 
                    recurringType: e.target.value,
                    isRecurring: e.target.value !== "None"
                  })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                >
                  <option value="None" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">None</option>
                  <option value="Monthly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Monthly</option>
                  <option value="Quarterly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Quarterly</option>
                  <option value="Semester" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Semester (6 Mo.)</option>
                  <option value="Yearly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Yearly</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
              <button
                type="button"
                onClick={() => setIsAddBillOpen(false)}
                className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover"
              >
                Confirm
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Bill Dialog */}
      <Dialog open={isEditBillOpen} onOpenChange={(open) => {
        setIsEditBillOpen(open);
        if (!open) setEditingBill(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bill Details</DialogTitle>
          </DialogHeader>
          {editingBill && (
            <form onSubmit={handleEditBillSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Bill Name</label>
                <input
                  type="text"
                  value={editingBill.billName}
                  onChange={(e) => setEditingBill({ ...editingBill, billName: e.target.value })}
                  className="premium-input text-foreground h-10 w-full"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  value={editingBill.amount}
                  onChange={(e) => setEditingBill({ ...editingBill, amount: e.target.value })}
                  className="premium-input text-foreground h-10 w-full"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
                <input
                  type="date"
                  value={editingBill.dueDate}
                  onChange={(e) => setEditingBill({ ...editingBill, dueDate: e.target.value })}
                  className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
                  <select
                    value={editingBill.priority}
                    onChange={(e) => setEditingBill({ ...editingBill, priority: e.target.value })}
                    className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                  >
                    <option value="Low" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Low</option>
                    <option value="Medium" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Medium</option>
                    <option value="High" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">High</option>
                    <option value="Critical" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Critical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Recurring Frequency</label>
                  <select
                    value={editingBill.recurringType}
                    onChange={(e) => setEditingBill({ 
                      ...editingBill, 
                      recurringType: e.target.value,
                      isRecurring: e.target.value !== "None"
                    })}
                    className="premium-input text-foreground h-10 w-full cursor-pointer bg-secondary"
                  >
                    <option value="None" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">None</option>
                    <option value="Monthly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Monthly</option>
                    <option value="Quarterly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Quarterly</option>
                    <option value="Semester" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Semester (6 Mo.)</option>
                    <option value="Yearly" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditBillOpen(false);
                    setEditingBill(null);
                  }}
                  className="btn btn-secondary border border-border px-4 py-2 rounded-[var(--radius-sm)] text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-primary text-white px-4 py-2 rounded-[var(--radius-sm)] hover:bg-primary-hover"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
