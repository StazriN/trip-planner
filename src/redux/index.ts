import firebase from "firebase/app";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import { areasReducer, navigationReducer, weatherReducer } from "./reducers";
import thunk from "redux-thunk";
import localforage from "localforage"; // Improves the offline experience (default storage can't handle large JSONs with geo data...)
import { persistStore, persistReducer } from "redux-persist";

// Root reducer
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  areas: areasReducer,
  weather: weatherReducer,
  navigation: navigationReducer,
});

// Areas should be persisted to reduce OpenApi calls
const persistConfig = {
  key: "areas",
  storage: localforage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// react-redux-firebase config
const rrFirebaseConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

// Create store with reducers and initial state + persistor
const initialState = {};
export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore(persistedReducer, initialState, applyMiddleware(thunk));
export const persistor = persistStore(store);

// react-redux-firebase props for RRF provider
export const rrfProps = {
  firebase,
  config: rrFirebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};
