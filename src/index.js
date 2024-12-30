import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import '../db/index.js'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, 'public')));

// general Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
import skillRoutes from '../routes/skillRoutes.js'

app.use('/skills', skillRoutes)

app.get('/', (req, res) => {
  res.send("hello");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});