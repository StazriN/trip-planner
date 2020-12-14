import React, { FC } from "react";
import { Polygon } from "react-leaflet";
import { store } from "../redux";
import { setClickedArea, setWeatherLocation } from "../redux/actions";
import { AreaData, AreaFeature, ClickedArea, Geometry } from "../utils/types";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { useHistory } from "react-router-dom";
import { findMeCenter } from "../utils/helpers";

export interface IPolygonsMapperProps {
  area: AreaData;
  onPlanDisplay: () => void;
}

const PolygonsMapper: FC<IPolygonsMapperProps> = (props) => {
  const history = useHistory();

  const normalizeGeometry = (geometry: Geometry) => {
    return geometry.rings[0].map((point) => [point[1], point[0]] as LatLngExpression);
  };

  const getFirstPosition = (geometry: Geometry) => {
    console.log(geometry.rings[0][0]);

    return [geometry.rings[0][0][1], geometry.rings[0][0][0]] as LatLngTuple;
  };

  const onPolygonClickHandler = (feature: AreaFeature) => {
    const { NAZEV, OBJECTID } = feature.attributes;
    store.dispatch(setWeatherLocation(NAZEV, OBJECTID, findMeCenter(feature.geometry)));
    store.dispatch(setClickedArea(new ClickedArea(OBJECTID, NAZEV, getFirstPosition(feature.geometry))));
    props.onPlanDisplay();
  };

  return (
    <>
      {props.area.features.map((feature: AreaFeature) => (
        <Polygon
          color="#f99537"
          weight={0}
          fillOpacity={0.65}
          key={feature.attributes.OBJECTID}
          positions={normalizeGeometry(feature.geometry)}
          onclick={() => onPolygonClickHandler(feature)}
        />
      ))}
    </>
  );
};

export default PolygonsMapper;
