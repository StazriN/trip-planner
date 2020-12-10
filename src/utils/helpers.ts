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
