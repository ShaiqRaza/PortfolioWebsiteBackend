import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';

// Add this logging at the start of your multer configuration
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

console.log('Upload directory absolute path:', uploadDir);
try {
    const stats = fs.statSync(uploadDir);
    console.log('Directory exists:', true);
    console.log('Directory permissions:', stats.mode);
    console.log('Can write:', fs.accessSync(uploadDir, fs.constants.W_OK) === undefined);
} catch (err) {
    console.log('Directory error:', err);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })

const upload = multer({ storage });

export default upload;