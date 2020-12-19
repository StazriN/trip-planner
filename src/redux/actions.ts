import { action } from "typesafe-actions";
import { ActionStrings } from "./types";
import { ClickedArea, panelContextType } from "../utils/types";
import { LatLngTuple } from "leaflet";

/*************************************************** AREAS ************************************************************/

export function storeBirdAreas() {
  return action(ActionStrings.BIRD_AREAS_DOWNLOADED, {});
}

export function storeLargeProtectedAreas() {
  return action(ActionStrings.LARGE_PROTECTED_AREAS_DOWNLOADED, {});
}

export function storeSmallAreas() {
  return action(ActionStrings.SMALL_AREAS_DOWNLOADED, {});
}

export function storeEuAreas() {
  return action(ActionStrings.EU_AREAS_DOWNLOADED, {});
}

export function storeGeoparks() {
  return action(ActionStrings.GEOPARKS_DOWNLOADED, {});
}

export function storeBioAreas() {
  return action(ActionStrings.BIO_AREAS_DOWNLOADED, {});
}

export function setDownloading() {
  return action(ActionStrings.SET_DOWNLOADING);
}

export function setClickedArea(clickedArea: ClickedArea | undefined) {
  return action(ActionStrings.SET_CLICKED_AREA, { clickedArea });
}

/*************************************************** TRIPS ************************************************************/

export function setSelectedTripId(id: string) {
  return action(ActionStrings.SET_SELECTED_TRIP_ID, { id });
}

/*************************************************** WEATHER ************************************************************/

export function downloadWeather(data: any, areaName: string, areaId: number) {
  return action(ActionStrings.DOWNLOAD_WEATHER, { data, areaName, areaId });
}

export function setWeatherLocation(areaName: string, id: number, LatLng: LatLngTuple) {
  return action(ActionStrings.SET_WEATHER_LOCATION, { areaName, id, LatLng });
}

export function reinitializeWeather(on: boolean) {
  return action(ActionStrings.REINITIALIZE_WEATHER, { on });
}

/*************************************************** WEATHER ************************************************************/

export function setRightPanelContext(context: panelContextType, open: boolean) {
  return action(ActionStrings.SET_RIGHT_PANEL_CONTEXT, { context, open });
}
