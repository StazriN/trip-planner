import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { User } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyCD_r5I3BcheqHEeuCeZvzHrqD68R2vvSw",
  authDomain: "trip-planner-831cc.firebaseapp.com",
  projectId: "trip-planner-831cc",
  storageBucket: "trip-planner-831cc.appspot.com",
  messagingSenderId: "519013816293",
  appId: "1:519013816293:web:46ff9be87160559fe5010c",
};
firebase.initializeApp(firebaseConfig);

/********************************************* Firestore database ************************************************/
const db = firebase.firestore();
export const usersCollection = db.collection("users") as firebase.firestore.CollectionReference<User>;
