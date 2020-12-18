import { Actions, ActionStrings, IAreasState, INavigationState, ISelectedTripState, IWeatherState } from "./types";
import { WeatherInfo } from "../utils/types";

/*************************************************** AREAS ************************************************************/
const areasInitial: IAreasState = {
  isDownloading: false,
  birdAreas: undefined,
  largeProtectedAreas: undefined,
  smallAreas: undefined,
  euAreas: undefined,
  geoparks: undefined,
  bioAreas: undefined,
  clickedArea: undefined,
};

export function areasReducer(state: IAreasState = areasInitial, action: Actions): IAreasState {
  switch (action.type) {
    case ActionStrings.BIRD_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        birdAreas: action.payload,
        isDownloading: false,
      });
    case ActionStrings.LARGE_PROTECTED_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        largeProtectedAreas: action.payload,
        isDownloading: false,
      });
    case ActionStrings.SMALL_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        smallAreas: action.payload,
        isDownloading: false,
      });
    case ActionStrings.EU_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        euAreas: action.payload,
        isDownloading: false,
      });
    case ActionStrings.GEOPARKS_DOWNLOADED:
      return Object.assign({}, state, {
        geoparks: action.payload,
        isDownloading: false,
      });
    case ActionStrings.BIO_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        bioAreas: action.payload,
        isDownloading: false,
      });
    case ActionStrings.SET_DOWNLOADING:
      return Object.assign({}, state, {
        isDownloading: true,
      });
    case ActionStrings.SET_CLICKED_AREA:
      return Object.assign({}, state, {
        clickedArea: action.payload.clickedArea,
      });
    default:
      return state;
  }
}

/*************************************************** TRIPS ************************************************************/

const selectedTripInitial: ISelectedTripState = {
  id: undefined,
};

export function selectedTripReducer(state: ISelectedTripState = selectedTripInitial, action: Actions): ISelectedTripState {
  switch (action.type) {
    case ActionStrings.SET_SELECTED_TRIP_ID:
      return Object.assign({}, state, {
        id: action.payload.id,
      });
    default:
      return state;
  }
}

/*************************************************** WEATHER ************************************************************/

const weatherInit: IWeatherState = {
  displayedLocation: { name: "Blaník", id: NaN },
  displayedLocationCoordinates: [0, 0],
  reinitialize: false,
  cityData: [],
};

export function weatherReducer(state: IWeatherState = weatherInit, action: Actions): IWeatherState {
  switch (action.type) {
    case ActionStrings.DOWNLOAD_WEATHER:
      return Object.assign({}, state, {
        cityData: [new WeatherInfo(action.payload.areaName, action.payload.areaId, new Date().getTime(), action.payload.data)],
        reinitialize: false,
      });
    case ActionStrings.SET_WEATHER_LOCATION:
      return Object.assign({}, state, {
        displayedLocation: { name: action.payload.areaName, id: action.payload.id },
        displayedLocationCoordinates: [...action.payload.LatLng],
      });
    case ActionStrings.REINITIALIZE_WEATHER:
      return Object.assign({}, state, {
        reinitialize: action.payload.on,
      });
    default:
      return state;
  }
}

/*************************************************** NAVIGATION ************************************************************/

const navigationInit: INavigationState = {
  panelContext: "menu",
  panelOpened: false,
};

export function navigationReducer(state: INavigationState = navigationInit, action: Actions): INavigationState {
  switch (action.type) {
    case ActionStrings.SET_RIGHT_PANEL_CONTEXT:
      return Object.assign({}, state, {
        panelContext: action.payload.context,
        panelOpened: action.payload.open,
      });
    default:
      return state;
  }
}
