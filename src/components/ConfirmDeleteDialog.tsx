import React, {FC} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from "@material-ui/core";

type ConfirmDeleteDialogProps = {
  onConfirm: () => void,
  onCancel: () => void,
  open: boolean
}

const ConfirmDeleteDialog: FC<ConfirmDeleteDialogProps> = ({onConfirm, onCancel, open}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Trip"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the trip?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>);
};

export default ConfirmDeleteDialog;
