import React, { useEffect, useState, useMemo } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { Link } from "react-router-dom";
import { MdOutlineFileDownload, MdArrowBack } from "react-icons/md";
import { toast } from "react-hot-toast";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import ExpenseFilters from "../../components/Expenses/shared/ExpenseFilters";
import { getExpenseStatus } from "../../utils/Expenses/helpers";

const BillHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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
      if (selectedMonth !== "" && item.paidDate) {
        const date = new Date(item.paidDate);
        const monthName = date.toLocaleString("en-US", { month: "long", year: "numeric" });
        matchesMonth = monthName === selectedMonth;
      }

      return matchesSearch && matchesMonth;
    });
  }, [history, search, selectedMonth]);

  const currencySymbol = getCurrencySymbol();

  return (
    <PageLayout className="w-full animate-fade-in-up px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/expenses-tracker"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <MdArrowBack /> Back to Expense Dashboard
          </Link>
          <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
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

      {/* Filter Toolbar using canonical filters */}
      <SectionContainer className="mt-6">
        <ExpenseFilters
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by bill name..."
          filterCategory={selectedMonth}
          onCategoryChange={setSelectedMonth}
          categories={uniqueMonths}
          className="rounded-[var(--radius-lg)] border border-border bg-card shadow-sm p-6"
        />
      </SectionContainer>

      {/* Data Table */}
      <SectionContainer className="mt-6">
        <PremiumCard hoverEffect={false} className="bg-card border border-border rounded-[var(--radius-lg)] shadow-sm">
          <div className="table-responsive">
            <Table className="w-full text-left border-collapse whitespace-nowrap">
              <TableHeader>
                <TableRow className="bg-[var(--bg-secondary)] text-[var(--text-muted)] text-sm">
                  <TableHead className="px-6 h-12">Bill Name</TableHead>
                  <TableHead className="px-6 h-12">Amount</TableHead>
                  <TableHead className="px-6 h-12">Due Date</TableHead>
                  <TableHead className="px-6 h-12">Paid Date</TableHead>
                  <TableHead className="px-6 h-12">Priority</TableHead>
                  <TableHead className="px-6 text-right h-12">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="h-14">
                    <TableCell colSpan="6" className="text-center text-muted-foreground py-8">
                      <Skeleton className="h-10 w-full mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                ) : filteredHistory.length === 0 ? (
                  <TableRow className="h-14">
                    <TableCell colSpan="6" className="text-center text-muted-foreground italic py-8">
                      No paid bill logs found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map(item => {
                    const priorityMeta = getExpenseStatus(item.priority);
                    const statusMeta = getExpenseStatus("Paid");
                    return (
                      <TableRow key={item._id} className="h-14">
                        <TableCell className="px-6 font-bold text-foreground">{item.billName}</TableCell>
                        <TableCell className="px-6 font-extrabold text-foreground">
                          {currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="px-6 text-muted-foreground text-xs">
                          {new Date(item.dueDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="px-6 text-emerald-500 font-semibold text-xs">
                          {item.paidDate ? new Date(item.paidDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge variant={priorityMeta.badgeVariant}>
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <Badge variant={statusMeta.badgeVariant}>
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </PremiumCard>
      </SectionContainer>
    </PageLayout>
  );
};

export default BillHistory;
