import React, { FC, useEffect, useState } from "react";
import { Map as MapContainer, TileLayer } from "react-leaflet";
import { CircularProgress, Container, fade, makeStyles } from "@material-ui/core";
import { LatLngTuple } from "leaflet";
import { RootState, store } from "../redux";
import { downloadArea } from "../redux/thunks";
import { AreaType } from "../utils/types";
import PolygonsMapper from "../components/PolygonsMapper";
import { connect } from "react-redux";
import { setClickedArea, setDownloading } from "../redux/actions";
import { getEndpoint, isMobileMode } from "../utils/helpers";
import PlanTrip from "../components/PlanTrip";
import { useWindowSize } from "../hooks/useWindowSize";

const mapCenter: LatLngTuple = [49.817493, 15.472962];
const zoom: number = 7;

export interface IRatio {
  widthDialog: string;
  widthMap: string;
}

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    paddingBottom: "2vh",
    paddingTop: "5vh",
    paddingLeft: "5px !important",
    paddingRight: "10px !important",
    backgroundColor: fade(theme.palette.secondary.main, 0.3),
  },
  dialogContainer: {
    maxWidth: (drawerSize: IRatio) => drawerSize.widthDialog,
    height: "75vh",
    paddingLeft: "5px !important",
    paddingRight: "5px !important",
  },
  mapContainer: {
    maxWidth: (drawerSize: IRatio) => drawerSize.widthMap,
    height: "75vh",
    paddingLeft: "5px !important",
    paddingRight: "5px !important",
  },
  map: {
    width: "100%",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "5px",
  },
  lowOpacity: {
    opacity: "0.5",
  },
  loader: {
    position: "fixed",
    left: "50%",
    top: "50%",
  },
  polygonMapper: {
    color: "#f99537",
  },
}));

const mapStateToProps = ({ areas }: RootState) => {
  return { areas };
};

export interface IMapProps {
  areaType: AreaType;
}

type MapProps = ReturnType<typeof mapStateToProps> & IMapProps;

const Map: FC<MapProps> = ({ areas, areaType }) => {
  const [planTripDisplayed, setPlanTripDisplayed] = useState<boolean>(false);

  const windowSize = useWindowSize();
  const mobileOn = isMobileMode(windowSize);

  const size: IRatio = !mobileOn ? { widthDialog: "400px", widthMap: "none" } : { widthDialog: "100%", widthMap: "100%" };
  const classes = useStyles(size);

  useEffect(() => {
    if (!areas[areaType]) {
      store.dispatch(setDownloading());
      const [api, actionString] = getEndpoint(areaType);
      store.dispatch(downloadArea(api, actionString));
    }

    store.dispatch(setClickedArea(undefined));
    setPlanTripDisplayed(false);
  }, [areaType, areas]);

  const isSelectedAreaDownloading = () => {
    return !areas[areaType] && areas.isDownloading;
  };

  return (
    <Container className={classes.mainContainer} maxWidth={false}>
      {(!mobileOn || planTripDisplayed) && (
        <Container className={classes.dialogContainer} maxWidth={false}>
          <PlanTrip onClose={() => setPlanTripDisplayed(false)} />
        </Container>
      )}

      {(!mobileOn || !planTripDisplayed) && (
        <Container className={classes.mapContainer} maxWidth={false}>
          {isSelectedAreaDownloading() && <CircularProgress className={classes.loader} />}
          <MapContainer id="mapId" center={mapCenter} zoom={zoom} className={[classes.map, isSelectedAreaDownloading() ? classes.lowOpacity : ""].join(" ")}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" />
            {areas[areaType] && <PolygonsMapper area={areas[areaType]?.data!} onPlanDisplay={() => setPlanTripDisplayed(true)} />}
          </MapContainer>
        </Container>
      )}
    </Container>
  );
};

export default connect(mapStateToProps)(Map);
