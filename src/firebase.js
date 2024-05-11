import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyA5bJ-WdYt5rGd1uxovLQJFzh6YnkThf5g",
  authDomain: "simran-chatapp.firebaseapp.com",
  projectId: "simran-chatapp",
  storageBucket: "simran-chatapp.appspot.com",
  messagingSenderId: "379245034807",
  appId: "1:379245034807:web:43443dac3da0a0ddc1eeb2",
  measurementId: "G-49GBCG26YQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);