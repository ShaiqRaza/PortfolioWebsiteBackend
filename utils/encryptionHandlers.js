import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto'
const secretKey = process.env.CRYPTO_SECRET; // Store this securely

export const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
