import React, {FC} from "react";
import {Polygon} from "react-leaflet";
import {store} from "../redux";
import {setClickedArea} from "../redux/actions";
import {AreaData, AreaFeature, ClickedArea, Geometry} from "../utils/types";
import {LatLngExpression, LatLngTuple} from "leaflet";
import {useHistory} from "react-router-dom";

const PolygonsMapper: FC<{ area: AreaData }> = ({area}) => {
  const history = useHistory();

  const normalizeGeometry = (geometry: Geometry) => {
    return geometry.rings[0].map((point) =>
      [point[1], point[0]] as LatLngExpression
    )
  };

  const getFirstPosition = (geometry: Geometry) => {
    console.log(geometry.rings[0][0]);

    return [geometry.rings[0][0][1], geometry.rings[0][0][0]] as LatLngTuple;
  };

  const onPolygonClickHandler = (feature: AreaFeature) => {
    store.dispatch(setClickedArea(new ClickedArea(feature.attributes.OBJECTID, feature.attributes.NAZEV, getFirstPosition(feature.geometry))));
    history.push('/plan-trip')
  }

  return (
    <>
      {area.features.map((feature: AreaFeature) => (
        <Polygon
          key={feature.attributes.OBJECTID}
          positions={normalizeGeometry(feature.geometry)}
          onclick={() => onPolygonClickHandler(feature)}
        />
      ))}
    </>);
};

export default PolygonsMapper;
