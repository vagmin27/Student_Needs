import cron from "node-cron";
import mongoose from "mongoose";

import userModel from "../../models/Expenses/userModel.js";
import expenseModel from "../../models/Expenses/expenseModel.js";
import Notification from "../../models/Expenses/notificationModel.js";
import sendEmailWithAttachment from "./emailSend.js";

// ⏰ Smart reminder scheduler
export const smartReminderScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const users = await userModel.find();

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;

      const day = now.getDay();

      for (const user of users) {
        const settings = await Notification.findOne({
          userId: user._id,
        });

        if (!settings || !settings.reminderEnabled) continue;
        if (settings.reminderTime !== currentTime) continue;
        if (settings.reminderType === "weekly" && day !== 0) continue;

        await sendEmailWithAttachment(
          user.email,
          `Hi ${user.username || "User"}, don't forget to update today's expenses 💸`,
        );
      }

      console.log("⏰ Reminder scheduler checked");
    } catch (err) {
      console.log("Reminder scheduler error:", err.message);
    }
  });
};

// 📅 Monthly analysis email scheduler
export const monthlyAnalysisScheduler = () => {
  cron.schedule("59 23 28-31 * *", async () => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (tomorrow.getDate() !== 1) return;

      const users = await userModel.find();

      for (const user of users) {
        const settings = await Notification.findOne({
          userId: user._id,
        });

        if (settings && !settings.monthlyReportEnabled) continue;

        const expenses = await expenseModel.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(user._id),
              type: "expense",
            },
          },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
            },
          },
          { $sort: { total: -1 } },
        ]);

        const totalExpense = expenses.reduce(
          (sum, item) => sum + item.total,
          0,
        );
        const topCategory = expenses[0]?._id || "No data";

        const mailBody = `
📊 Monthly Expense Analysis

Total Expense: ₹${totalExpense}
Top Spending Category: ${topCategory}

Keep tracking and save smarter 💸
        `;

        await sendEmailWithAttachment(user.email, mailBody);
      }

      console.log("📩 Monthly analysis emails sent");
    } catch (err) {
      console.log("Monthly analysis error:", err.message);
    }
  });
};

export const recurringTransactionScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recurringExpenses = await expenseModel.find({
        isRecurring: true,
        nextRecurringDate: { $lte: today },
      });

      for (const expense of recurringExpenses) {
        const newExpense = await expenseModel.create({
          userId: expense.userId,
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: today,
          type: expense.type,
          paymentMethod: expense.paymentMethod,
          note: expense.note,
          isRecurring: true,
          recurringType: expense.recurringType,
        });

        let nextDate = new Date(today);

        if (expense.recurringType === "daily") {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (expense.recurringType === "weekly") {
          nextDate.setDate(nextDate.getDate() + 7);
        } else if (expense.recurringType === "monthly") {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }

        expense.nextRecurringDate = nextDate;
        await expense.save();

        console.log(`Recurring expense created: ${newExpense.title}`);
      }
    } catch (err) {
      console.log("Recurring scheduler error:", err.message);
    }
  });
};