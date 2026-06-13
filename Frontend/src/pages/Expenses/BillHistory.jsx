import React, { useEffect, useState, useMemo } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { Link } from "react-router-dom";
import { 
  MdSearch, 
  MdCalendarToday, 
  MdOutlineFileDownload, 
  MdArrowBack
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";

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
    <PageLayout className="w-full animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/expenses-tracker"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <MdArrowBack /> Back to Expense Dashboard
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Bill Payment History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse through fully cleared bill payments, analyze month-by-month billing logs, and download reports.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <PremiumButton
            variant="outline"
            size="sm"
            onClick={() => expensesApi.downloadReportCSV()}
            leftIcon={MdOutlineFileDownload}
          >
            Export CSV
          </PremiumButton>
          <PremiumButton
            variant="primary"
            size="sm"
            onClick={() => expensesApi.downloadReportPDF()}
            leftIcon={MdOutlineFileDownload}
          >
            Export PDF
          </PremiumButton>
        </div>
      </div>

      {/* Filter Toolbar */}
      <SectionContainer>
        <PremiumCard hoverEffect={false} className="p-4">
          <div className="flex flex-col sm:flex-row gap-md items-stretch sm:items-center">
            {/* Search */}
            <div className="flex-1 relative flex items-center">
              <MdSearch size={20} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by bill name..."
                className="form-input pl-10"
              />
            </div>

            {/* Month Selector */}
            <div className="relative flex items-center sm:w-64">
              <MdCalendarToday size={18} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-select pl-10"
              >
                <option value="all">All Months</option>
                {uniqueMonths.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </PremiumCard>
      </SectionContainer>

      {/* Data Table */}
      <SectionContainer>
        <PremiumCard hoverEffect={false}>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Bill Name</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Priority</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted-foreground py-8">
                      Loading paid history logs...
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted-foreground italic py-8">
                      No paid bill logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map(item => (
                    <tr key={item._id}>
                      <td className="font-bold text-foreground">{item.billName}</td>
                      <td className="font-extrabold text-foreground">
                        {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-muted-foreground text-xs">
                        {new Date(item.dueDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="text-emerald-500 font-semibold text-xs">
                        {item.paidDate ? new Date(item.paidDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                      </td>
                      <td>
                        <span className={`badge ${
                          item.priority === "Critical" 
                            ? "badge-danger" 
                            : item.priority === "High" 
                            ? "badge-warning" 
                            : item.priority === "Medium"
                            ? "badge-info"
                            : "badge-neutral"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="badge badge-success">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </PremiumCard>
      </SectionContainer>
    </PageLayout>
  );
};

export default BillHistory;
