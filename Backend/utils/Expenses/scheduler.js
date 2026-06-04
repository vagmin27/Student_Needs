import cron from "node-cron";
import mongoose from "mongoose";

import userModel from "../../models/Expenses/userModel.js";
import expenseModel from "../../models/Expenses/expenseModel.js";
import Notification from "../../models/Expenses/notificationModel.js";
import sendEmailWithAttachment from "./emailSend.js";

// ⏰ Smart reminder scheduler
export const smartReminderScheduler = () => {
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_SCHEDULERS !== "true") {
    return;
  }
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
    } catch (err) {
      console.log("Reminder scheduler error:", err.message);
    }
  });
};

// 📅 Monthly analysis email scheduler
export const monthlyAnalysisScheduler = () => {
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_SCHEDULERS !== "true") {
    return;
  }
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
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_SCHEDULERS !== "true") {
    return;
  }
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

export const dailyBillReminderScheduler = () => {
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_SCHEDULERS !== "true") {
    return;
  }
  
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("⏰ Running Daily Bill Reminder Scheduler at midnight...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Import models dynamically to prevent circular dependencies
      const { default: billModel } = await import("../../models/Expenses/billModel.js");
      const { default: userModel } = await import("../../models/Expenses/userModel.js");
      const { notificationService } = await import("../../services/NotificationService.js");
      const { default: nodemailer } = await import("nodemailer");

      const bills = await billModel.find({ status: { $ne: "Paid" } });

      for (const bill of bills) {
        const user = await userModel.findById(bill.userId);
        if (!user) continue;

        const due = new Date(bill.dueDate);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // 2 days before
        if (diffDays === 2 && !bill.sent2DayReminder) {
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Upcoming Bill Due Reminder",
            text: `Hello,

This is a reminder that your bill is due in 2 days.

Bill: ${bill.billName}
Amount: ₹${bill.amount}
Due Date: ${due.toLocaleDateString()}

Please complete the payment before the due date.

Expense Tracker Team`,
          };

          try {
            await transporter.sendMail(mailOptions);
            bill.sent2DayReminder = true;
            await bill.save();
            
            await notificationService.createAndEmitNotification({
              recipientId: bill.userId,
              type: "EXPENSE",
              title: "Bill Due Reminder",
              message: `🔔 ${bill.billName} due in 2 days.`,
              link: "/expenses-tracker",
            });
          } catch (e) {
            console.error("Error sending 2-day reminder:", e.message);
          }
        }
        // 1 day before
        else if (diffDays === 1 && !bill.sent1DayReminder) {
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Upcoming Bill Due Reminder",
            text: `Hello,

This is a reminder that your bill is due tomorrow.

Bill: ${bill.billName}
Amount: ₹${bill.amount}
Due Date: ${due.toLocaleDateString()}

Please complete the payment before the due date.

Expense Tracker Team`,
          };

          try {
            await transporter.sendMail(mailOptions);
            bill.sent1DayReminder = true;
            await bill.save();

            await notificationService.createAndEmitNotification({
              recipientId: bill.userId,
              type: "EXPENSE",
              title: "Bill Due Reminder",
              message: `🔔 ${bill.billName} due tomorrow.`,
              link: "/expenses-tracker",
            });
          } catch (e) {
            console.error("Error sending 1-day reminder:", e.message);
          }
        }
        // due date morning
        else if (diffDays === 0 && !bill.sentDueDayReminder) {
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Upcoming Bill Due Reminder",
            text: `Hello,

This is a reminder that your bill is due today.

Bill: ${bill.billName}
Amount: ₹${bill.amount}
Due Date: ${due.toLocaleDateString()}

Please complete the payment today.

Expense Tracker Team`,
          };

          try {
            await transporter.sendMail(mailOptions);
            bill.sentDueDayReminder = true;
            bill.status = "Due Today";
            await bill.save();

            await notificationService.createAndEmitNotification({
              recipientId: bill.userId,
              type: "EXPENSE",
              title: "Bill Due Today",
              message: `🔔 ${bill.billName} due today.`,
              link: "/expenses-tracker",
            });
          } catch (e) {
            console.error("Error sending due date reminder:", e.message);
          }
        }
        // Overdue status check
        else if (diffDays < 0 && bill.status !== "Overdue") {
          bill.status = "Overdue";
          await bill.save();

          await notificationService.createAndEmitNotification({
            recipientId: bill.userId,
            type: "EXPENSE",
            title: "Bill Overdue",
            message: `🚨 ${bill.billName} is overdue.`,
            link: "/expenses-tracker",
          });
        }
        // Due today status check
        else if (diffDays === 0 && bill.status !== "Due Today") {
          bill.status = "Due Today";
          await bill.save();
        }
      }
    } catch (err) {
      console.log("Daily bill reminder scheduler error:", err.message);
    }
  });
};