import React, { useEffect, useState, useMemo } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { Link } from "react-router-dom";
import { 
  MdSearch, 
  MdCalendarToday, 
  MdOutlineFileDownload, 
  MdArrowBack,
  MdFilterList
} from "react-icons/md";
import { toast } from "react-hot-toast";

const BillHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [settings, setSettings] = useState(null);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const [historyData, settingsData] = await Promise.all([
        expensesApi.getBillHistory(),
        expensesApi.getSettings()
      ]);
      setHistory(historyData || []);
      setSettings(settingsData);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load bill history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getCurrencySymbol = () => {
    return settings?.currency === "USD" ? "$" : settings?.currency === "EUR" ? "€" : settings?.currency === "GBP" ? "£" : "₹";
  };

  // Extract list of unique months in paidDate to populate the month filter dropdown
  const uniqueMonths = useMemo(() => {
    const months = new Set();
    history.forEach(item => {
      if (item.paidDate) {
        const date = new Date(item.paidDate);
        const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        months.add(monthName);
      }
    });
    return Array.from(months);
  }, [history]);

  // Filter history records
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.billName.toLowerCase().includes(search.toLowerCase());
      
      let matchesMonth = true;
      if (selectedMonth !== "all" && item.paidDate) {
        const date = new Date(item.paidDate);
        const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        matchesMonth = monthName === selectedMonth;
      }

      return matchesSearch && matchesMonth;
    });
  }, [history, search, selectedMonth]);

  const currencySymbol = getCurrencySymbol();

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/expenses-tracker"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <MdArrowBack /> Back to Expense Dashboard
          </Link>
          <h2 className="text-3xl font-bold font-mont text-foreground tracking-tight">
            Bill Payment <span className="text-brand-primary">History</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Browse through fully cleared bill payments, analyze month-by-month billing logs, and download reports.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => expensesApi.downloadReportCSV()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] bg-secondary text-foreground border border-border text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <MdOutlineFileDownload /> Export CSV
          </button>
          <button
            onClick={() => expensesApi.downloadReportPDF()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-bold shadow hover:shadow-lg transition-colors cursor-pointer"
          >
            <MdOutlineFileDownload /> Export PDF
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 bg-card border border-border rounded-[var(--radius-lg)] flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search */}
        <div className="flex-1 flex items-center bg-secondary/40 border border-border/60 rounded-[var(--radius-md)] px-3 py-2">
          <MdSearch size={20} className="text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by bill name..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-foreground/60 w-full"
          />
        </div>

        {/* Month Selector */}
        <div className="flex items-center bg-secondary/40 border border-border/60 rounded-[var(--radius-md)] px-3 py-2 sm:w-64">
          <MdCalendarToday size={18} className="text-muted-foreground mr-2 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground cursor-pointer w-full appearance-none pr-6"
          >
            <option value="all">All Months</option>
            {uniqueMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-4 sm:p-5">Bill Name</th>
                <th className="p-4 sm:p-5">Amount</th>
                <th className="p-4 sm:p-5">Due Date</th>
                <th className="p-4 sm:p-5">Paid Date</th>
                <th className="p-4 sm:p-5">Priority</th>
                <th className="p-4 sm:p-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">
                    <span className="spinner spinner-md block mx-auto mb-2" />
                    Loading paid history logs...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground italic">
                    No paid bill logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map(item => (
                  <tr key={item._id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground">{item.billName}</td>
                    <td className="p-4 sm:p-5 font-extrabold text-foreground">
                      {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground text-xs">
                      {new Date(item.dueDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-500 font-semibold text-xs">
                      {item.paidDate ? new Date(item.paidDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.priority === "Critical" 
                          ? "bg-rose-500 text-white" 
                          : item.priority === "High" 
                          ? "bg-amber-500 text-white" 
                          : item.priority === "Medium"
                          ? "bg-[var(--primary)] text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillHistory;
