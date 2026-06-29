import React, { useState, useMemo } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { expensesApi } from "../../../services/api/expensesApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../ui/table";
import ExpenseFilters from "../shared/ExpenseFilters";
import { getExpenseCategory } from "../../../utils/Expenses/categories";
import { getExpenseStatus } from "../../../utils/Expenses/helpers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TransactionsTable = ({ transactions, onUpdate }) => {
  // State for advanced features
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [sortBy, setSortBy] = useState("latest"); // latest, oldest, highest, lowest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const categories = [
    "Grocery",
    "Vehicle",
    "Shopping",
    "Travel",
    "Food",
    "Fun",
    "Other",
  ];

  // Data processing pipeline
  const processedData = useMemo(() => {
    let result = transactions ? [...transactions] : [];

    // Search
    if (searchQuery) {
      result = result?.filter(
        (tx) =>
          tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.amount.toString().includes(searchQuery),
      );
    }
    // Filter Category
    if (filterCategory) {
      result = result?.filter((tx) => tx.category === filterCategory);
    }
    // Filter Date
    if (filterDate) {
      const targetDate = filterDate.toLocaleDateString();
      result = result?.filter(
        (tx) => new Date(tx.date).toLocaleDateString() === targetDate,
      );
    }
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, searchQuery, filterCategory, filterDate, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Actions
  const openDeleteModal = (tx) => {
    setSelectedTx(tx);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTx) {
      await expensesApi.deleteExpense({
        expenseId: selectedTx._id,
        userId: selectedTx.userId,
      });
      if (onUpdate) onUpdate();
    }
    setIsDeleteModalOpen(false);
    setSelectedTx(null);
  };

  const openEditModal = (tx) => {
    setSelectedTx(tx);
    setEditForm({
      amount: tx.amount,
      category: tx.category,
      date: new Date(tx.date),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedTx) {
      await expensesApi.deleteExpense({
        expenseId: selectedTx._id,
        userId: selectedTx.userId,
      });

      await expensesApi.createExpense({
        userId: selectedTx.userId,
        category: editForm.category,
        date: editForm.date,
        amount: Number(editForm.amount),
      });
      if (onUpdate) onUpdate();
    }
    setIsEditModalOpen(false);
    setSelectedTx(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(Date.parse(dateStr));
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="table-responsive flex flex-col bg-card border border-border rounded-[var(--radius-lg)] shadow-sm">
      {/* Header & Controls */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">All Transactions</h3>
        
        <ExpenseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          categories={categories}
          filterDate={filterDate}
          onDateChange={setFilterDate}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { value: "latest", label: "Latest" },
            { value: "oldest", label: "Oldest" },
            { value: "highest", label: "Highest Amount" },
            { value: "lowest", label: "Lowest Amount" }
          ]}
          className="p-0 border-b-0"
        />
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto flex-1 min-h-[350px]">
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow className="bg-[var(--bg-secondary)] text-[var(--text-muted)] text-sm">
              <TableHead className="px-6 h-12">Category</TableHead>
              <TableHead className="px-6 h-12">Date</TableHead>
              <TableHead className="px-6 text-right h-12">Amount</TableHead>
              <TableHead className="px-6 text-center h-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData?.map((exp) => {
                const categoryMeta = getExpenseCategory(exp.category);
                return (
                  <TableRow
                    key={exp._id}
                    className="group h-14"
                  >
                    <TableCell className="px-6">
                      <Badge variant={categoryMeta.badgeVariant}>
                        {exp.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground text-sm">
                      {formatDate(exp.date)}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <span className="font-bold text-foreground text-lg">
                        ₹ {exp.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-[var(--radius-sm)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Edit Transaction"
                        >
                          <AiOutlineEdit size={20} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(exp)}
                          className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-[var(--radius-sm)] transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Transaction"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="h-14">
                <TableCell
                  colSpan="4"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No transactions found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/20 rounded-b-[var(--radius-lg)]">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="text-foreground font-medium">
              {Math.min(currentPage * itemsPerPage, processedData.length)}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-medium">
              {processedData.length}
            </span>{" "}
            results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-[var(--radius-sm)] border border-border text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-[var(--radius-sm)] border border-border text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="text-foreground pt-4">
            <p className="mb-6">
              Are you sure you want to delete this {selectedTx?.category} expense
              of{" "}
              <span className="text-foreground font-bold text-lg">
                ₹ {selectedTx?.amount.toLocaleString()}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-[var(--radius-sm)] bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 transition-all"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Amount (₹)
              </label>
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="premium-input text-lg w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                className="premium-input text-foreground cursor-pointer bg-secondary w-full"
                required
              >
                {categories?.map((c) => (
                  <option key={c} value={c} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 flex flex-col items-stretch">
              <label className="text-sm font-medium text-foreground">Date</label>
              <div className="relative">
                <DatePicker
                  selected={editForm.date}
                  onChange={(date) => setEditForm({ ...editForm, date })}
                  className="premium-input w-full cursor-pointer inline-block bg-secondary"
                  dateFormat="MMM d, yyyy"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-8">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 rounded-[var(--radius-sm)] border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-[var(--radius-sm)] bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsTable;
