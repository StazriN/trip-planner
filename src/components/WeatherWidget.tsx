import { CircularProgress, Container } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { downloadWeather } from "../redux/thunks";
import { store } from "../redux";
import { RootState } from "../redux";
import { connect } from "react-redux";

const mapStateToProps = ({ weather }: RootState) => ({ weather });

type ReduxAndPropsType = ReturnType<typeof mapStateToProps>;

const WeatherWidget: React.FC<ReduxAndPropsType> = (props) => {
  const [dataInicialized, setDataInicialized] = useState<boolean>(false);

  useEffect(() => {
    console.log(store.getState());

    console.log(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        props.weather.displayedLocationCoordinates[0] +
        "&lon=" +
        props.weather.displayedLocationCoordinates[1] +
        "&exclude=hourly,current,minutely&units=metric&appid=10226f2480fe2eb186e24ae33b922aed"
    );

    // if (props.weather.displayedLocation) props.weather.cityData[0].areaName;

    store.dispatch(
      downloadWeather(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          props.weather.displayedLocationCoordinates[0] +
          "&lon=" +
          props.weather.displayedLocationCoordinates[1] +
          "&exclude=hourly,current,minutely&units=metric&appid=10226f2480fe2eb186e24ae33b922aed",
        "DOWNLOAD_WEATHER",
        props.weather.displayedLocation.name
      )
    );

    return () => console.log("Unmounting");
  }, []);

  return <Container>{dataInicialized ? <></> : <CircularProgress />}</Container>;
};

export default connect(mapStateToProps, {})(WeatherWidget);
