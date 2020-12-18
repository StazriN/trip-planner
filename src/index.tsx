import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCD_r5I3BcheqHEeuCeZvzHrqD68R2vvSw",
  authDomain: "trip-planner-831cc.firebaseapp.com",
  projectId: "trip-planner-831cc",
  storageBucket: "trip-planner-831cc.appspot.com",
  messagingSenderId: "519013816293",
  appId: "1:519013816293:web:46ff9be87160559fe5010c",
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

const storage = firebase.storage();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export  {
  storage, firebase as default
}
