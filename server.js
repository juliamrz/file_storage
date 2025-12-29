import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './db/mongoose.js';

import mainRouter from './routes/mainRouter.js';
import uploadRouter from "./routes/uploadRouter.js";
import filesRouter from "./routes/filesRouter.js";
import downloadRouter from "./routes/downloadRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4300;

// Pug configuration
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware for static files
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Main page route
app.use('/', mainRouter);
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);
app.use('/download', downloadRouter);

// Multer error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.render('index', {
                title: 'File Upload',
                message: null,
                error: 'File size exceeds 100KB!'
            });
        }
        return res.render('index', {
            title: 'File Upload',
            message: null,
            error: 'Error uploading file: ' + err.message
        });
    } else if (err) {
        return res.render('index', {
            title: 'File Upload',
            message: null,
            error: err.message
        });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
