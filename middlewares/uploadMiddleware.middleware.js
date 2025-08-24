import multer from "multer";

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimeType)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .png, .jpeg and .pdf formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
