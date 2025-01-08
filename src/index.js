import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import '../db/index.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, 'public')));

// general Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
import skillRoutes from '../routes/skillRoutes.js';
import aboutRoutes from '../routes/aboutRoutes.js';
import authRoutes from '../routes/authRoutes.js'
import adminRoutes from '../routes/adminRoutes.js'

app.use('/skills', skillRoutes);
app.use('/about', aboutRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send("hello");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});