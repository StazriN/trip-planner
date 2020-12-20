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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
  link: {
    cursor: "pointer",
  },
}));

export interface ISignInProps {
  onClose: () => void;
  onFormChange: (type: LoginDialogType) => void;
}

export const SignIn: FC<ISignInProps> = (props) => {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const classes = useStyles();
  const firebase = useFirebase();

  const signIn = (email: string, password: string) =>
    firebase
      .login({
        email: email,
        password: password,
      })
      .then(() => props.onClose())
      .catch((err: any) => setError(err.message));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <div className={classes.form}>
          <TextField
            value={user}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setUser(e.target.value)}
          />
          <TextField
            value={password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="subtitle2" align="left" color="error" paragraph>
              <b>{error}</b>
            </Typography>
          )}

          <Grid container>
            <Grid item xs>
              <Link className={classes.link} variant="body2" onClick={() => props.onFormChange("Reset")}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link className={classes.link} onClick={() => props.onFormChange("SignUp")} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
          <Button
            className={classes.submit}
            onClick={() => signIn(user, password).catch((err: any) => setError(err.message))}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Button className={classes.submit} onClick={props.onClose} type="submit" fullWidth variant="contained" color="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
};
