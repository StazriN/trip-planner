import React, { FC, useEffect, useState } from 'react';
import { Trip } from "../utils/types";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import {
  CircularProgress, Fab, Grid,
  IconButton,
  makeStyles, Paper, Snackbar, TextareaAutosize, TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { connect, useSelector } from "react-redux";
import { RootState } from "../redux";
import { useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import { storage } from '../index'
import firebase from 'firebase';

const useStyles = makeStyles(theme => ({
  paper: {
    color: theme.palette.secondary.main,
    width: '50%',
    padding: '30px'
  },
  loader: { position: 'fixed', left: '50%', top: '50%' },
  dateInputContainer: {
    border: '0px',
    borderBottom: '1px',
    borderStyle: 'solid',
    height: '50px',
    borderRadius: '0 10px 0 0',
    align: 'center'
  },
  nameInput: {
    width: '50%',
  },
  dateInput: {
    width: '50%',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    fontSize: '24px',
  },
  note: {
    width: '50%'
  },
  fab: {
    height: '35px',
    width: '35px'
  },
  delete: {
    backgroundColor: '#ff1744'
  },
  image: {
    width: '200px',
    height: 'auto',
    display: 'block',
  }
}))

const mapStateToProps = ({ selectedTrip }: RootState) => {
  return { selectedTrip };
};

let  imageUrls: string[] = [];
let picsReady = false;

type TripDetailProps = ReturnType<typeof mapStateToProps>;

const TripDetail: FC<TripDetailProps> = ({ selectedTrip }) => {
  const classes = useStyles();

  const { uid } = useSelector((state: RootState) => state.firebase.auth);
  const [trip, setTrip] = useState<Trip>();
  const [name, setName] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Array<string>>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [pictures, setPictures] = useState<Array<string>>([]);
  const [file, setFile] = useState<File>();
  const [url, setURL] = useState("");

  const firestore = useFirestore();
  const history = useHistory();

  const trips: Array<Trip> = useSelector((state: RootState) => state.firestore.data.trips);

  useEffect(() => {
    if (selectedTrip?.id) {
      setTrip(Object.values(trips).find(trip => trip.id === selectedTrip.id))
    }
  }, [selectedTrip, trips])

  useEffect(() => {
    if (trip) {
      setName(trip.name)
      setDate(trip.date.toDate())
      setNotes(trip.notes)

      storage.ref(`/images/${trip.id}/`).listAll().then(function (result) {
        const numOfPics = result.items.length;
        result.items.forEach(function (imageRef) {
          getImageRef(imageRef, numOfPics);
        });
      }).catch(
        error => {
          throw new Error(error);
        });

    }
  }, [trip]);

  const getImageRef = (imageRef: firebase.storage.Reference, numOfPics: number) => {
    imageRef.getDownloadURL().then(function (url: string) {
      setPictures([...pictures, url]);
      imageUrls.push(url);
      console.log(url);
    }).then(() => {
      console.log(imageUrls);
      if (imageUrls.length === numOfPics) {
        picsReady = true;
        console.log("all pics loaded from urls");
        console.log(pictures);
      }
    }).catch(function (error: any) {
      throw new Error(error);
    });
  }

  const onNoteChange = (index: number, e: any) => {
    setNotes([...notes.slice(0, index), e.target.value, ...notes.slice(index + 1)]);
  };

  const onAddNoteClick = () => {
    setNotes(notes.concat(""));
  };

  const onSaveClick = () => {
    if (!trip) {
      return
    }

    handleUpload();

    firestore
      .collection('users')
      .doc(uid)
      .collection('trips')
      .doc(trip.id)
      .update({
        date,
        notes,
      }).then(() => {
        setSnackbarOpen(true)
      })
  };

  const onDeleteClick = () => {
    if (!selectedTrip?.id) {
      return
    }

    setConfirmDeleteOpen(true)
  }

  function handleImageChange(e: any) {
    setFile(e.target.files[0]);
  }

  function handleUpload() {
    if (!file) {
      return
    }
    const uploadTask = storage.ref(`/images/${trip?.id}/${file.name}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
          setFile({} as File);
          setURL(url);
        });
    });

  }

  const onDeleteConfirm = () => {
    firestore
      .collection('users')
      .doc(uid)
      .collection('trips')
      .doc(selectedTrip.id)
      .delete()
      .then(() => history.push('/trips'))
  }

  const onDeleteCancel = () => {
    setConfirmDeleteOpen(false)
  }

  const onSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      {!trip && <CircularProgress className={classes.loader} />}
      {trip &&
        <Paper className={classes.paper}>
          <Typography variant={'h4'}>
            {trip.name} - {trip.areaName}
          </Typography>
          <Grid container direction={'column'}>
            <Grid item>
              <Typography variant={'h5'} align={'left'}>Name:</Typography>
              <TextField value={name} className={classes.nameInput} onChange={(e) => setName(e.target.value)} />
            </Grid>
            <Grid item>
              <Typography variant={'h5'} align={'left'}>Trip Date:</Typography>
              <Grid item className={classes.dateInputContainer}>
                <DatePicker className={classes.dateInput} selected={date} onChange={(date: Date | null) => setDate(date ?? new Date())} />
              </Grid>
            </Grid>
            {/*Notes*/}
            <Grid item>
              <Typography variant={'h5'} align={'left'}>Notes:</Typography>
              {notes.map((note, index) => (
                <Grid item>
                  <TextareaAutosize className={classes.note} aria-label="empty textarea" rowsMin={3} placeholder="Empty" value={note} onChange={(e) => onNoteChange(index, e)} />
                </Grid>
              ))}
            </Grid>
            {/*Add Note*/}
            <Grid item>
              <Fab onClick={onAddNoteClick} className={classes.fab}>
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
          {/* Pictures Preview*/}
          {pictures && (pictures.length != 0) &&
            <Grid container direction={'column'}>
              <Grid item>
                <Typography variant={'h5'} align={'left'}>Pictures:</Typography>
                {/* {imageUrls.map((url) => (
                  <Typography variant={'h5'} align={'left'}>{url}</Typography>
                ))} */}
                {picsReady &&
                  imageUrls.map((picture) => (
                    <Grid item>
                      <img className={classes.image} src={`${picture}`} height={200} width={200} />
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          }
          {/* Add Pictures */}
          <Grid container direction="row">
            <Grid item>
              <Typography variant={'h5'} align={'left'}>Upload Picture:</Typography>
              <Grid item>
                <form>
                  <input type="file" onChange={handleImageChange} />
                </form>
                <img src={url} alt="" />
              </Grid>
            </Grid>
          </Grid>
          {/*Delete and Save*/}
          <Grid container alignItems={'flex-start'} spacing={1}>
            <Grid item>
              <Fab onClick={onSaveClick}>
                <SaveIcon />
              </Fab>
            </Grid>
            <Grid item>
              <Fab onClick={onDeleteClick} className={classes.delete}>
                <RemoveIcon />
              </Fab>
            </Grid>
          </Grid>
        </Paper>}
      {/*Saved info snackbar*/}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={onSnackbarClose}
        message="Changes successfully saved."
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={onSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
      {/*Confirm delete dialog*/}
      <ConfirmDeleteDialog onConfirm={onDeleteConfirm} onCancel={onDeleteCancel} open={confirmDeleteOpen} />
    </>
  );
}

export default connect(mapStateToProps)(TripDetail);
