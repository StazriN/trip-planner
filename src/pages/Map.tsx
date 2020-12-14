import React, { FC, useEffect, useState } from "react";
import { Map as MapContainer, TileLayer } from "react-leaflet";
import { CircularProgress, Container, makeStyles } from "@material-ui/core";
import { LatLngTuple } from "leaflet";
import { RootState, store } from "../redux";
import { downloadArea } from "../redux/thunks";
import { AreaType } from "../utils/types";
import PolygonsMapper from "../components/PolygonsMapper";
import { connect } from "react-redux";
import { setDownloading } from "../redux/actions";
import { getEndpoint } from "../utils/helpers";
import PlanTrip from "./PlanTrip";

const mapCenter: LatLngTuple = [49.817493, 15.472962];
const zoom: number = 7;

interface IRatio {
  widthDialog: string;
  widthMap: string;
}

const useStyles = makeStyles((theme) => ({
  mainContainer: { display: "flex", marginTop: "5vh", paddingLeft: "5px !important", paddingRight: "10px !important" },
  dialogContainer: { width: (drawerSize: IRatio) => drawerSize.widthDialog, height: "75vh", paddingLeft: "5px !important", paddingRight: "5px !important", transition: "0.5s" },
  mapContainer: { width: (drawerSize: IRatio) => drawerSize.widthMap, height: "75vh", paddingLeft: "5px !important", paddingRight: "5px !important", transition: "0.5s" },
  map: { width: "100%", height: "100%", marginLeft: "auto", marginRight: "auto", borderRadius: "5px" },
  lowOpacity: { opacity: "0.5" },
  loader: { position: "fixed", left: "50%", top: "50%" },
  polygonMapper: { color: "#f99537" },
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

  const size: IRatio = planTripDisplayed ? { widthDialog: "30%", widthMap: "70%" } : { widthDialog: "0%", widthMap: "100%" };
  const classes = useStyles(size);

  useEffect(() => {
    if (!areas[areaType]) {
      store.dispatch(setDownloading());
      const [api, actionString] = getEndpoint(areaType);
      store.dispatch(downloadArea(api, actionString));
    }

    setPlanTripDisplayed(false);
  }, [areaType]);

  return (
    <Container className={classes.mainContainer} maxWidth={false}>
      <Container className={classes.dialogContainer} maxWidth={false}>
        <PlanTrip />
      </Container>

      <Container className={classes.mapContainer} maxWidth={false}>
        {areas.isDownloading && <CircularProgress className={classes.loader} />}
        <MapContainer id="mapId" center={mapCenter} zoom={zoom} className={[classes.map, areas.isDownloading ? classes.lowOpacity : ""].join(" ")}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          {areas[areaType] && <PolygonsMapper area={areas[areaType]?.data!} onPlanDisplay={() => setPlanTripDisplayed(true)} />}
        </MapContainer>
      </Container>
    </Container>
  );
};

export default connect(mapStateToProps)(Map);
