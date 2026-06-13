import React, { useState, useMemo } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { expensesApi } from "../../../services/api/expensesApi";
import Modal from "../ui/Modal";
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

  const getCategoryColor = (category) => {
    const colors = {
      Grocery: "text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-900/30",
      Vehicle: "text-[var(--primary)] bg-[var(--primary)]/10 border-blue-200 dark:text-[var(--primary)] dark:bg-blue-950/30 dark:border-blue-900/30",
      Shopping: "text-[var(--primary)] bg-[var(--primary)]/10 border-purple-200 dark:text-[var(--primary)] dark:bg-purple-950/30 dark:border-purple-900/30",
      Travel: "text-[var(--primary)] bg-[var(--primary)]/10 border-indigo-200 dark:text-[var(--primary)] dark:bg-indigo-950/30 dark:border-indigo-900/30",
      Food: "text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-900/30",
      Fun: "text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900/30",
      Other: "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-950/30 dark:border-slate-900/30",
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="table-responsive flex flex-col">
      {/* Header & Controls */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">All Transactions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by category or amount..."
            className="premium-input text-sm h-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="premium-input text-sm h-10 cursor-pointer text-foreground bg-secondary"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">
              All Categories
            </option>
            {categories?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative">
            <DatePicker
              selected={filterDate}
              onChange={(date) => {
                setFilterDate(date);
                setCurrentPage(1);
              }}
              isClearable
              placeholderText="Filter by Date"
              className="premium-input w-full text-sm h-10 cursor-pointer z-10"
            />
          </div>
          <select
            className="premium-input text-sm h-10 cursor-pointer text-foreground bg-secondary"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="latest">
              Latest
            </option>
            <option value="oldest">
              Oldest
            </option>
            <option value="highest">
              Highest Amount
            </option>
            <option value="lowest">
              Lowest Amount
            </option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto flex-1 min-h-[350px]">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/40 border-b border-border text-muted-foreground text-sm">
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData?.map((exp) => (
                <tr
                  key={exp._id}
                  className="border-b border-border hover:bg-secondary/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-medium ${getCategoryColor(exp.category)}`}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {formatDate(exp.date)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-foreground text-lg">
                      ₹ {exp.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/20">
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-foreground">
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
      </Modal>

      {/* Edit Form Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Transaction"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
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
              className="premium-input text-lg"
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
              className="premium-input text-foreground cursor-pointer bg-secondary"
              required
            >
              {categories?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 flex flex-col items-stretch z-50">
            <label className="text-sm font-medium text-foreground">Date</label>
            <div className="relative z-50">
              <DatePicker
                selected={editForm.date}
                onChange={(date) => setEditForm({ ...editForm, date })}
                className="premium-input w-full cursor-pointer z-50 inline-block bg-secondary"
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
      </Modal>
    </div>
  );
};

export default TransactionsTable;
