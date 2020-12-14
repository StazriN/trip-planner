import * as actions from "./actions";
import { Action, ActionType } from "typesafe-actions";
import { ThunkAction } from "redux-thunk";
import { ClickedArea, CompressedArea, panelContextType, WeatherInfo } from "../utils/types";
import { RootState } from "./index";
import { LatLngTuple } from "leaflet";

export interface IAreasState {
  isDownloading: boolean;
  birdAreas?: CompressedArea;
  largeProtectedAreas?: CompressedArea;
  smallAreas?: CompressedArea;
  euAreas?: CompressedArea;
  geoparks?: CompressedArea;
  bioAreas?: CompressedArea;
  clickedArea?: ClickedArea;
}

export interface ISelectedTripState {
  id?: string;
}

export interface IWeatherState {
  displayedLocation: { name: string; id: number };
  displayedLocationCoordinates: LatLngTuple;
  cityData: WeatherInfo[];
}

export interface INavigationState {
  panelContext: panelContextType;
  panelOpened: boolean;
}

export enum ActionStrings {
  // AREAS
  BIRD_AREAS_DOWNLOADED = "BIRD_AREAS_DOWNLOADED",
  LARGE_PROTECTED_AREAS_DOWNLOADED = "LARGE_PROTECTED_AREAS_DOWNLOADED",
  SMALL_AREAS_DOWNLOADED = "SMALL_AREAS_DOWNLOADED",
  EU_AREAS_DOWNLOADED = "EU_AREAS_DOWNLOADED",
  GEOPARKS_DOWNLOADED = "GEOPARKS_DOWNLOADED",
  BIO_AREAS_DOWNLOADED = "BIO_AREAS_DOWNLOADED",
  SET_DOWNLOADING = "SET_DOWNLOADING",
  SET_CLICKED_AREA = "SET_CLICKED_AREA",
  // TRIPS
  SET_SELECTED_TRIP_ID = "SET_SELECTED_TRIP_ID",
  // WRATHER
  DOWNLOAD_WEATHER = "DOWNLOAD_WEATHER",
  SET_WEATHER_LOCATION = "SET_WEATHER_LOCATION",
  // NAVIGATION
  SET_RIGHT_PANEL_CONTEXT = "SET_RIGHT_PANEL_CONTEXT",
}

export type Actions = ActionType<typeof actions>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
