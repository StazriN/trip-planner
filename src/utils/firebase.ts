import firebase from 'firebase/app';
import 'firebase/auth';
import {useEffect, useState} from "react";

const firebaseConfig = {
    apiKey: "AIzaSyCD_r5I3BcheqHEeuCeZvzHrqD68R2vvSw",
    authDomain: "trip-planner-831cc.firebaseapp.com",
    projectId: "trip-planner-831cc",
    storageBucket: "trip-planner-831cc.appspot.com",
    messagingSenderId: "519013816293",
    appId: "1:519013816293:web:46ff9be87160559fe5010c"
};
firebase.initializeApp(firebaseConfig);

// Simplified user type for referencing users
type User = Pick<firebase.User, 'uid' | 'email'>;

// Hook providing logged in user information
export const useLoggedInUser = () => {
    // Hold user info in state
    const [user, setUser] = useState<firebase.User | null>();

    // Setup onAuthStateChanged once when component is mounted
    useEffect(() => {
        firebase.auth().onAuthStateChanged(u => setUser(u));
    }, []);

    return user;
};

// Sign up handler
export const signUp = (email: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
    firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out handler
export const signOut = () => firebase.auth().signOut();