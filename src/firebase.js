// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByhYtnetv98utwRx0VXdlAVWoTxHixZLQ",
  authDomain: "weather-wizard-74435.firebaseapp.com",
  projectId: "weather-wizard-74435",
  storageBucket: "weather-wizard-74435.appspot.com",
  messagingSenderId: "668983827457",
  appId: "1:668983827457:web:122f919a66f5ffb96ff400",
  measurementId: "G-YL79RHLK3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);