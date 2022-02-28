import { getStorage } from "firebase/storage"
import { initializeApp } from "firebase/app"
const firebaseConfig = {
    apiKey: "AIzaSyBCLatOWZ6NigCxk3x2xJ67pvZrTo1vU7I",
    authDomain: "blog-b75de.firebaseapp.com",
    projectId: "blog-b75de",
    storageBucket: "blog-b75de.appspot.com",
    messagingSenderId: "127846910236",
    appId: "1:127846910236:web:dea486c7779d9986ec92d9",
    measurementId: "G-ED1SER9YXJ"
  };

const app = initializeApp(firebaseConfig)
const storage = getStorage()

export default storage