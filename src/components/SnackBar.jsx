import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackBar = ({ open, setOpen, text, type }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
    >
      <Alert onClose={() => setOpen(false)} severity={type}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;