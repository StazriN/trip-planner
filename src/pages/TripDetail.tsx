import React, { FC, useEffect, useState } from "react";
import { Trip } from "../utils/types";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Snackbar,
  TextField,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import { storage } from "../index";
import Notfound from "./NotFound";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.dark,
  },
  notchedOutline: {
    borderColor: theme.palette.primary.dark,
  },
  input: {
    backgroundColor: "#ffffffad",
  },
  paper: {
    color: theme.palette.secondary.main,
    width: "50%",
    padding: "30px",
  },
  loader: { position: "fixed", left: "50%", top: "50%" },
  nameInput: {
    width: "50%",
  },
  dateInput: {
    width: "50%",
    backgroundColor: "transparent",
    borderStyle: "none",
    fontSize: "24px",
  },
  fab: {
    marginTop: "10px",
    height: "35px",
    width: "35px",
  },
  delete: {
    backgroundColor: "#ff1744",
  },
  image: {
    width: "200px",
    height: "auto",
    display: "block",
  },
  note: {
    marginTop: "20px",
    backgroundColor: "#ffffffad",
  },
  hiddenInput: {
    display: "none",
  },
  topMargin: {
    marginTop: "30px",
  },
}));

const TripDetail: FC<{ tripId: string }> = ({ tripId }) => {
  const classes = useStyles();

  const { uid } = useSelector((state: RootState) => state.firebase.auth);
  const [trip, setTrip] = useState<Trip>();
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Array<string>>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [pictures, setPictures] = useState<Array<string>>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  const firestore = useFirestore();
  const history = useHistory();

  useFirestoreConnect({
    collection: `users/${uid}/trips`,
    storeAs: "trips",
  });

  const trips: Array<Trip> = useSelector((state: RootState) => state.firestore.data.trips);

  useEffect(() => {
    if (trips) {
      const trip = Object.values(trips).find((trip) => trip?.id === tripId);
      if (trip) {
        setTrip(trip);
      } else {
        setNotFound(true);
      }
    }
  }, [trips, tripId]);

  useEffect(() => {
    const downloadImagesAsync = async (tripId: string) => {
      const list = await storage.ref(`/users/${uid}/images/${tripId}/`).listAll();
      const pictures: Array<string> = [];

      await list.items.reduce(async (promise, imageRef) => {
        await promise;
        const url = await imageRef.getDownloadURL();
        pictures.push(url);
      }, Promise.resolve());

      return pictures;
    };

    if (trip) {
      setName(trip.name);
      setDate(trip.date.toDate());
      setNotes(trip.notes);
      downloadImagesAsync(trip.id)
        .then((pictures) => setPictures(pictures))
        .catch((err) => console.log(err));
    }
  }, [trip, uid]);

  const onDateChange = (date: Date | null) => {
    setDate(date ?? new Date());
  };

  const onNoteChange = (index: number, e: any) => {
    setNotes([...notes.slice(0, index), e.target.value, ...notes.slice(index + 1)]);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onAddNoteClick = () => {
    setNotes(notes.concat(""));
  };

  const onSaveClick = () => {
    if (!trip) {
      return;
    }

    firestore
      .collection("users")
      .doc(uid)
      .collection("trips")
      .doc(trip.id)
      .update({
        name,
        date,
        notes,
      })
      .then(() => {
        setSnackbarOpen(true);
      });
  };

  const onDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  function handleImageChange(e: any) {
    const file = e.target.files[0];
    if (!file || !trip) {
      return;
    }

    storage
      .ref(`/users/${uid}/images/${trip.id}/${file.name}`)
      .put(file)
      .on("state_changed", console.log, console.error, () =>
        setTimeout(() => {
          storage
            .ref("users")
            .child(uid)
            .child("images")
            .child(trip.id)
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
              setPictures([...pictures, url]);
            })
            .catch((err) => console.log(err));
        }, 1000)
      );
  }

  const onDeleteConfirm = () => {
    setTrip(undefined);
    setConfirmDeleteOpen(false);

    firestore
      .collection("users")
      .doc(uid)
      .collection("trips")
      .doc(tripId)
      .delete()
      .then(() => history.push("/trips"));
  };

  const onDeleteCancel = () => {
    setConfirmDeleteOpen(false);
  };

  const deleteFromPictures = (pic: string) => {
    const index = pictures.indexOf(pic, 0);
    if (index > -1) {
      pictures.splice(index, 1);
    }
    return pictures;
  };

  const deletePicture = (picture: string) => {
    if (!trip) {
      return;
    }
    const imagePath: string = getPathStorageFromUrl(picture);
    storage
      .ref(`${imagePath}`)
      .delete()
      .then(function () {
        setPictures([...deleteFromPictures(picture)]);
      })
      .catch(function (error) {
        console.log("delete fail ", error);
        throw new Error(error);
      });
    handleCloseDialog();
  };

  function getPathStorageFromUrl(url: String) {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/trip-planner-831cc.appspot.com/o/";
    let imagePath: string = url.replace(baseUrl, "");
    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath.substring(0, indexOfEndPath);
    imagePath = imagePath.replaceAll("%2F", "/");
    return imagePath;
  }

  // Trip not found
  if (notFound) {
    return <Notfound />;
  }

  return (
    <>
      <Container maxWidth={false}>
        {!trip && <CircularProgress className={classes.loader} />}
        {trip && (
          <Paper className={classes.paper}>
            <Typography className={classes.title} variant="h5">
              {trip.areaName} - {trip.name}
            </Typography>
            <Grid container direction={"column"}>
              <Grid item>
                <TextField
                  InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
                  label="Name"
                  id="tripName"
                  name="name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    margin="normal"
                    inputVariant="outlined"
                    id="date-picker"
                    label="Date"
                    format="MM/dd/yyyy"
                    value={date}
                    onChange={onDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    InputProps={{ className: classes.input, classes: { notchedOutline: classes.notchedOutline } }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              {/*Notes*/}
              <Grid item>
                <Typography variant="h6" align={"left"}>
                  Notes
                </Typography>
                {notes.map((note, index) => (
                  <TextField
                    id={`Note ${index + 1}`}
                    label={`Note ${index + 1}`}
                    fullWidth={true}
                    multiline
                    variant="outlined"
                    className={classes.note}
                    value={note}
                    onChange={(e) => onNoteChange(index, e)}
                  />
                ))}
              </Grid>
              {/*Add Note*/}
              <Grid item>
                <Fab onClick={onAddNoteClick} className={classes.fab}>
                  <AddIcon />
                </Fab>
              </Grid>
            </Grid>
            {/* Pictures*/}
            <Grid container direction={"column"}>
              <Grid item>
                <Typography variant={"h5"} align={"left"}>
                  Photos
                </Typography>
                {pictures.map((picture, index) => (
                  <Grid item>
                    {/* <img className={classes.image} id={picture} alt={picture} src={picture} height={200} width={200} onClick={() => deletePicture(picture)}/> */}
                    <img className={classes.image} id={picture} alt={picture} src={picture} height={200} width={200} onClick={() => handleOpenDialog()} />
                    {/* Delete picture confirmation dialog  */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                      <DialogTitle id="alert-dialog-title">{"Delete picture"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">Are you sure you want to delete this picture?</DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => deletePicture(picture)} color="primary">
                          Yes
                        </Button>
                        <Button onClick={handleCloseDialog} color="primary" autoFocus>
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                ))}

                <Grid item>
                  <input accept="image/jpeg, image/png" className={classes.hiddenInput} id="icon-button-file" type="file" onChange={handleImageChange} />
                  <label htmlFor="icon-button-file">
                    <Button variant="contained" color="default" component="span" startIcon={<CloudUploadIcon />}>
                      Upload
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </Grid>
            {/*Delete and Save*/}
            <Grid container className={classes.topMargin} direction={"row"} alignItems={"flex-start"} spacing={1}>
              <Grid item>
                <Button variant="contained" color="default" component="span" startIcon={<SaveIcon />} onClick={onSaveClick}>
                  Save Changes
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="default" component="span" className={classes.delete} startIcon={<RemoveIcon />} onClick={onDeleteClick}>
                  Delete Trip
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
        {/*Saved info snackbar*/}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="Changes successfully saved."
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        {/*Confirm delete dialog*/}
        <ConfirmDialog onConfirm={onDeleteConfirm} onCancel={onDeleteCancel} open={confirmDeleteOpen} text={"Are you sure you want to delete the trip?"} />
      </Container>
    </>
  );
};

export default TripDetail;
