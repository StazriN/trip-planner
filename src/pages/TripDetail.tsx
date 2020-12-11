import React, {ChangeEvent, FC, useEffect, useState} from 'react';
import {Trip} from "../utils/types";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

import {
  CircularProgress, Fab, Grid,
  GridList,
  GridListTile,
  GridListTileBar, Icon, IconButton,
  ListSubheader,
  makeStyles, Paper, Snackbar, TextareaAutosize, TextField
} from "@material-ui/core";
import TripPlaceholder from '../assets/jpg/TripPlaceholder.jpg';
import Typography from "@material-ui/core/Typography";
import {connect, useSelector} from "react-redux";
import {RootState} from "../redux";
import {useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {useHistory} from "react-router-dom";
import DatePicker from "react-datepicker";
import {PlusOne} from "@material-ui/icons";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  paper: {
    color: theme.palette.secondary.main,
    width: '50%',
    padding: '30px'
  },
  gridList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  loader: {position: 'fixed', left: '50%', top: '50%'},
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
  }
}))

const mapStateToProps = ({selectedTrip}: RootState) => {
  return {selectedTrip};
};

type TripDetailProps = ReturnType<typeof mapStateToProps>;

const TripDetail: FC<TripDetailProps> = ({selectedTrip}) => {
  const classes = useStyles();

  const {uid} = useSelector((state: RootState) => state.firebase.auth);
  const [trip, setTrip] = useState<Trip>();
  const [name, setName] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Array<string>>([]);
  const [snackbarOpen, setSnackbarShown] = React.useState(false);

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
    }
  }, [trip])

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

    firestore
      .collection('users')
      .doc(uid)
      .collection('trips')
      .doc(trip.id)
      .update({
        date,
        notes
      }).then(() => {
      setSnackbarShown(true)
    })
  };

  const onDeleteClick = () => {
    if (!selectedTrip?.id) {
      return
    }

    firestore
      .collection('users')
      .doc(uid)
      .collection('trips')
      .doc(selectedTrip.id)
      .delete()
      .then(() => history.push('/trips'))
  }

  const onSnackbarClose = () => {
    setSnackbarShown(false)
  }

  return (
    <>
      {!trip && <CircularProgress className={classes.loader}/>}
      {trip &&
      <Paper className={classes.paper}>
        <Typography variant={'h4'}>
          {trip.name} - {trip.areaName}
        </Typography>
        <Grid container direction={'column'}>
          <Grid item>
            <Typography variant={'h5'} align={'left'}>Name:</Typography>
            <TextField value={name} className={classes.nameInput} onChange={(e) => setName(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography variant={'h5'} align={'left'}>Trip Date:</Typography>
            <Grid item className={classes.dateInputContainer}>
              <DatePicker className={classes.dateInput} selected={date} onChange={(date: Date | null) => setDate(date ?? new Date())}/>
            </Grid>
          </Grid>
          {/*Notes*/}
          <Grid item>
            <Typography variant={'h5'} align={'left'}>Notes:</Typography>
            {notes.map((note, index) => (
            <Grid item>
              <TextareaAutosize className={classes.note} aria-label="empty textarea" rowsMin={3} placeholder="Empty" value={note} onChange={(e) => onNoteChange(index, e)}/>
            </Grid>
          ))}
          </Grid>
          {/*Add Note*/}
          <Grid item>
            <Fab onClick={onAddNoteClick} className={classes.fab}>
              <AddIcon/>
            </Fab>
          </Grid>
        </Grid>
        {/*Delete and Save*/}
        <Grid container alignItems={'flex-start'} spacing={1}>
          <Grid item>
          <Fab onClick={onDeleteClick}>
            <RemoveIcon/>
          </Fab>
          </Grid>
          <Grid item>
          <Fab onClick={onSaveClick}>
            <SaveIcon/>
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
              <CloseIcon fontSize="small"/>
            </IconButton>
          </>
        }
      />
    </>
  );
}

export default connect(mapStateToProps)(TripDetail);
