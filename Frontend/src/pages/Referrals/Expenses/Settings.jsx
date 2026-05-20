import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Settings = () => {
  const [user, setUser] = useState({ username: "User", email: "" });

  // NEW: get userId
  const storedUser = JSON.parse(localStorage.getItem("User"));
  const userId = storedUser?._id;

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(`user_settings_${userId}`);
    return saved
      ? JSON.parse(saved)
      : {
          monthlyBudget: 25000,
          currency: "INR",
          reminderTime: "09:00",
          emailAlerts: true,
          darkTheme: true,
        };
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("User"));
    if (u) setUser(u);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // UPDATED: save per user
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));

    toast.success("Settings saved successfully!");
  };

  useEffect(() => {
    if (settings.darkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkTheme]);
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold font-mont text-white tracking-tight flex items-center gap-3">
          <span className="text-brand-primary">Profile &</span> Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account preferences and financial configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-emerald-500 p-1 mb-4 shadow-lg shadow-brand-primary/30">
              <div className="w-full h-full bg-brand-900 rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-brand-900">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">{user.username}</h3>
            <p className="text-slate-400 text-sm">
              {user.email || "user@example.com"}
            </p>
            <span className="mt-4 px-4 py-1 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-full text-xs font-bold tracking-wider uppercase">
              Pro Plan
            </span>
          </div>

          <div className="glass-panel p-6">
            <h4 className="font-semibold text-white mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Member Since</span>
                <span className="text-white font-medium text-sm">Oct 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Logged</span>
                <span className="text-white font-medium text-sm">184 Txns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSave}
            className="glass-panel p-6 sm:p-8 space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                Financial Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Monthly Budget Goal
                  </label>
                  <input
                    type="number"
                    name="monthlyBudget"
                    value={settings.monthlyBudget}
                    onChange={handleChange}
                    className="premium-input font-handjet tracking-wider text-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Default Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="premium-input text-slate-300"
                  >
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">
                Notifications & App
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Daily Reminder Time
                  </label>
                  <input
                    type="time"
                    name="reminderTime"
                    value={settings.reminderTime}
                    onChange={handleChange}
                    className="premium-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div>
                  <h4 className="text-white font-medium">
                    Dark Mode Appearance
                  </h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Toggle between dark and light mode.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSettings((p) => ({ ...p, darkTheme: !p.darkTheme }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    settings.darkTheme ? "bg-brand-primary" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkTheme ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-accent to-emerald-600 text-white font-bold tracking-wide shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/50 hover:-translate-y-0.5 transition-all outline-none"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;