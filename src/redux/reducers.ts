import {Actions, ActionStrings, IAreasState, ISelectedTripState} from "./types";

/*************************************************** AREAS ************************************************************/
const areasInitial: IAreasState = {
  isDownloading: false,
  birdAreas: undefined,
  clickedArea: undefined
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
  id: undefined
};

export function selectedTripReducer(state: ISelectedTripState = selectedTripInitial, action: Actions): ISelectedTripState {
  switch (action.type) {
    case ActionStrings.SET_SELECTED_TRIP_ID:
      return Object.assign({}, state, {
        id: action.payload.id
      });
    default:
      return state;
  }
}
