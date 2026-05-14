import { jsPDF } from "jspdf";
import nodemailer from "nodemailer";
import autoTable from "jspdf-autotable";
import dataParserForItems from "./dataParser.js";

function generatePDF(data) {
  const doc = new jsPDF({
    orientation: "vertical",
  });

  doc.setFontSize(32);
  doc.text("Your Expenses In Last One Month !!", 100, 20, "center");
  doc.setLineWidth(2);
  doc.line(20, 25, 170, 25);

  doc.setFontSize(22);
  autoTable(doc, {
    body: data.body,
    theme: "grid",
    startY: 40,
    head: [["S.No", "Date", "Amount", "Category"]],
    foot: [["", "Total", data.total, ""]],
    styles: {
      textColor: [0, 0, 0],
      fontSize: 14,
    },
  });

  return doc.output("dataurlstring").split(",")[1];
}

async function sendEmailWithAttachment(recipient, items) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ldead4524@gmail.com",
      pass: "cppqyjfnxyhrxkzq",
    },
  });

  const body = dataParserForItems(items);
  const pdfContent = generatePDF(body);

  const mailOptions = {
    from: "ldead4524@gmail.com",
    to: recipient,
    subject: "Expense Report for This Month",
    text: "Please find your expense report attached.",
    attachments: [
      {
        filename: "expense_report.pdf",
        content: pdfContent,
        encoding: "base64",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmailWithAttachment;