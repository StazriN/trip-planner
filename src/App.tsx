import React, { FC } from "react";
import { Provider } from "react-redux";
import { rrfProps, store } from "./redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import RouterWrapper from "./components/RouterWrapper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const ourTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#f99537",
      light: "#ffc667",
      dark: "#c16600",
      contrastText: "#000000",
    },
    secondary: {
      main: "#3a173a",
      light: "#653f64",
      dark: "#180015",
      contrastText: "#ffffff",
    },
    // error: { main: "#f57f17" },
    background: { default: "#ffead1", paper: "#ffead1" }, //ffd5a3
  },
});

const App: FC = () => {
  return (
    <ThemeProvider theme={ourTheme}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <RouterWrapper />
        </ReactReduxFirebaseProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
