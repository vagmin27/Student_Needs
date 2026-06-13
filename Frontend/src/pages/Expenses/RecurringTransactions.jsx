import React, { useState, useEffect } from "react";
import Modal from "../../components/Expenses/ui/Modal";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { expensesApi } from "../../services/api/expensesApi";
import { getUserId } from "../../utils/Expenses/authHelper";
import { toast } from "react-hot-toast";

const RecurringTransactions = () => {
  const user = JSON.parse(localStorage.getItem("User"));
  const userId = getUserId(user);

  const [recurringData, setRecurringData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    frequency: "Monthly",
    category: "Other",
    nextDate: new Date().toISOString().substring(0, 10),
  });

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const rules = await expensesApi.getRecurringRules();
      setRecurringData(rules || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateLocalRules = async (rules) => {
    try {
      for (const rule of rules) {
        await expensesApi.createRecurringRule({
          title: rule.title,
          amount: Number(rule.amount),
          frequency: rule.frequency,
          category: rule.category,
          nextDate: rule.nextDate,
          isActive: rule.isActive !== false,
        });
      }
      localStorage.removeItem(`recurring_tx_${userId}`);
    } catch (err) {
      console.error("Migration failed:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchAndMigrate = async () => {
        try {
          const dbRules = await expensesApi.getRecurringRules();
          const saved = localStorage.getItem(`recurring_tx_${userId}`);
          const localRules = saved ? JSON.parse(saved) : [];
          
          if (localRules.length > 0 && dbRules.length === 0) {
            await migrateLocalRules(localRules);
            const updatedRules = await expensesApi.getRecurringRules();
            setRecurringData(updatedRules || []);
          } else {
            setRecurringData(dbRules || []);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAndMigrate();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleToggle = async (id, currentActive) => {
    try {
      const res = await expensesApi.updateRecurringRule(id, { isActive: !currentActive });
      if (res.statusCode === 200) {
        toast.success("Rule status updated!");
        fetchRules();
      } else {
        toast.error(res.message || "Failed to update rule status");
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this recurring rule?")) {
      try {
        const res = await expensesApi.deleteRecurringRule(id);
        if (res.statusCode === 200) {
          toast.success("Recurring rule deleted successfully!");
          fetchRules();
        } else {
          toast.error(res.message || "Failed to delete rule");
        }
      } catch (err) {
        toast.error("Failed to delete rule.");
      }
    }
  };

  const openForm = (tx = null) => {
    if (tx) {
      setEditingId(tx._id);
      setFormData({
        title: tx.title,
        amount: tx.amount,
        frequency: tx.frequency,
        category: tx.category,
        nextDate: new Date(tx.nextDate).toISOString().substring(0, 10),
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        amount: "",
        frequency: "Monthly",
        category: "Other",
        nextDate: new Date().toISOString().substring(0, 10),
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await expensesApi.updateRecurringRule(editingId, {
          title: formData.title,
          amount: Number(formData.amount),
          frequency: formData.frequency,
          category: formData.category,
          nextDate: new Date(formData.nextDate).toISOString(),
        });
        if (res.statusCode === 200) {
          toast.success("Rule updated successfully!");
          setIsModalOpen(false);
          fetchRules();
        } else {
          toast.error(res.message || "Failed to update rule");
        }
      } else {
        const res = await expensesApi.createRecurringRule({
          title: formData.title,
          amount: Number(formData.amount),
          frequency: formData.frequency,
          category: formData.category,
          nextDate: new Date(formData.nextDate).toISOString(),
        });
        if (res.statusCode === 201) {
          toast.success("Recurring rule created successfully!");
          setIsModalOpen(false);
          fetchRules();
        } else {
          toast.error(res.message || "Failed to create rule");
        }
      }
    } catch (err) {
      toast.error("Failed to save recurring rule.");
    }
  };

  const getStatus = (nextDateStr, isActive) => {
    if (!isActive)
      return {
        label: "Paused",
        color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      };
    const diff = new Date(nextDateStr) - new Date();
    if (diff < 0)
      return {
        label: "Overdue",
        color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
        glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]",
      };
    if (diff < 86400000 * 3)
      return {
        label: "Upcoming",
        color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      };
    return {
      label: "Active",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
  };

  const upcomingCards = [...recurringData]
    .filter((tx) => tx.isActive)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 3);

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-mont text-foreground tracking-tight flex items-center gap-3">
            <span className="text-brand-primary">Automated</span> Payments
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your subscriptions and recurring bills effortlessly.
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-md)] bg-gradient-to-r from-brand-primary to-indigo-600 text-[var(--primary-foreground)] font-bold shadow-[var(--shadow-lg)] shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all hover:-translate-y-0.5"
        >
          <AiOutlinePlus size={20} /> New Rule
        </button>
      </div>

      {/* Auto Debit Cards UI (Premium Standout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingCards?.map((card, idx) => {
          const isOverdue = new Date(card.nextDate) < new Date();
          const gradients = [
            "from-purple-600 to-brand-primary",
            "from-emerald-600 to-teal-500",
            "from-orange-500 to-rose-500",
          ];
          const bgGradient = gradients[idx % gradients.length];

          return (
            <div
              key={card._id}
              className={`relative overflow-hidden rounded-[var(--radius-lg)] p-6 transition-transform hover:-translate-y-2 group ${isOverdue ? "shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-rose-500/50" : "shadow-glass border border-border"}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-20 group-hover:opacity-30 transition-opacity`}
              ></div>

              {/* Glass reflection effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-2xl rounded-full"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-[var(--text-white)] font-bold text-lg">
                      {card.title}
                    </h4>
                    <p className="text-[var(--text-white)]/60 text-xs font-medium uppercase tracking-wider">
                      {card.category}
                    </p>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-[var(--text-white)]">
                    {card.frequency}
                  </div>
                </div>

                <div>
                  <p className="text-[var(--text-white)]/60 text-sm mb-1">
                    Auto Debit Amount
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-3xl font-sans font-bold text-[var(--text-white)] tracking-tight">
                      ₹ {card.amount.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm font-bold ${isOverdue ? "text-rose-400 animate-pulse" : "text-[var(--text-white)]"}`}
                    >
                      {isOverdue
                        ? "OVERDUE"
                        : new Date(card.nextDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {upcomingCards.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed border-border rounded-[var(--radius-lg)]">
            No active subscriptions upcoming.
          </div>
        )}
      </div>

      {/* Main Recurring List Table */}
      <div className="table-responsive w-full">
        <div className="p-6 border-b border-border flex justify-between items-center bg-brand-800/80">
          <h3 className="text-xl font-bold text-[var(--primary-foreground)]">Active Rules</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/20 text-muted-foreground text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-semibold">Subscription / Bill</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">
                  Frequency
                </th>
                <th className="px-6 py-4 font-semibold text-center">
                  Next Date
                </th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Toggle</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringData?.map((tx) => {
                const status = getStatus(tx.nextDate, tx.isActive);
                return (
                  <tr
                    key={tx._id}
                    className="border-b border-border hover:bg-muted/10 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-foreground font-medium">{tx.title}</p>
                      <p className="text-muted-foreground text-xs">{tx.category}</p>
                    </td>
                    <td className="px-6 py-4 font-sans font-semibold text-foreground">
                      ₹ {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-muted/10 border border-border rounded-[var(--radius-sm)] text-muted-foreground text-sm">
                        {tx.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground text-sm">
                      {new Date(tx.nextDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${status.color} ${status.glow || ""}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Premium Toggle Switch */}
                      <button
                        onClick={() => handleToggle(tx._id, tx.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tx.isActive ? "bg-brand-primary" : "bg-slate-600"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tx.isActive ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openForm(tx)}
                          className="p-2 text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10 rounded-[var(--radius-sm)] transition-colors"
                        >
                          <AiOutlineEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-2 text-muted-foreground hover:text-brand-danger hover:bg-brand-danger/10 rounded-[var(--radius-sm)] transition-colors"
                        >
                          <AiOutlineDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {recurringData.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No recurring rules configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing / Creating Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Recurring Rule" : "New Recurring Rule"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Rule Name / Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="premium-input"
              placeholder="Spotify Subs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="premium-input text-base"
                placeholder="119"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Frequency
              </label>
              <select
                required
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="premium-input text-muted-foreground"
              >
                <option className="bg-brand-900" value="Daily">
                  Daily
                </option>
                <option className="bg-brand-900" value="Weekly">
                  Weekly
                </option>
                <option className="bg-brand-900" value="Monthly">
                  Monthly
                </option>
                <option className="bg-brand-900" value="Yearly">
                  Yearly
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 z-50 relative">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Next Execution
              </label>
              <input
                type="date"
                required
                value={formData.nextDate}
                onChange={(e) =>
                  setFormData({ ...formData, nextDate: e.target.value })
                }
                className="premium-input w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="premium-input text-muted-foreground"
              >
                {[
                  "Grocery",
                  "Vehicle",
                  "Shopping",
                  "Travel",
                  "Food",
                  "Fun",
                  "Other",
                ]?.map((c) => (
                  <option key={c} value={c} className="bg-brand-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 rounded-[var(--radius-md)] border border-border text-foreground font-medium hover:bg-muted/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-[var(--radius-md)] bg-gradient-to-r from-brand-primary to-indigo-600 text-[var(--primary-foreground)] font-bold shadow-[var(--shadow-lg)] shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all"
            >
              Save Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecurringTransactions;