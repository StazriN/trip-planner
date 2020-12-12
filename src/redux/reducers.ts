import { Actions, ActionStrings, IAreasState, INavigationState, ISelectedTripState, IWeatherState } from "./types";
import { WeatherInfo } from "../utils/types";

/*************************************************** AREAS ************************************************************/
const areasInitial: IAreasState = {
  isDownloading: false,
  birdAreas: undefined,
  clickedArea: undefined,
};

export function areasReducer(state: IAreasState = areasInitial, action: Actions): IAreasState {
  switch (action.type) {
    case ActionStrings.BIRD_AREAS_DOWNLOADED:
      return Object.assign({}, state, {
        birdAreas: action.payload,
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
  displayedLocation: "Blaník",
  displayedLocationCoordinates: { lng: 0, lat: 0 },
  cityData: [],
};

export function weatherReducer(state: IWeatherState = weatherInit, action: Actions): IWeatherState {
  switch (action.type) {
    case ActionStrings.DOWNLOAD_WEATHER:
      return Object.assign({}, state, {
        cityData: [new WeatherInfo(action.payload.areaName, new Date().getTime(), action.payload.data), ...state.cityData],
      });
    case ActionStrings.SET_LOCATION:
      return Object.assign({}, state, {
        displayedLocation: action.payload.areaName,
        displayedLocationCoordinates: { lng: action.payload.lng, lat: action.payload.lat },
      });
    default:
      return state;
  }
}

/*************************************************** WEATHER ************************************************************/

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
