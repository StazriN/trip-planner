import React, { FC, useCallback, useEffect, useState } from "react";
import { Trip } from "../utils/types";
import { Container, GridList, GridListTile, GridListTileBar, makeStyles } from "@material-ui/core";
import TripPlaceholder from "../assets/jpg/TripPlaceholder.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import { storage } from "../index";
import { useWindowSize } from "../hooks/useWindowSize";
import { getGridColumns } from "../utils/helpers";
import { fade } from "@material-ui/core/styles/colorManipulator";
import RSC from "react-scrollbars-custom";

const useStyles = makeStyles((theme) => ({
  backgroundDiv: {
    backgroundColor: fade(theme.palette.secondary.main, 0.3),
    width: "100%",
    height: "85vh !important",
    paddingTop: 20,
  },
  gridItem: {
    cursor: "pointer",
    borderRadius: "5px",
  },
}));

const Trips: FC = () => {
  const [tripsImages, setTripsImages] = useState<Array<{ id: string; image: string }>>([]);
  const { uid } = useSelector((state: RootState) => state.firebase.auth);

  const history = useHistory();
  const classes = useStyles();

  useFirestoreConnect({
    collection: `users/${uid}/trips`,
    storeAs: "trips",
  });

  const trips: Array<Trip> = useSelector((state: RootState) => state.firestore.data.trips);

  const onTripDetailClick = (id: string) => {
    history.push(`/trip-detail/${id}`);
  };


  const downloadImagesAsync = useCallback(async (allTrips: Trip[]) => {
    // Helper function
    const downloadImage = async (tripId: string) => {
      const list = await storage.ref(`users/${uid}/images/${tripId}/`).listAll();
      if (list.items.length > 0) {
        const url = await list.items[0].getDownloadURL();
        return { id: tripId, image: url };
      }
    };

    const images: typeof tripsImages = [];

    await Object.values(allTrips).reduce(async (promise, trip) => {
      if (!trip) {
        return;
      }

      await promise;
      const image = await downloadImage(trip.id);
      if (image) {
        images.push(image);
      }
    }, Promise.resolve());

    return images;
  }, [uid]);

  useEffect(() => {
    if (trips) {
      downloadImagesAsync(trips)
        .then((array) => setTripsImages(array))
        .catch((err) => console.log(err));
    }
  }, [trips, downloadImagesAsync]);

  const windowSize = useWindowSize();
  const columns = getGridColumns(windowSize);

  return (
    <div className={classes.backgroundDiv}>
      <RSC>
        {trips && Object.values(trips).length > 0 &&
        <Container>
          <GridList cellHeight={350} spacing={10} cols={columns}>
            {Object.values(trips).map((trip) => (
              trip && <GridListTile className={classes.gridItem} key={trip.id} onClick={() => onTripDetailClick(trip.id)}>
                <img src={tripsImages.find((item) => item.id === trip.id)?.image ?? TripPlaceholder} alt={trip.name}/>
                <GridListTileBar title={trip.name} subtitle={<span>{trip.date?.toDate().toDateString()}</span>}/>
              </GridListTile>
            ))}
          </GridList>
        </Container>}
      </RSC>
    </div>
  );
};

export default Trips;
