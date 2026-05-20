import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/**
 * 🔧 Fix __dirname (ES modules)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 📁 Correct path → Backend/uploads
 */
const uploadPath = path.join(__dirname, "../uploads");

/**
 * ✅ Ensure folder exists
 */
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/**
 * 📦 Storage config
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const safeDate = new Date().toISOString().replace(/:/g, "-");
    const ext = path.extname(file.originalname);
    cb(null, safeDate + ext);
  },
});

/**
 * 🛡️ File filter
 */
const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG/PNG allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;