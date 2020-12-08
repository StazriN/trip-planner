import React, {FC} from "react";
import "./RouterWrapper.css";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {CircularProgress, Container} from "@material-ui/core";
import {useSelector} from "react-redux";
import {isLoaded} from "react-redux-firebase";
import {HeaderMenu} from "./HeaderMenu";
import {RootState} from "../redux";
import Home from "../pages/Home";
import Trips from "../pages/Trips";
import Login from "../pages/Login";
import Notfound from "../pages/NotFound";
import Map from "../pages/Map";

const RouterWrapper: FC = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  return (
        <Router>
          <HeaderMenu />

          <main className="Main">
            <Container>
              {/* Wait for user session */}
              {!isLoaded(auth) ? (
                <CircularProgress/>
              ) : (
                <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route path="/map" exact component={Map}/>
                  <Route path="/trips" exact component={Trips}/>
                  <Route path="/login" exact component={Login}/>
                  <Route component={Notfound}/>
                </Switch>
              )}
            </Container>
          </main>
        </Router>
  );
};

export default RouterWrapper;
