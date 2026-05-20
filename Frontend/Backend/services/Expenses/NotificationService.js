import Notification from "../../models/Expenses/notificationModel.js";

export const NotificationService = {
  updateSettings: async (userId, settingsData) => {
    const {
      reminderEnabled,
      reminderType,
      reminderTime,
      monthlyReportEnabled,
    } = settingsData;

    const settings = await Notification.findOneAndUpdate(
      { userId },
      {
        reminderEnabled,
        reminderType,
        reminderTime,
        monthlyReportEnabled,
      },
      { upsert: true, new: true },
    );

    return settings;
  },
};
