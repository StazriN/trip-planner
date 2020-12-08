import React, {FC} from "react";
import {Provider} from "react-redux";
import {rrfProps, store} from "./redux";
import {ReactReduxFirebaseProvider} from "react-redux-firebase";
import RouterWrapper from "./components/RouterWrapper";

const App: FC = () => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <RouterWrapper/>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default App;
