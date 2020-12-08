import React, { FC } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { useLoggedInUser } from "./utils/firebase";
import { CircularProgress, Container, makeStyles, Toolbar } from "@material-ui/core";
import Home from "./pages/Home";
import Notfound from "./pages/NotFound";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import Map from "./pages/Map";
import { HeaderMenu } from "./components/HeaderMenu";

const useStyles = makeStyles((theme) => ({
  menuButton: { marginRight: theme.spacing(2), color: "white" },
  link: { textDecoration: "none" },
}));

const App: FC = () => {
  // Styles
  const classes = useStyles();

  // Login state
  const user = useLoggedInUser();

  return (
    <Router>
      <HeaderMenu user={user} />

      <main className="App">
        <Container>
          {/* Wait for user session */}
          {user === undefined ? (
            <CircularProgress />
          ) : (
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/map" exact component={Map} />
              <Route path="/trips" exact component={Trips} />
              <Route path="/login" exact component={Login} />
              <Route component={Notfound} />
            </Switch>
          )}
        </Container>
      </main>
    </Router>
  );
};

export default App;
