import { LatLngTuple } from "leaflet";
import { IWindowSize } from "../hooks/useWindowSize";
import { ActionStrings } from "../redux/types";
import { AreasApis, AreaType, AreaTypeArray, Geometry } from "./types";

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

export const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const formatDateToDate = (value: Date): string => {
  var dd = value.getDate();
  var mm = value.getMonth() + 1;
  var yyyy = value.getFullYear().toString();

  return (dd < 10 ? "0" + dd.toString() : dd.toString()) + "." + (mm < 10 ? "0" + mm.toString() : mm.toString()) + "." + yyyy;
};

export const isValidAreaType = (str: AreaType): boolean => {
  return AreaTypeArray.includes(str);
};

export const isMobileMode = (windowSize: IWindowSize) => {
  return windowSize.width !== undefined && windowSize.width < 800;
};

export const getGridColumns = (windowSize: IWindowSize) => {
  if (windowSize.width === undefined) return 0;
  if (windowSize.width > 1200) return 4;
  if (windowSize.width > 800) return 3;
  if (windowSize.width > 460) return 2;
  return 1;
};
