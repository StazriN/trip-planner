import firebase from "firebase/app";
import { compressAreasCoordinates } from "./helpers";
import { LatLngTuple } from "leaflet";

export type Trip = {
  id: string;
  name: string;
  date: firebase.firestore.Timestamp;
  notes: string[];
  areaId: number;
  areaName: string;
  position: { lng: number; lat: number };
};

export class CompressedArea {
  data: AreaData;
  isDownloaded: boolean = false;

  constructor(data: any, isDownloaded: boolean) {
    this.data = compressAreasCoordinates(data, 10);
    this.isDownloaded = isDownloaded;
  }
}

export class ClickedArea {
  id: number;
  name: string;
  position: LatLngTuple;

  constructor(id: number, name: string, position: LatLngTuple) {
    this.id = id;
    this.name = name;
    this.position = position;
  }
}

export enum AreasApis {
  BIRD_AREAS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/7/query?where=1%3D1&outFields=OBJECTID,NAZEV,ROZL,SHAPE,SHAPE.AREA&outSR=4326&f=json",
  LARGE_PROTECTED_AREAS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/0/query?where=1%3D1&outFields=OBJECTID,NAZEV,ROZL,SHAPE,SHAPE.AREA&outSR=4326&f=json",
  GEOPARKS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/10/query?where=1%3D1&outFields=OBJECTID,NAZEV_GP,SHAPE,SHAPE.AREA&outSR=4326&f=json",
  EU_AREAS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/6/query?where=1%3D1&outFields=OBJECTID,NAZEV,ROZL,SHAPE,SHAPE.AREA&outSR=4326&f=json",
  SMALL_AREAS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/2/query?where=1%3D1&outFields=OBJECTID,NAZEV,ROZL,SHAPE,SHAPE.AREA&outSR=4326&f=json",
  BIO_AREAS = "https://gis.nature.cz/arcgis/rest/services/Aplikace/Opendata/MapServer/8/query?where=1%3D1&outFields=OBJECTID,NAZEV_BR,SHAPE,SHAPE.AREA&outSR=4326&f=json",
}

export type Geometry = {
  rings: Array<Array<LatLngTuple>>;
};

export type AreaFeature = {
  attributes: {
    OBJECTID: number;
    NAZEV: string;
  };
  geometry: Geometry;
};

export type AreaData = {
  features: [AreaFeature];
};

export class WeatherInfo {
  areaName: string;
  timestamp: number;
  data: any = null;

  constructor(areaName: string, timestamp: number, data: any) {
    this.areaName = areaName;
    this.timestamp = timestamp;
    this.data = data;
  }
}

export type panelContextType = "menu" | "weather";

export type AreaType = "birdAreas" | "largeProtectedAreas" | "smallAreas" | "euAreas" | "geoparks" | "bioAreas";

export type MenuItemsType = Record<AreaType, string>;
