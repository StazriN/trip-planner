import React, {FC} from 'react';
import logo from './logo.svg';
import './App.css';
import {Link, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {signOut, useLoggedInUser} from "./utils/firebase";
import Button from '@material-ui/core/Button';
import {AppBar, CircularProgress, Container, makeStyles, Toolbar} from "@material-ui/core";
import Home from "./pages/Home";
import Notfound from "./pages/NotFound";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import Map from "./pages/Map";

const useStyles = makeStyles(theme => ({
  menuButton: {marginRight: theme.spacing(2), color: 'white'},
  link: {textDecoration: 'none'},
}));

const App: FC = () => {
  // Styles
  const classes = useStyles();

  // Login state
  const user = useLoggedInUser();

  return (
    <Router>
      <AppBar position='static'>
        <Toolbar>
          <Link className={classes.link} to='/'>
            <Button className={classes.menuButton}>Home</Button>
          </Link>
          <Link className={classes.link} to='/map'>
            <Button className={classes.menuButton}>Map</Button>
          </Link>
          {user === null && (
            <Link className={classes.link} to='/login'>
              <Button className={classes.menuButton}>Login</Button>
            </Link>
          )}
          {user && (
            <>
              <Link className={classes.link} to='/trips'>
                <Button className={classes.menuButton}>Trips</Button>
              </Link>
              <Button className={classes.menuButton} onClick={signOut}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <main className='App'>
        <Container>
          {/* Wait for user session */}
          {user === undefined ? (
            <CircularProgress/>
          ) : (
            <Switch>
              <Route path='/' exact component={Home}/>
              <Route path='/map' exact component={Map}/>
              <Route path='/login' exact component={Login}/>
              <Route path='/trips' exact component={Trips}/>
              <Route component={Notfound}/>
            </Switch>
          )}
        </Container>
      </main>
    </Router>
  );
}

export default App;
