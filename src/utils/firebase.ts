import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Trip, User } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyCD_r5I3BcheqHEeuCeZvzHrqD68R2vvSw",
  authDomain: "trip-planner-831cc.firebaseapp.com",
  projectId: "trip-planner-831cc",
  storageBucket: "trip-planner-831cc.appspot.com",
  messagingSenderId: "519013816293",
  appId: "1:519013816293:web:46ff9be87160559fe5010c",
};
firebase.initializeApp(firebaseConfig);

// Hook providing logged in user information
export const useLoggedInUser = () => {
  // Hold user info in state
  const [user, setUser] = useState<firebase.User | null>();

  const isMounted = useRef(false);
  // Setup onAuthStateChanged once when component is mounted
  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => setUser(u));

    // Cleanup of the hook
    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  return user;
};

// Sign up handler
export const signUp = (email: string, password: string) => firebase.auth().createUserWithEmailAndPassword(email, password);

// Sign in handler
export const signIn = (email: string, password: string) => firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out handler
export const signOut = () => firebase.auth().signOut();

/********************************************* Firestore database ************************************************/
const db = firebase.firestore();
export const usersCollection = db.collection("users") as firebase.firestore.CollectionReference<User>;
