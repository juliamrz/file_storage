import {Router} from "express";
const router = Router();

import multer from "multer";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";
import archiver from "archiver";
import {fileFilter} from "../utils/fileFilter.js";
import File from "../models/File.js";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Multer setup with limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 // 100KB in bytes
  },
  fileFilter: fileFilter
});


// File upload route
router.post('/', upload.single('file'), async (req, res) => {
  console.log('************* File info *************')
  console.log(req.file);
  if (!req.file) {
    return res.render('index', {
      title: 'File Upload',
      message: null,
      error: 'File was not uploaded'
    });
  }

  // Шлях до оригінального файлу
  const originalFilePath = path.join('storage', req.file.filename);

  // Формуємо ім'я ZIP
  const { name } = path.parse(req.file.filename);
  const zipFilename = name + '.zip';
  const zipFilePath = path.join('storage', zipFilename);

  // Створюємо ZIP
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  archive.file(originalFilePath, { name: req.file.originalname });

  await archive.finalize();

  try {
    await unlink(originalFilePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }

  const file = new File({
    filename: zipFilename,
    originalName: req.file.originalname,
    size: req.file.size,
    uploadedAt: new Date(),
    extension: path.extname(req.file.originalname).toLowerCase(),
  });

  await file.save();

  res.render('index', {
    title: 'File Upload',
    message: `File "${req.file.originalname}" successfully uploaded!`,
    error: null,
    fileInfo: {
      name: req.file.originalname,
      size: (req.file.size / 1024).toFixed(2) + ' KB',
      path: req.file.path
    }
  });
});

export default router;
