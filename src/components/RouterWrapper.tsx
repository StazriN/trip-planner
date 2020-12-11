import React, { FC } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import { HeaderMenu } from "./HeaderMenu";
import { RootState } from "../redux";
import Home from "../pages/Home";
import Trips from "../pages/Trips";
import Login from "../pages/Login";
import Notfound from "../pages/NotFound";
import Map from "../pages/Map";
import PlanTrip from "../pages/PlanTrip";
import TripDetail from "../pages/TripDetail";

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: "center",
    backgroundColor: "#2a0f3e30",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    flexGrow: 1,
  },
}));

const RouterWrapper: FC = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const classes = useStyles();

  return (
    <Router>
      <HeaderMenu />

      <main className={classes.main}>
        {/* Wait for user session */}
        {!isLoaded(auth) ? (
          <CircularProgress />
        ) : (
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/map" exact component={Map} />
            <Route path="/trips" exact component={Trips} />
            <Route path="/login" exact component={Login} />
            <Route path="/plan-trip" exact component={PlanTrip} />
            <Route path="/trip-detail" exact component={TripDetail} />
            <Route component={Notfound} />
          </Switch>
        )}
      </main>
    </Router>
  );
};

export default RouterWrapper;
