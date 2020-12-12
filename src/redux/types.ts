import * as actions from "./actions";
import { Action, ActionType } from "typesafe-actions";
import { ThunkAction } from "redux-thunk";
import { ClickedArea, CompressedArea, panelContextType, WeatherInfo } from "../utils/types";
import { RootState } from "./index";

export interface IAreasState {
  isDownloading: boolean;
  birdAreas?: CompressedArea;
  clickedArea?: ClickedArea;
}

export interface ISelectedTripState {
  id?: string;
}

export interface IWeatherState {
  displayedLocation: string;
  displayedLocationCoordinates: { lng: number; lat: number };
  cityData: WeatherInfo[];
}

export interface INavigationState {
  panelContext: panelContextType;
  panelOpened: boolean;
}

export enum ActionStrings {
  // AREAS
  BIRD_AREAS_DOWNLOADED = "BIRD_AREAS_DOWNLOADED",
  SET_DOWNLOADING = "SET_DOWNLOADING",
  SET_CLICKED_AREA = "SET_CLICKED_AREA",
  // TRIPS
  SET_SELECTED_TRIP_ID = "SET_SELECTED_TRIP_ID",
  // WRATHER
  DOWNLOAD_WEATHER = "DOWNLOAD_WEATHER",
  SET_LOCATION = "SET_LOCATION",
  // NAVIGATION
  SET_RIGHT_PANEL_CONTEXT = "SET_RIGHT_PANEL_CONTEXT",
}

export type Actions = ActionType<typeof actions>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
