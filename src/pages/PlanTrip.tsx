import {connect, useSelector} from "react-redux";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useHistory} from "react-router-dom";
import {RootState} from "../redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {CardActions, TextareaAutosize} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useFirestore} from "react-redux-firebase";

const mapStateToProps = ({areas}: RootState) => {
  return {areas};
};

type PlanTripProps = ReturnType<typeof mapStateToProps>;

const PlanTrip: React.FC<PlanTripProps> = ({areas}) => {
  const [name, setName] = useState<string>("My Trip");
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState<string>("I should take some beers...");

  const history = useHistory();
  const firestore = useFirestore();
  const {uid} = useSelector((state: RootState) => state.firebase.auth);

  const handleClose = () => {
    history.push('/map')
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

  const submit = () => {
    const area = areas.clickedArea;

    if (!area) {
      return;
    }

    firestore
      .collection('users')
      .doc(uid)
      .collection('trips')
      .add({
        areaId: area.id,
        areaName: area.name,
        position: area.position,
        name,
        date,
        notes: [note]
      })
      .then(() =>
        history.push('map')
      )
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1">
            Plan your trip
          </Typography>
          <Typography variant="h6">
            {areas.clickedArea?.name}
          </Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={onNameChange}
          />
          <Typography variant="subtitle2" align='left'>Date</Typography>

          <DatePicker selected={date} onChange={onDateChange}/>
          <br/>
          <br/>
          <Typography variant="subtitle2" align='left' paragraph={true}>Note</Typography>
          <TextareaAutosize aria-label="empty textarea" placeholder="Empty" value={note} onChange={onNoteChange}/>
        </CardContent>
        <CardActions>
          <Button onClick={handleClose}>
            Close
          </Button>
          <Button onClick={submit}>
            Submit
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default connect(mapStateToProps)(PlanTrip);
