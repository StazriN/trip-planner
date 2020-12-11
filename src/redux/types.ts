import * as actions from "./actions";
import {Action, ActionType} from "typesafe-actions";
import {ThunkAction} from "redux-thunk";
import {ClickedArea, CompressedArea} from "../utils/types";
import {RootState} from "./index";

export interface IAreasState {
  isDownloading: boolean;
  birdAreas?: CompressedArea;
  clickedArea?: ClickedArea
}

export interface ISelectedTripState {
  id?: string
}

export enum ActionStrings {
  // AREAS
  BIRD_AREAS_DOWNLOADED = "BIRD_AREAS_DOWNLOADED",
  SET_DOWNLOADING = "SET_DOWNLOADING",
  SET_CLICKED_AREA = "SET_CLICKED_AREA",
  // TRIPS
  SET_SELECTED_TRIP_ID = "SET_SELECTED_TRIP_ID"
}

export type Actions = ActionType<typeof actions>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
