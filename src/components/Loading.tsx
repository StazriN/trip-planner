import React, {FC} from 'react';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  spinner: {
    backgroundColor: '#003366',
    height: '100%',
    width: '6px',
    margin: '1px',
    borderRadius: '20%',
    display: 'inline-block',
  },
  rect1: {
    webkitAnimationDelay: '-1.2s',
    animationDelay: '-1.2s'
  },
  rect2: {
    webkitAnimationDelay: '-1.1s',
    animationDelay: '-1.1s'
  },
  rect3: {
    webkitAnimationDelay: '-1.0s',
    animationDelay: '-1.0s'
  },
  rect4: {
    webkitAnimationDelay: '-0.9s',
    animationDelay: '-0.9s'
  },
  rect5: {
    webkitAnimationDelay: '-0.8s',
    animationDelay: '-0.8s'
  },
  spinnerText: {
    textAlign: 'center',
    color: '#003366',
    fontWeight: 600,
    fontSize: '16px'
  }
}));

interface ILoaderProps {
  text: string
}

const Loader: FC = ({children}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.spinner}>
        <div className={classes.rect1}></div>
        <div className={classes.rect2}></div>
        <div className={classes.rect3}></div>
        <div className={classes.rect4}></div>
        <div className={classes.rect5}></div>
      </div>
      <div className={classes.spinnerText}>{children}</div>
    </>
  );
};

export default Loader;
