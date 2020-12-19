import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { FC } from "react";
import bImg from "../assets/jpg/331643-Firewatch-sunset-forest-mountain.jpg";
import { useHistory } from "react-router-dom";
import birdArea from "../assets/jpg/areacards/hlubockeObory.jpg"
import largeProtectedArea from "../assets/jpg/areacards/jesenniky.jpg"
import smallArea from "../assets/jpg/areacards/libickyLuh.jpg"
import euArea from "../assets/jpg/areacards/krkonose.jpg"
import geopark from "../assets/jpg/areacards/ceskyRaj.jpg"
import bioArea from "../assets/jpg/areacards/bileKarpaty.jpg"

const useStyles = makeStyles((theme) => ({
  backDiv: {
    background: `url(${bImg}) center cover`,
    // width: "100vw",
    // height: "100vh",
    top: 0,
    position: "absolute",
    zIndex: -1,
  },
  title: {
    // left: "100px",
    fontFamily: "Lucida Handwriting, Cursive",
    fontSize: "50px",
    color: theme.palette.secondary.main,
  },
  subtitle: {
    color: theme.palette.secondary.main,
  },
  card: {
    height: "100%"
  },
  media: {
    height: "180px",
  },
  cardActions: {
    display: "flex",
    justifyContent: "center"
  },
  gridContainer: {
    marginTop: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "90%"
  },
}));

type AreaCard = {
  name: string,
  description: string,
  image: string,
  onSelect: () => void
}

const Home: FC = () => {
  const classes = useStyles();

  const history = useHistory();

  const getAreas = (): AreaCard[] => {
    return [
      {
        name: "Bird Areas",
        description: "Areas identified using an internationally agreed set of criteria as being globally important for the conservation of bird populations.",
        image: birdArea,
        onSelect: () => history.push("/map/birdAreas")
      },
      {
        name: "Large Protected Areas",
        description: "Large locations which receive protection because of their recognized natural, ecological or cultural values.",
        image: largeProtectedArea,
        onSelect: () => history.push("/map/largeProtectedAreas")
      },
      {
        name: "Small Protected Areas",
        description: "Smaller locations which receive protection because of their recognized natural, ecological or cultural values.",
        image: smallArea,
        onSelect: () => history.push("/map/smallAreas")
      },
      {
        name: "Natura 2000 EU protected areas",
        description: "Natura 2000 is a network of protected areas covering Europe's most valuable and threatened species and habitats.",
        image: euArea,
        onSelect: () => history.push("/map/euAreas")
      },
      {
        name: "Geoparks",
        description: "Unified areas that advances the protection and use of geological heritage in a sustainable way, and promotes the economic well-being of the people who live there.",
        image: geopark,
        onSelect: () => history.push("/map/geoparks")
      },
      {
        name: "Biospehere Reserves",
        description: "Sites for testing interdisciplinary approaches to understanding and managing changes and interactions between social and ecological systems, including conflict prevention and management of biodiversity.",
        image: bioArea,
        onSelect: () => history.push("/map/bioAreas")
      },
    ]
  }
  //TODO ak background = cover tak tu img div nemusi byt

  return (
    <>
      <Typography className={classes.title}>Trip Planner</Typography>
        <Typography variant={"h5"} className={classes.subtitle}>
          Plan your trip, write down notes, store memories and much more with Trip Planner!
        </Typography>
        <Grid container spacing={5} justify={"center"} className={classes.gridContainer} alignItems={"stretch"}>
          {getAreas().map(areaCard => {
            return (
              <Grid item md={4} sm={6}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={areaCard.image}
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {areaCard.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {areaCard.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.cardActions}>
                    <Button size="small" color="primary" onClick={areaCard.onSelect}>
                      Show on Map
                    </Button>
                  </CardActions>
                </Card>
              </Grid>)
          })}
        </Grid>
      <div className={classes.backDiv} />
    </>
  );
};

export default Home;
