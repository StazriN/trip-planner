import firebase from "firebase/app";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import { areasReducer, navigationReducer, selectedTripReducer, weatherReducer } from "./reducers";
import thunk from "redux-thunk";

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  areas: areasReducer,
  selectedTrip: selectedTripReducer,
  weather: weatherReducer,
  navigation: navigationReducer,
});

// Create store with reducers and initial state
const initialState = {};
export const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

// react-redux-firebase config
const rrFirebaseConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

export const rrfProps = {
  firebase,
  config: rrFirebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

export type RootState = ReturnType<typeof rootReducer>;
