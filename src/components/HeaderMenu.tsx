import { AppBar, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import { signOut } from "../utils/firebase";
import PersonIcon from "@material-ui/icons/Person";
import React, { useState } from "react";
import { IWindowSize, useWindowSize } from "../hooks/useWindowSize";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  login: {
    background: "transparent",
    "&:hover": {
      background: "transparent",
      color: "white",
    },
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
  },
  link: { textDecoration: "none" },
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

export interface IHeaderMenu {
  user: firebase.User | null | undefined;
}

export const HeaderMenu: React.FC<IHeaderMenu> = (props) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const windowSize = useWindowSize();
  const drawerSize = {
    width: windowSize.width != undefined && windowSize.width > 500 ? 300 : windowSize.width,
    //height: windowSize.height != undefined && windowSize.height > 500 ? 300 : windowSize.height,
  };
  const classes = useStyles(drawerSize);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link className={classes.link} to={props.user ? "/" : "/login"}>
            <Button className={classes.login} startIcon={<PersonIcon />} onClick={() => props.user && signOut()}>
              {props.user ? "Logout" : "Login"}
            </Button>
          </Link>
          <Typography variant="h6" className={classes.title}>
            Trip planner
          </Typography>
          <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        {/* TODO napisat lepsie */}
        <List>
          <Link className={classes.link} to="/">
            <ListItem button key={1}>
              <ListItemText primary={"Home"} />
            </ListItem>
          </Link>
          <Link className={classes.link} to="/map">
            <ListItem button key={2}>
              <ListItemText primary={"Map"} />
            </ListItem>
          </Link>
          {props.user && (
            <Link className={classes.link} to="/trips">
              <ListItem button key={3}>
                <ListItemText primary={"Trips"} />
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
    </>
  );
};
