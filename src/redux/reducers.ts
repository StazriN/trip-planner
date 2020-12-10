import {Actions, ActionStrings, IAreasState} from "./types";

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
