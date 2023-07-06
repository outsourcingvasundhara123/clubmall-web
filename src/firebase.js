import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpVXFxJNgroKuqrxL-AJOsZEfbcu9yMoE",
  authDomain: "clubmall.firebaseapp.com",
  databaseURL: "https://clubmall-default-rtdb.firebaseio.com",
  projectId: "clubmall",
  storageBucket: "clubmall.appspot.com",
  messagingSenderId: "402818709804",
  appId: "1:402818709804:web:ead869f51cd13ff2219489",
  measurementId: "G-1Y011B3Z23"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;