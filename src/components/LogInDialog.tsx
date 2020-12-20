import { DialogContent, Dialog, useTheme, useMediaQuery } from "@material-ui/core";
import React, { useState } from "react";
import { FC } from "react";
import { ResetPassword } from "./LoginDialogTypes/ResetPassword";
import { SignIn } from "./LoginDialogTypes/SignIn";
import { SignUp } from "./LoginDialogTypes/SignUp";

export interface ILogInDialogProps {
  open: boolean;
  onClose: () => void;
}

export type LoginDialogType = "SignIn" | "SignUp" | "Reset";

export const LogInDialog: FC<ILogInDialogProps> = (props) => {
  const [type, setType] = useState<LoginDialogType>("SignIn");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog fullScreen={fullScreen} open={props.open}>
      <DialogContent>
        {type === "SignIn" && <SignIn onClose={props.onClose} onFormChange={(type: LoginDialogType) => setType(type)} />}
        {type === "SignUp" && <SignUp onClose={props.onClose} onFormChange={(type: LoginDialogType) => setType(type)} />}
        {type === "Reset" && <ResetPassword onClose={props.onClose} onFormChange={(type: LoginDialogType) => setType(type)} />}
      </DialogContent>
    </Dialog>
  );
};
