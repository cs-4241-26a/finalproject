import { useModel } from '../context/ModelContext';
import { Alert, Snackbar, type SnackbarCloseReason } from "@mui/material";

export default function AlertBar() {
  const {
    alertOpen,
    alertText,
    alertSeverity,
    setAlertOpen
  } = useModel();

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setAlertOpen(false);
  };

  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={alertSeverity} variant="filled">
        {alertText}
      </Alert>
    </Snackbar>
  );
}