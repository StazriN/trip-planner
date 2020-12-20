import React, { FC, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useFirebase } from "react-redux-firebase";
import { LoginDialogType } from "../LogInDialog";

//Took from: https://material-ui.com/getting-started/templates/

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
  formGrid: {
    marginBottom: 5,
  },
  link: {
    cursor: "pointer",
  },
}));

export interface ISignUpProps {
  onClose: () => void;
  onFormChange: (type: LoginDialogType) => void;
}

export const SignUp: FC<ISignUpProps> = (props) => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const classes = useStyles();

  const firebase = useFirebase();

  const signUp = (email: string, password: string) =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        //If passed User from createUserWithEmailAndPassword code is not working - returns userCredentials not User
        const user = firebase.auth().currentUser;
        if (user)
          user
            .updateProfile({
              displayName: `${name} ${surname}`,
            })
            .catch((e) => console.log(e));
        props.onClose();
      })
      .catch((err: any) => setError(err.message));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div className={classes.form}>
          <Grid className={classes.formGrid} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={name}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={surname}
                variant="outlined"
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="surname"
                onChange={(e) => setSurname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={user}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setUser(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={password}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          {error && (
            <Typography variant="subtitle2" align="left" color="error" paragraph>
              <b>{error}</b>
            </Typography>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <Link className={classes.link} onClick={() => props.onFormChange("SignIn")} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <Button className={classes.submit} onClick={() => signUp(user, password)} type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
          <Button className={classes.submit} onClick={props.onClose} type="submit" fullWidth variant="contained" color="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
};
