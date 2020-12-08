import firebase from 'firebase/app'
import { createStore, combineReducers, compose } from 'redux'
import {firebaseReducer} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
})

// Create store with reducers and initial state
const initialState = {}
export const store = createStore(rootReducer, initialState)

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
