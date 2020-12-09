import { makeStyles, Typography } from "@material-ui/core";
import React, { FC } from "react";
import bImg from "../assets/jpg/331643-Firewatch-sunset-forest-mountain.jpg";

const useStyles = makeStyles((theme) => ({
  backDiv: {
    background: `url(${bImg}) center cover`,
    // width: "100vw",
    // height: "100vh",
    top: 0,
    position: "absolute",
    zIndex: -1,
  },
  title: {
    position: "absolute",
    top: "100px",
    // left: "100px",
    fontFamily: "Lucida Handwriting, Cursive",
    fontSize: "50px",
    color: theme.palette.secondary.main,
  },
}));

const Home: FC = () => {
  const classes = useStyles();

  //TODO ak background = cover tak tu img div nemusi byt

  return (
    <>
      <Typography className={classes.title}>Trip Planner</Typography>
      <div className={classes.backDiv}></div>
    </>
  );
};

export default Home;
