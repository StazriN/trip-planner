import { action } from "typesafe-actions";
import { ActionStrings } from "./types";
import { ClickedArea, panelContextType } from "../utils/types";

/*************************************************** AREAS ************************************************************/

export function storeBirdAreas() {
  return action(ActionStrings.BIRD_AREAS_DOWNLOADED, {});
}

export function setDownloading() {
  return action(ActionStrings.SET_DOWNLOADING);
}

export function setClickedArea(clickedArea: ClickedArea) {
  return action(ActionStrings.SET_CLICKED_AREA, { clickedArea });
}

/*************************************************** TRIPS ************************************************************/

export function setSelectedTripId(id: string) {
  return action(ActionStrings.SET_SELECTED_TRIP_ID, { id });
}

/*************************************************** WEATHER ************************************************************/

export function downloadWeather(data: any, areaName: string) {
  return action(ActionStrings.DOWNLOAD_WEATHER, { data, areaName });
}

export function setLocation(areaName: string, lng: number, lat: number) {
  return action(ActionStrings.SET_LOCATION, { areaName, lng, lat });
}

/*************************************************** WEATHER ************************************************************/

export function setRightPanelContext(context: panelContextType, open: boolean) {
  return action(ActionStrings.SET_RIGHT_PANEL_CONTEXT, { context, open });
}
