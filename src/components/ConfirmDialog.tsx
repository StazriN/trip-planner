import React, { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@material-ui/core";
import { useWindowSize } from "../hooks/useWindowSize";

type ConfirmDeleteDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  text: string;
};

const ConfirmDialog: FC<ConfirmDeleteDialogProps> = ({ onConfirm, onCancel, open, text }) => {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" autoFocus>
          No
        </Button>
        <Button onClick={onConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
