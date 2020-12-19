import { CircularProgress, Container, makeStyles, Grid, Card, CardContent, CardMedia, Typography, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { downloadWeather } from "../redux/thunks";
import { store } from "../redux";
import { RootState } from "../redux";
import { connect } from "react-redux";
import { reinitializeWeather } from "../redux/actions";
import { WeatherDay } from "../utils/types";
import { days, formatDateToDate } from "../utils/helpers";
import RSC from "react-scrollbars-custom";

const useStyles = makeStyles((theme) => ({
  container: { height: "100%", paddingLeft: "10px !important", paddingRight: "10px !important" },
  loaderGrid: { height: "100%" },
  loader: { width: "auto", margin: "auto" },

  titlePaper: { padding: "5px", marginTop: "5px", backgroundColor: "#ffffffad", textAlign: "center" },
  title: { fontWeight: 600, color: theme.palette.primary.dark },
  //Card
  root: { display: "flex", marginTop: "5px", backgroundColor: "#ffffffad", color: theme.palette.secondary.main },
  content: { flex: 1, display: "flex", flexDirection: "column" },
  image: { flex: 1 },
  weatherContainer: { padding: "5px" },
}));

const mapStateToProps = ({ weather, navigation }: RootState) => ({ weather, navigation });

type ReduxAndPropsType = ReturnType<typeof mapStateToProps>;

const WeatherWidget: React.FC<ReduxAndPropsType> = (props) => {
  const weatherData = props.weather.cityData[0];

  const classes = useStyles();

  useEffect(() => {
    // if (props.weather.displayedLocation) props.weather.cityData[0].areaName;

    const toDisplayId = props.weather.displayedLocation.id;

    if (weatherData?.areaId !== toDisplayId || Date.now() > weatherData?.timestamp + 43200000) {
      store.dispatch(
        downloadWeather(
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            props.weather.displayedLocationCoordinates[0] +
            "&lon=" +
            props.weather.displayedLocationCoordinates[1] +
            "&exclude=hourly,current,minutely&units=metric&appid=10226f2480fe2eb186e24ae33b922aed",
          "DOWNLOAD_WEATHER",
          props.weather.displayedLocation.name,
          props.weather.displayedLocation.id
        )
      );
    } else {
      store.dispatch(reinitializeWeather(false));
    }
    return () => console.log("Unmounting");
  }, [props.weather.reinitialize]);

  return (
    <Container className={classes.container}>
      {props.weather.reinitialize ? (
        <Grid className={classes.loaderGrid} container spacing={0} justify="center" direction="column" alignItems="center">
          <CircularProgress className={classes.loader} />
        </Grid>
      ) : (
        <>
          <Paper className={classes.titlePaper}>
            <Typography variant="h6" className={classes.title}>
              {props.weather.displayedLocation.name}
            </Typography>
          </Paper>

          <RSC style={{ width: "100%", height: "calc(100% - 55px)" }}>
            <div className={classes.weatherContainer}>
              {weatherData.data.daily.map((dayWeather: WeatherDay, index: number) => (
                <Card key={index} className={classes.root}>
                  <CardContent className={classes.content}>
                    <Typography>{days[new Date(dayWeather.dt * 1000).getDay()]}</Typography>
                    <Typography>{formatDateToDate(new Date(dayWeather.dt * 1000))}</Typography>
                    <Typography>{`${Math.round(dayWeather.temp.day)}°C`}</Typography>
                  </CardContent>

                  <CardMedia className={classes.image} image={`http://openweathermap.org/img/wn/${dayWeather.weather[0].icon}@4x.png`} />
                </Card>
              ))}
            </div>
          </RSC>
        </>
      )}
    </Container>
  );
};

export default connect(mapStateToProps, {})(WeatherWidget);
