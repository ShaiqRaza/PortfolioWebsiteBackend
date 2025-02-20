import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import '../db/index.js';
import cors from 'cors';

const app = express();

// general Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));  
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
import skillRoutes from '../routes/skillRoutes.js';
import aboutRoutes from '../routes/aboutRoutes.js';
import authRoutes from '../routes/authRoutes.js'
import adminRoutes from '../routes/adminRoutes.js'
import projectRoutes from '../routes/projectRoutes.js'
import docRoutes from '../routes/docRoutes.js'
import contactRoutes from '../routes/contactRoutes.js'
import socialsRoutes from '../routes/socialsRoutes.js'

app.use('/skill', skillRoutes);
app.use('/about', aboutRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/project', projectRoutes);
app.use('/doc', docRoutes);
app.use('/contact', contactRoutes);
app.use('/socials', socialsRoutes);

app.get('/', (req, res) => {
  res.send("Portfolio Website Backend made with Node.js and Express.js.");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});