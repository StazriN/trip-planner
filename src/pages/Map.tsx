import React, {FC, useEffect} from 'react';
import {Map as MapContainer, TileLayer} from "react-leaflet";
import {CircularProgress, makeStyles} from "@material-ui/core";
import {LatLngTuple} from 'leaflet';
import {RootState, store} from "../redux";
import {downloadArea} from "../redux/thunks";
import {AreasApis} from "../utils/types";
import {ActionStrings} from "../redux/types";
import PolygonsMapper from "../components/PolygonsMapper";
import {connect} from "react-redux";
import {setDownloading} from "../redux/actions";

const mapCenter: LatLngTuple = [49.817493, 15.472962];
const zoom: number = 7;

const useStyles = makeStyles(theme => ({
  mapContainer: {width: '99%', marginLeft: 'auto', marginRight: 'auto', height: '70vh'},
  lowOpacity: {opacity: '0.5'},
  loader: {position: 'fixed', left: '50%', top: '50%'}
}));

const mapStateToProps = ({areas}: RootState) => {
  return {areas};
};

type MapProps = ReturnType<typeof mapStateToProps>;

const Map: FC<MapProps> = ({areas}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!areas.birdAreas) {
      store.dispatch(setDownloading())
      store.dispatch(downloadArea(AreasApis.BIRD_AREAS, ActionStrings.BIRD_AREAS_DOWNLOADED))
    }
  }, [areas.birdAreas]);

  return (
    <>
      <h2>Map</h2>
      {areas.isDownloading && <CircularProgress className={classes.loader}/>}
      <MapContainer id="mapId" center={mapCenter} zoom={zoom} className={[classes.mapContainer, areas.isDownloading ? classes.lowOpacity : ''].join(' ')}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {areas.birdAreas && <PolygonsMapper area={areas.birdAreas.data}/>}
      </MapContainer>
    </>
  );
};

export default connect(mapStateToProps)(Map);
