import { IAreasState } from "../redux/types";
import { CompressedArea } from "./types";

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

export const findMeCenter = (stateData: IAreasState, typeOfArea: keyof IAreasState, areaID: number | undefined) => {
  const areaGeomData = stateData[typeOfArea] as CompressedArea;
  const features = areaGeomData?.data?.features;
  if (!features) return { lng: 0, lat: 0 };

  const objective = features.filter((feature) => feature.attributes.OBJECTID === areaID)[0];
  if (!objective) return { lng: 0, lat: 0 };

  var [minX, minY, maxX, maxY] = [100000, 100000, 0, 0];
  const ring = objective.geometry.rings[0];

  ring.forEach((tuple) => {
    minX = minX > tuple[0] ? tuple[0] : minX;
    minY = minY > tuple[1] ? tuple[1] : minY;
    maxX = maxX < tuple[0] ? tuple[0] : maxX;
    maxY = maxY < tuple[1] ? tuple[1] : maxY;
  });

  const result = { lng: (minX + maxX) / 2, lat: (minY + maxY) / 2 };
  console.log(objective.attributes.NAZEV, result);
  return result;
};
