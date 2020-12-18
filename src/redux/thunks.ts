import { AppThunk } from "./types";
import { CompressedArea } from "../utils/types";

export const downloadArea = (api: string, action: string): AppThunk => async (dispatch) => {
  return fetch(api)
    .then((response) => response.json())
    .then((json) => {
      const area = new CompressedArea(json, true);
      dispatch({ type: action, payload: area });
    });
};

export const downloadWeather = (api: string, action: string, name: string, id: number): AppThunk => async (dispatch) => {
  return fetch(api)
    .then((response) => response.json())
    .then((json) => {
      dispatch({ type: action, payload: { data: json, areaName: name, areaId: id } });
    });
};
