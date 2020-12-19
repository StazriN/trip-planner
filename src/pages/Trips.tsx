import React, { FC,  useEffect, useState } from 'react';
import { Trip } from "../utils/types";
import InfoIcon from '@material-ui/icons/Info';

import {
  GridList,
  GridListTile,
  GridListTileBar, IconButton,
  ListSubheader,
  makeStyles
} from "@material-ui/core";
import TripPlaceholder from '../assets/jpg/TripPlaceholder.jpg';
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { storage } from "../index";

const useStyles = makeStyles(({
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
}));

const Trips: FC = () => {
  const classes = useStyles();

  const [tripsImages, setTripsImages] = useState<Array<{ id: string, image: string }>>([])

  const { uid } = useSelector((state: RootState) => state.firebase.auth);

  const history = useHistory();

  useFirestoreConnect({
    collection: `users/${uid}/trips`,
    storeAs: "trips",
  });

  const trips: Array<Trip> = useSelector((state: RootState) => state.firestore.data.trips);

  const onTripDetailClick = (id: string) => {
    history.push(`/trip-detail/${id}`)
  }

  const downloadImage = async (tripId: string) => {
    const list = await storage.ref(`/images/${tripId}/`).listAll()
    if (list.items.length > 0) {
      const url = await list.items[0].getDownloadURL()
      return { id: tripId, image: url }
    }
  }

  useEffect(() => {
    const downloadImagesAsync = async (allTrips: Trip[]) => {
      const images: typeof tripsImages = [];

      await Object.values(allTrips).reduce(async (promise, trip) => {
        await promise;
        const image = await downloadImage(trip.id)
        if (image) {
          images.push(image);
        }
      }, Promise.resolve())

      return images;
    }

    if (trips) {
      downloadImagesAsync(trips)
        .then(array => setTripsImages(array))
        .catch(err => console.log(err))
    }
  }, [trips])

  return (
    <div className={classes.root}>
      {<GridList cellHeight={350} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
          <ListSubheader component="div" style={{ color: 'white' }}>My trips</ListSubheader>
        </GridListTile>
        {trips && Object.values(trips).map((trip) => (
          <GridListTile key={trip.id}>
            <img src={tripsImages.find(item => item.id === trip.id)?.image ?? TripPlaceholder} alt={trip.name} />
            <GridListTileBar
              title={trip.name}
              subtitle={<span>{trip.date?.toDate().toDateString()}</span>}
              actionIcon={
                <IconButton aria-label={`Open ${trip.name} details`} className={classes.icon} onClick={() => onTripDetailClick(trip.id)}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>}
    </div>
  );
}

export default Trips;
