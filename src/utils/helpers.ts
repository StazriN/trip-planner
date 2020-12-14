import { LatLngTuple } from "leaflet";
import { ActionStrings } from "../redux/types";
import { AreasApis, AreaType, Geometry } from "./types";

export const compressAreasCoordinates = (data: any, takeEvery: number) => {
  if (data?.features?.length > 0) {
    data.features.forEach((feature: any) => {
      // Do not compress if object is already small
      if (feature.geometry.rings[0].length > takeEvery * 3) {
        const newRings = feature.geometry.rings[0].filter(function (value: any, index: number) {
          return index % takeEvery === 0;
        });
        feature.geometry.rings[0] = newRings;
      }
    });

    return data;
  }

  return data;
};

export const findMeCenter = (data: Geometry) => {
  var [minX, minY, maxX, maxY] = [100000, 100000, 0, 0];
  const ring = data.rings[0];

  ring.forEach((tuple) => {
    minX = minX > tuple[0] ? tuple[0] : minX;
    minY = minY > tuple[1] ? tuple[1] : minY;
    maxX = maxX < tuple[0] ? tuple[0] : maxX;
    maxY = maxY < tuple[1] ? tuple[1] : maxY;
  });

  // const result = { lat: (minY + maxY) / 2, lng: (minX + maxX) / 2,  };
  const result: LatLngTuple = [(minY + maxY) / 2, (minX + maxX) / 2];
  console.log(result);
  return result;
};

export const getEndpoint = (area: AreaType) => {
  switch (area) {
    case "birdAreas":
      return [AreasApis.BIRD_AREAS, ActionStrings.BIRD_AREAS_DOWNLOADED];
    case "bioAreas":
      return [AreasApis.BIO_AREAS, ActionStrings.BIO_AREAS_DOWNLOADED];
    case "euAreas":
      return [AreasApis.EU_AREAS, ActionStrings.EU_AREAS_DOWNLOADED];
    case "geoparks":
      return [AreasApis.GEOPARKS, ActionStrings.GEOPARKS_DOWNLOADED];
    case "largeProtectedAreas":
      return [AreasApis.LARGE_PROTECTED_AREAS, ActionStrings.LARGE_PROTECTED_AREAS_DOWNLOADED];
    case "smallAreas":
      return [AreasApis.SMALL_AREAS, ActionStrings.SMALL_AREAS_DOWNLOADED];
  }
};
