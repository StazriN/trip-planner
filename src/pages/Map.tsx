import React, {FC} from 'react';
import {MapContainer, TileLayer} from "react-leaflet";
import {makeStyles} from "@material-ui/core";
import {LatLngTuple} from 'leaflet';

const mapCenter: LatLngTuple = [49.817493, 15.472962];
const zoom: number = 7;

const useStyles = makeStyles(theme => ({
  mapContainer: {width: '99%',marginLeft: 'auto', marginRight: 'auto', height: '70vh'}
}));

const Map: FC = () => {
  const classes = useStyles();

  return (
    <>
      <h2>Map</h2>
        <MapContainer id="mapId" center={mapCenter} zoom={zoom} className={classes.mapContainer}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
    </>
  );
};

export default Map;