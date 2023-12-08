import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@nextui-org/react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

async function UpdateRecord(eventID) {
	const url = `/api/updateRecord/${eventID}`; 
  
	const requestOptions = {
	  method: 'PATCH',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		"Status": "Canceled ⛔️"
	  })
	};
  
	try {
	  const response = await fetch(url, requestOptions);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  const data = await response.json();
	} catch (err) {
	  console.error('Error updating record:', err);
	  // Handle errors here
	}
  }
  

const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      horizontal="center"
      {...props}
    />
  );
});

export default function EventID({
  IDerror,
  setIDError,
  eventID,
  setEventID,
  setGoodID,
  updateEvent,
  CancelEvent,
  fetchEventData
}) {
  const [successMsg, setSuccessMsg] = React.useState(false);
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);
  const [openCancelSuccess, setOpenCancelSuccess] = React.useState(false);

const fetchAllRecords = async () => {
	let allRecords = [];
	let nextPage = 1; // Start with page 1
  
	while (nextPage) {
	  const response = await fetch(`/api/proxy?page=${nextPage}`);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
  
	  const data = await response.json();
	  allRecords = allRecords.concat(data.results);
	  nextPage = data.next ? nextPage + 1 : null; // Update nextPage, or set to null to end loop
	}
  
	return allRecords;
  };  

  const handleCheckID = async () => {
    try {
      const records = await fetchAllRecords();
      const record = records.find(
        (record) => record["Event Record ID"] === eventID
      );

      if (record) {
        fetchEventData(eventID);
        setIDError(false);
        setGoodID(true);
        if (updateEvent) setSuccessMsg(true);
        if (CancelEvent) setOpenCancelDialog(true);
      } else {
        setIDError(true);
        setGoodID(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setIDError(true);
      setGoodID(false);
    }
  };

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMsg(false);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCloseCancelSubmission = () => {
    setOpenCancelSuccess(false);
  };

  const handleSubmitCancellation = () => {
    UpdateRecord(eventID);
    setOpenCancelDialog(false);
    setOpenCancelSuccess(true);

    // initialize ID status
    setEventID("");
    setIDError(false);
    setGoodID(false);
  };

  const confirmCancelDialog = (
    <Dialog
      open={openCancelDialog}
      keepMounted
      onClose={handleCloseCancelDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Are you sure to cancel this event?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Once an event is cancelled, the action cannot be undone. Click Yes to
          proceed the cancellation.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          bordered
          shadow
          color="primary"
          auto
          onClick={handleSubmitCancellation}
        >
          Yes
        </Button>
        <Button
          bordered
          shadow
          color="primary"
          auto
          onClick={handleCloseCancelDialog}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );

  const succesCancellation = (
    <Modal
      open={openCancelSuccess}
      onClose={handleCloseCancelSubmission}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cancellation Successful!
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please check your inbox for the confirmation.
        </Typography>
      </Box>
    </Modal>
  );

  return (
    <Box className="m-auto flex flex-col items-center justify-center">
      <Box component="form" noValidate autoComplete="off">
        <TextField
          variant="standard"
          error={IDerror}
          label={IDerror ? "Error" : "Event Record ID"}
          helperText={IDerror ? "ID does not exist in the system :(" : ""}
          value={eventID}
          size="small"
          onChange={(event) => {
            setEventID(event.target.value);
          }}
          fullWidth
        />
      </Box>
      <br />
      <Button
        shadow
        bordered
        color="warning"
        auto
        disabled={!eventID}
        onClick={handleCheckID}
      >
        confirm
      </Button>
      {successMsg && (
        <Snackbar
          open={successMsg}
          autoHideDuration={200}
          onClose={handleCloseMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success">
            Your booking record was found! Please re-fill up this form to update
            us about your booking :)
          </Alert>
        </Snackbar>
      )}
      {confirmCancelDialog}
      {succesCancellation}
    </Box>
  );
}
