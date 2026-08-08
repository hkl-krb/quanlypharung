import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
} from "firebase/firestore";

// Cấu hình Firebase cho dự án quanlypharung (Hạt Kiểm Lâm Krông Bông)
const firebaseConfig = {
  apiKey: "AIzaSyCdHbg2h64ioTqpU3p5ibg9i5CLzNLDB4g",
  authDomain: "quanlypharung.firebaseapp.com",
  projectId: "quanlypharung",
  storageBucket: "quanlypharung.firebasestorage.app",
  messagingSenderId: "469280596944",
  appId: "1:469280596944:web:c87f758c98e3ba42704fd5",
  measurementId: "G-YQEY3K3J65"
};

// Khởi tạo Firebase App & Cloud Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch 
};
