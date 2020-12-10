import { action } from "typesafe-actions";
import {ActionStrings} from "./types";
import {ClickedArea} from "../utils/types";

export function storeBirdAreas() {
  return action(ActionStrings.BIRD_AREAS_DOWNLOADED, {});
}

export function setDownloading() {
  return action(ActionStrings.SET_DOWNLOADING);
}

export function setClickedArea(clickedArea: ClickedArea) {
  return action(ActionStrings.SET_CLICKED_AREA, { clickedArea });
}
