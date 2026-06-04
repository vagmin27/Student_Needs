import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { error } from "../../utils/Expenses/handler.js";
import expenseModel from "../../models/Expenses/expenseModel.js";
import billModel from "../../models/Expenses/billModel.js";
import expenseSettingsModel from "../../models/Expenses/expenseSettingsModel.js";
import userModel from "../../models/Expenses/userModel.js";

export const downloadPDFReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);

    // Current month dates range
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const [expenses, bills, settings] = await Promise.all([
      expenseModel.find({ userId, date: { $gte: startOfMonth, $lt: endOfMonth } }).sort({ date: -1 }),
      billModel.find({ userId }),
      expenseSettingsModel.findOne({ userId }) || { monthlyBudget: 0, savingsGoal: 0, currency: "INR" }
    ]);

    const currencySymbol = settings.currency === "INR" ? "Rs." : settings.currency === "USD" ? "$" : settings.currency === "EUR" ? "E" : "GBP";

    // Setup document
    const doc = new jsPDF();

    // 1. Header
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // slate-800
    doc.text("Monthly Financial Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Student: ${user?.username || "N/A"} (${user?.email || ""})`, 14, 26);
    
    // Horizontal divider
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 30, 196, 30);

    // 2. Budget and Savings Summary table
    let totalSpent = 0;
    let totalIncome = 0;
    expenses.forEach((e) => {
      if (e.type === "income") totalIncome += e.amount;
      else totalSpent += e.amount;
    });

    const remainingBudget = settings.monthlyBudget - totalSpent;
    const currentSavings = totalIncome - totalSpent;

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("1. Budget & Savings Overview", 14, 40);

    autoTable(doc, {
      startY: 44,
      head: [["Budget Type", "Target Goal", "Current Monthly Value", "Status / Remaining"]],
      body: [
        [
          "Monthly Budget Limit", 
          `${currencySymbol} ${settings.monthlyBudget.toLocaleString()}`, 
          `${currencySymbol} ${totalSpent.toLocaleString()} Spent`, 
          `${currencySymbol} ${remainingBudget >= 0 ? remainingBudget.toLocaleString() + ' Left' : Math.abs(remainingBudget).toLocaleString() + ' Overspent'}`
        ],
        [
          "Monthly Savings Goal", 
          `${currencySymbol} ${settings.savingsGoal.toLocaleString()}`, 
          `${currencySymbol} ${currentSavings.toLocaleString()} Saved`, 
          currentSavings >= settings.savingsGoal ? "Goal Achieved!" : `${currencySymbol} ${(settings.savingsGoal - currentSavings).toLocaleString()} Needed`
        ]
      ],
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });

    // 3. Category Breakdown table
    let nextY = doc.lastAutoTable.finalY + 12;
    doc.text("2. Spending by Category", 14, nextY);

    const categories = {};
    expenses.filter(e => e.type === "expense").forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    
    const catRows = Object.entries(categories).map(([cat, amt]) => {
      const pct = totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(1) + "%" : "0%";
      const limitVal = settings.categoryLimits && settings.categoryLimits.get ? settings.categoryLimits.get(cat) : settings.categoryLimits?.[cat];
      const limitText = limitVal ? `${currencySymbol} ${limitVal.toLocaleString()}` : "No Limit";
      return [cat, `${currencySymbol} ${amt.toLocaleString()}`, pct, limitText];
    });

    autoTable(doc, {
      startY: nextY + 4,
      head: [["Category", "Amount Spent", "% of Total Spent", "Configured Limit"]],
      body: catRows.length > 0 ? catRows : [["No categories recorded", "-", "-", "-"]],
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] }, // indigo-500
    });

    // 4. Bills Overview table
    nextY = doc.lastAutoTable.finalY + 12;
    // Page break if near bottom
    if (nextY > 240) {
      doc.addPage();
      nextY = 20;
    }
    doc.text("3. Bills Tracker Status", 14, nextY);

    const billRows = bills.map(b => {
      const dueDateStr = new Date(b.dueDate).toLocaleDateString();
      const paidDateStr = b.paidDate ? new Date(b.paidDate).toLocaleDateString() : "N/A";
      return [b.billName, `${currencySymbol} ${b.amount.toLocaleString()}`, dueDateStr, b.priority, b.status, paidDateStr];
    });

    autoTable(doc, {
      startY: nextY + 4,
      head: [["Bill Name", "Amount", "Due Date", "Priority", "Status", "Paid Date"]],
      body: billRows.length > 0 ? billRows : [["No bills recorded", "-", "-", "-", "-", "-"]],
      theme: "striped",
      headStyles: { fillColor: [124, 58, 237] }, // violet-600
    });

    // 5. Transaction History table
    nextY = doc.lastAutoTable.finalY + 12;
    if (nextY > 240) {
      doc.addPage();
      nextY = 20;
    }
    doc.text("4. Transaction History (Current Month)", 14, nextY);

    const txRows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.title,
      e.category,
      `${currencySymbol} ${e.amount.toLocaleString()}`,
      e.type.toUpperCase()
    ]);

    autoTable(doc, {
      startY: nextY + 4,
      head: [["Date", "Description", "Category", "Amount", "Type"]],
      body: txRows.length > 0 ? txRows : [["No transactions recorded for this month", "-", "-", "-", "-"]],
      theme: "striped",
      headStyles: { fillColor: [147, 51, 234] }, // purple-600
    });

    // Generate output
    const pdfArrayBuffer = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="monthly_expense_report.pdf"');
    res.send(pdfBuffer);

  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const downloadCSVReport = async (req, res) => {
  try {
    const userId = req.user.userId;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const [expenses, bills] = await Promise.all([
      expenseModel.find({ userId, date: { $gte: startOfMonth, $lt: endOfMonth } }).sort({ date: -1 }),
      billModel.find({ userId }).sort({ dueDate: 1 })
    ]);

    // Build multi-table CSV content
    let csvContent = "\ufeff"; // BOM for Excel encoding support

    // 1. Transactions Table
    csvContent += "TRANSACTION HISTORY (CURRENT MONTH)\n";
    csvContent += "Date,Title,Category,Amount,Type\n";
    expenses.forEach((e) => {
      const cleanTitle = e.title ? e.title.replace(/"/g, '""') : "";
      csvContent += `${new Date(e.date).toLocaleDateString()},"${cleanTitle}",${e.category},${e.amount},${e.type}\n`;
    });

    // 2. Bills Table
    csvContent += "\nBILLS TRACKER HISTORY\n";
    csvContent += "Bill Name,Amount,Due Date,Priority,Status,Paid Date\n";
    bills.forEach((b) => {
      const cleanName = b.billName ? b.billName.replace(/"/g, '""') : "";
      const dueStr = new Date(b.dueDate).toLocaleDateString();
      const paidStr = b.paidDate ? new Date(b.paidDate).toLocaleDateString() : "N/A";
      csvContent += `"${cleanName}",${b.amount},${dueStr},${b.priority},${b.status},${paidStr}\n`;
    });

    // 3. Category Summary
    csvContent += "\nCATEGORY TOTALS (EXPENSES ONLY)\n";
    csvContent += "Category,Total Spent\n";
    const categories = {};
    expenses.filter(e => e.type === "expense").forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    Object.entries(categories).forEach(([cat, amt]) => {
      csvContent += `${cat},${amt}\n`;
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="monthly_expense_report.csv"');
    res.send(csvContent);

  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};
