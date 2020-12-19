import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import React, { useEffect, useState } from "react";
import { IWindowSize, useWindowSize } from "../hooks/useWindowSize";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { connect, useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirebase } from "react-redux-firebase";
import { ExitToApp } from "@material-ui/icons";
import { store } from "../redux";
import { setRightPanelContext } from "../redux/actions";
import { AreaType, MenuItemsType, panelContextType } from "../utils/types";
import WeatherWidget from "./WeatherWidget";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "transparent",
    boxShadow: "none",
  },
  login: {
    background: "transparent",
    "&:hover": {
      //background: "transparent",
      //color: "white",
    },
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  link: { textDecoration: "none", color: theme.palette.secondary.dark },
  listIcon: { color: theme.palette.secondary.main, opacity: "0.80" },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawer: {
    width: (drawerSize: IWindowSize) => drawerSize.width,
  },
  drawerPaper: {
    width: (drawerSize: IWindowSize) => drawerSize.width,
  },
}));

const mapStateToProps = ({ navigation }: RootState) => {
  return { navigation };
};

type HeaderMenuProps = ReturnType<typeof mapStateToProps> & {};

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  const [loginButton, setLoginButton] = useState<string | null>();

  const windowSize = useWindowSize();
  const drawerSize = {
    width: windowSize.width !== undefined && windowSize.width > 500 ? 300 : windowSize.width,
    //height: windowSize.height != undefined && windowSize.height > 500 ? 300 : windowSize.height,
  };
  const classes = useStyles(drawerSize);

  const handleDrawerToggle = () => {
    var [context, open]: [panelContextType, boolean] = ["menu", true];
    if (props.navigation.panelOpened) [context, open] = [props.navigation.panelContext, false];
    store.dispatch(setRightPanelContext(context, open));
  };

  const { uid, displayName, email } = useSelector((state: RootState) => state.firebase.auth);
  const nameToDisplay = displayName ?? email;

  useEffect(() => {
    if (nameToDisplay !== undefined) setLoginButton(nameToDisplay);
  }, [uid, displayName, nameToDisplay, email]);

  const firebase = useFirebase();
  // Sign out handler
  const signOut = () => firebase.auth().signOut();

  //
  const menuList: MenuItemsType = {
    birdAreas: "Bird Areas",
    largeProtectedAreas: "Large Protected Areas",
    smallAreas: "Small Areas",
    euAreas: "Eu Areas",
    geoparks: "Geoparks",
    bioAreas: "Bio Areas",
  };

  return (
    <>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          {uid && (
            <IconButton onMouseEnter={() => setLoginButton("Logout")} onMouseLeave={() => setLoginButton(nameToDisplay)} color="secondary" onClick={() => signOut()}>
              <ExitToApp />
            </IconButton>
          )}
          <Link className={classes.link} onClick={(event) => uid && event.preventDefault()} to="/login">
            <Button className={classes.login} color="secondary" startIcon={<PersonIcon />} onClick={() => {}}>
              {uid ? loginButton : "Login"}
            </Button>
          </Link>
          <div className={classes.title}></div>
          <IconButton color="secondary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={props.navigation.panelOpened}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon className={classes.listIcon} />
          </IconButton>
        </div>
        <Divider />
        {props.navigation.panelContext === "menu" ? (
          <List>
            <Link className={classes.link} to="/">
              <ListItem button key={1}>
                <ListItemIcon>
                  <HomeIcon className={classes.listIcon} />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Link>
            {uid && (
              <>
                <Link className={classes.link} to="/trips">
                  <ListItem button key={2}>
                    <ListItemIcon>
                      <LocationOnIcon className={classes.listIcon} />
                    </ListItemIcon>
                    <ListItemText primary={"My trips"} />
                  </ListItem>
                </Link>
                <Divider />
              </>
            )}
            {Object.keys(menuList).map((key, index) => (
              <Link className={classes.link} to={`/map/${key}`}>
                <ListItem button key={index + 3}>
                  <ListItemIcon>
                    <ExploreIcon className={classes.listIcon} />
                  </ListItemIcon>
                  <ListItemText primary={menuList[key as AreaType]} />
                </ListItem>
              </Link>
            ))}
          </List>
        ) : (
          <WeatherWidget />
        )}
      </Drawer>
    </>
  );
};

export default connect(mapStateToProps, {})(HeaderMenu);
