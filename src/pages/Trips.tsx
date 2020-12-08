import React, {FC, useEffect, useState} from 'react';
import {usersCollection} from "../utils/firebase";
import {Trip} from "../utils/types";
import InfoIcon from '@material-ui/icons/Info';

import {
  GridList,
  GridListTile,
  GridListTileBar, IconButton,
  ListSubheader,
  makeStyles
} from "@material-ui/core";
import TripPlaceholder from '../assets/jpg/TripPlaceholder.jpg';
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import {RootState} from "../redux";
import {isEmpty, isLoaded} from "react-redux-firebase";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}))

const Trips: FC = () => {
  const classes = useStyles();

  const [trips, setTrips] = useState<(Trip & { id: string })[]>([]);
  const [error, setError] = useState<string>();

  const auth = useSelector((state: RootState) => state.firebase.auth);

  useEffect(() => {
    if (!isLoaded(auth) || isEmpty(auth)) {
      return;
    }

    usersCollection
      .doc(auth.uid)
      .collection('trips')
      .get()
      .then(
        snapshot => {
          setTrips(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data() as Trip})));
        },
        err => setError(err.message),
      );
  }, [auth]);

  return (
    <div className={classes.root}>
      {!error && <GridList cellHeight={350} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{height: 'auto'}}>
              <ListSubheader component="div" style={{color: 'white'}}>My trips</ListSubheader>
          </GridListTile>
        {trips.map((trip) => (
          <GridListTile key={trip.id}>
            <img src={TripPlaceholder} alt={trip.name}/>
            <GridListTileBar
              title={trip.name}
              subtitle={<span>{trip.date?.toDate().toDateString()}</span>}
              actionIcon={
                <IconButton aria-label={`Open ${trip.name} details`} className={classes.icon}>
                  <InfoIcon/>
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>}
      {error && (
        <Typography variant='subtitle2' align='center' color='error' paragraph>
          <b>{error}</b>
        </Typography>
      )}
    </div>
  );
}

export default Trips;
