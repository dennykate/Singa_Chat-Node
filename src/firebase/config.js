import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXwr1jwX10oV8kdFRPxPgkeExy3dMOT3c",
  authDomain: "next-blog-3024e.firebaseapp.com",
  projectId: "next-blog-3024e",
  storageBucket: "next-blog-3024e.appspot.com",
  messagingSenderId: "97537841531",
  appId: "1:97537841531:web:c16dcd5533ae9664d705de",
  measurementId: "G-CPV0BZGEJV",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
