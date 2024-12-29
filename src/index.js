import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import skillRoutes from '../routes/skillRoutes.js'
import '../db/index.js'

const app = express();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files
app.use(express.static(path.resolve(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/skills', skillRoutes)

app.get('/', (req, res) => {
  res.send("hello");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});