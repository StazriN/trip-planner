import firebase from 'firebase/app';

export type Trip = {
    name: string;
    date: firebase.firestore.Timestamp;
    notes: string[];
    areaId: number;
    areaName: string;
    coordinates: { lng: number; lat: number };
}

export type User = {
    userName: string;
    trips: Trip[]
}