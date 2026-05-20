import { Parser } from "json2csv";

export const generateCSV = (data) => {
  const fields = [
    "Name",
    "Register_number",
    "date",
    "attendance",
  ];

  const parser = new Parser({ fields });

  return parser.parse(data);
};