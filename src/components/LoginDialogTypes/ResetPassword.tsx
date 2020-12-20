import { Container, CssBaseline, makeStyles, Typography, TextField, Button } from "@material-ui/core";
import React, { FC, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { LoginDialogType } from "../LogInDialog";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export interface IResetPasswordProps {
  onFormChange: (type: LoginDialogType) => void;
  onClose: () => void;
}

export const ResetPassword: FC<IResetPasswordProps> = (props) => {
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const classes = useStyles();
  const firebase = useFirebase();

  const resetPassword = () =>
    firebase
      .auth()
      .sendPasswordResetEmail(user)
      .then(() => setInfo("Email with request to password change has been sent"))
      .catch((e) => setError(e.message));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forgot your password?
        </Typography>
        <Typography>Please enter the e-mail address used to register. We will send you an email to reset your password</Typography>
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
        {error && (
          <Typography variant="subtitle2" align="left" color="error" paragraph>
            <b>{error}</b>
          </Typography>
        )}
        {info && (
          <Typography variant="subtitle2" color="secondary" align="left" paragraph>
            <b>{info}</b>
          </Typography>
        )}
        <Button className={classes.submit} onClick={() => resetPassword()} fullWidth variant="contained" color="primary">
          Send
        </Button>
        <Button className={classes.submit} onClick={() => props.onFormChange("SignIn")} fullWidth variant="contained" color="secondary">
          Back
        </Button>
      </div>
    </Container>
  );
};
