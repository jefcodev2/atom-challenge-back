import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
dotenv.config();

export const envConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'develop',
};

// Firebase config
export const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,

};

export const firebaseApp = initializeApp(firebaseConfig);
