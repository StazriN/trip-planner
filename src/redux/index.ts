import firebase from 'firebase/app'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import {FirebaseReducer, firebaseReducer, FirestoreReducer} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import {areasReducer} from "./reducers";
import {IAreasState} from "./types";
import thunk from "redux-thunk";

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  areas: areasReducer
})

// Create store with reducers and initial state
const initialState = {}
export const store = createStore(rootReducer, initialState, applyMiddleware(thunk))

// react-redux-firebase config
const rrFirebaseConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

export const rrfProps = {
  firebase,
  config: rrFirebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
}

export type RootState = ReturnType<typeof rootReducer>
