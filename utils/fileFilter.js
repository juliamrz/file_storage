import path from 'path';

// Filter to check file type
export const fileFilter = (req, file, cb) => {
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.txt') {
    cb(null, true);
  } else {
    cb(new Error('Only .txt files are allowed!'), false);
  }
};
