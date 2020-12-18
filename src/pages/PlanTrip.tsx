import { connect, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { RootState, store } from "../redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { CardActions, makeStyles, TextareaAutosize } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useFirestore } from "react-redux-firebase";
import { reinitializeWeather, setRightPanelContext, setWeatherLocation } from "../redux/actions";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  notchedOutline: { borderColor: theme.palette.primary.dark },
  input: { backgroundColor: "#ffffffad" },
}));

const mapStateToProps = ({ areas }: RootState) => {
  return { areas };
};

type PlanTripProps = ReturnType<typeof mapStateToProps>;

const PlanTrip: React.FC<PlanTripProps> = ({ areas }) => {
  const [name, setName] = useState<string>("My Trip");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState<string>("I should take some beers...");

  const history = useHistory();
  const firestore = useFirestore();
  const { uid } = useSelector((state: RootState) => state.firebase.auth);

  const classes = useStyles();

  const handleClose = () => {
    // TODO
  };

  const onDateChange = (date: Date | null) => {
    setDate(date ?? new Date());
  };

  const onNameChange = (e: any) => {
    setName(e.target.value);
  };

  const onNoteChange = (e: any) => {
    setNote(e.target.value);
  };

  const openWeather = () => {
    store.dispatch(reinitializeWeather(true));
    store.dispatch(setRightPanelContext("weather", true));
  };

  const submit = () => {
    const area = areas.clickedArea;

    if (!area) {
      return;
    }

    firestore
      .collection("users")
      .doc(uid)
      .collection("trips")
      .add({
        areaId: area.id,
        areaName: area.name,
        position: area.position,
        name,
        date,
        notes: [note],
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
        });
      })
      .then(() => history.push("/"));
  };

  return (
    <>
      <Card style={{ height: "100%" }}>
        <CardContent>
          <Typography color="secondary" variant="h6" component="h1">
            Plan your trip to:
          </Typography>
          <Typography color="secondary" variant="h5">
            {areas.clickedArea?.name}
          </Typography>
          <TextField
            InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={onNameChange}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              margin="normal"
              inputVariant="outlined"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              value={date}
              onChange={onDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
            variant="outlined"
            id="standard-multiline-flexible"
            label="Note"
            multiline
            fullWidth
            rowsMax={4}
            value={note}
            onChange={onNoteChange}
          />
        </CardContent>

        <CardActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={submit}>Submit</Button>
          <Button onClick={openWeather}>Weather</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default connect(mapStateToProps)(PlanTrip);
