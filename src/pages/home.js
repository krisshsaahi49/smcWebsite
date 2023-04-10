"use client";
import React from "react";
import NameInput from "../components/form/NameInput/NameInput";
import EventDetailsInput from "../components/form/EventDetailsInput";
import RoomSelection from "../components/form/RoomSelection";
import TimeInput from "../components/form/TimeInput/TimeInput";
import GearCheckOut from "../components/GearInput/GearCheckOut";
import CourseInput from "../components/form/CourseInput";
import FormActions from "../components/form/FormActions";
import EventID from "../components/form/EventID";
import Submit from "../components/form/SubmitButton/Submit";
import IframeSlide from "../components/IframeSlide";
import HeaderWithSubtitle from "../components/HeaderWithSubtitle";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { Container, Card, Row, Text, Col, Spacer } from "@nextui-org/react";
import base from "../components/airtable";

const peopleAllInfo = [];
const SMCpeople = [];
const facultyList = [];

const RecordingStudioRoomsList = [];

const RehearsalRoomsList = [];

const ECRoomsList = [];

///////////////////////////////////////////             ///////////////////////////////////////////
///////////////////////////////////////////  API CALLS  ///////////////////////////////////////////
///////////////////////////////////////////             ///////////////////////////////////////////
//const API_KEY = process.env.REACT_APP_API_KEY;

let x = 0;
///////////////////////Pulling records from SMC People///////////////////////
base("SMC People")
  .select({
    view: "ALL PEOPLE",
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      records.forEach(function (record) {
        SMCpeople.push({ name: record.get("Person"), id: record.id });
        peopleAllInfo[x] = {
          id: record.id,
          name: record.get("Person"),
          roomAccess: record.get("Room Access"),
          gearAccess: record.get("Gear Access"),
          phoneNum: record.get("Phone"),
        };

        x = x + 1;

        if (record.get("Role").includes("Faculty/Staff 🎓")) {
          facultyList.push({ name: record.get("Person"), id: record.id });
        }
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
      }
    }
  );

/////////////////////////////////////////// Pulling Records from Rooms  ///////////////////////////////////////////

function getRooms(viewName, roomList) {
  base("Rooms")
    .select({
      view: viewName,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
          roomList.push({
            key: record.id,
            name: record.get("Name"),
            events: record.get("Events"),
          });
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
        }
      }
    );
}

getRooms("Bookable Rooms 🔒 (Studio Booking Form)", RecordingStudioRoomsList);
getRooms("Bookable Rooms 🔒 (Rehearsal Booking Form)", RehearsalRoomsList);
getRooms(
  "Bookable Rooms 🔒 (Edit and Collab Booking Form)-devTeam",
  ECRoomsList
);

export default function Home() {
  // main input data
  const [userSelected, setUserSelected] = React.useState([]);
  const [sessionTitle, setSessionTitle] = React.useState("");
  const [eventTypeSelected, setEventTypeSelected] = React.useState([]);
  const [facultySelected, setFacultySelected] = React.useState([]);
  const [usageSelected, setUsageSelected] = React.useState([]);
  const [roomTypeSelected, setRoomTypeSelected] = React.useState([]);
  const [roomSelected, setRoomSelected] = React.useState([]);
  const [startTimeSelected, setStartTimeSelected] = React.useState("");
  const [endTimeSelected, setEndTimeSelected] = React.useState("");
  const [courseSelected, setCourseSelected] = React.useState([]);
  const [gearSelected, setGearSelected] = React.useState([]);

  // form update or delete
  const [IDerror, setIDError] = React.useState(false);
  const [eventID, setEventID] = React.useState("");
  const [goodID, setGoodID] = React.useState(false);

  // supportive input data
  const [userCount, setUserCount] = React.useState(0);
  const [disabledRoomTypes, setDisabledRoomTypes] = React.useState([]);
  const [timeCorrect, setTimeCorrect] = React.useState(false);
  const [gearList, setGearList] = React.useState([]);
  const [filteredGearList, setFilteredGearList] = React.useState([]);
  const [roomBookingRecord, setRoomBookingRecord] = React.useState([]);

  const [addGear, setAddGear] = React.useState(false);
  const [addCourse, setAddCourse] = React.useState(false);

  // form action
  const [newEvent, setNewEvent] = React.useState(false);
  const [updateEvent, setUpdateEvent] = React.useState(false);
  const [CancelEvent, setCancelEvent] = React.useState(false);

  const Center = {
    background: "#16181A",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const CenterCol = {
    background: "#16181A",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const nameInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 2, fontSize: 22, lineHeight: 2 }}>
        Who is booking?
        <br />
      </Box>

      <Box sx={{ fontsize: "14px" }}>
        <FormLabel component="legend" className="ml-4">
          {" "}
          i.e. takes all responsibility!
        </FormLabel>
      </Box>
      <NameInput
        peopleAllInfo={peopleAllInfo}
        userSelected={userSelected}
        setUserSelected={setUserSelected}
        setUserCount={setUserCount}
        setDisabledRoomTypes={setDisabledRoomTypes}
        setGearList={setGearList}
      />
    </Paper>
  );

  const eventDetailsInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box
        sx={{
          m: 2,
          fontSize: 22,
          lineHeight: 2,
          textAlign: "center",
        }}
      >
        Event Details
      </Box>
      <EventDetailsInput
        facultyList={facultyList}
        setSessionTitle={setSessionTitle}
        setEventTypeSelected={setEventTypeSelected}
        setFacultySelected={setFacultySelected}
        setUsageSelected={setUsageSelected}
      />
      <br />
    </Paper>
  );

  const roomInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "center", m: 2, fontSize: 22, lineHeight: 2 }}>
        Room Selection
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <FormLabel component="legend">
              <Box
                sx={{ textAlign: "left", fontSize: "14px", lineHeight: 1.5 }}
              >
                📌 If the Edit & Collaboration Spaces is selected, option to add
                gear(s) to your booking will be available at the end of the
                form.
              </Box>
            </FormLabel>
          </Grid>
        </Grid>
      </Box>
      <RoomSelection
        roomOptionStudio={RecordingStudioRoomsList}
        roomOptionRehearsal={RehearsalRoomsList}
        roomOptionECspace={ECRoomsList}
        disabledRoomTypes={disabledRoomTypes}
        setRoomTypeSelected={setRoomTypeSelected}
        setRoomSelected={setRoomSelected}
        roomBookingRecord={roomBookingRecord}
        setRoomBookingRecord={setRoomBookingRecord}
      />
      <br />
    </Paper>
  );

  const timeInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 2, fontSize: 22, lineHeight: 2 }}>
        Session Time
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <Box sx={{ fontSize: 20, lineHeight: 1.5 }}>📌</Box>
          </Grid>
          <Grid item xs={11}>
            <FormLabel component="legend">
              Based on your chosen Session Time, we wil notify you with the
              availability of the room(s) selected above.
            </FormLabel>
          </Grid>
        </Grid>
      </Box>
      <TimeInput
        setStartTimeSelected={setStartTimeSelected}
        setEndTimeSelected={setEndTimeSelected}
        setTimeCorrect={setTimeCorrect}
        roomBookingRecord={roomBookingRecord}
        gearList={gearList}
        setFilteredGearList={setFilteredGearList}
      />
      <br />
    </Paper>
  );

  const courseInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <CourseInput
        setCourseSelected={setCourseSelected}
        addCourse={addCourse}
        setAddCourse={setAddCourse}
      />
      <br />
    </Paper>
  );

  const gearInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <GearCheckOut
        setGearSelected={setGearSelected}
        gearList={filteredGearList}
        addGear={addGear}
        setAddGear={setAddGear}
        startTimeSelected={startTimeSelected}
        endTimeSelected={endTimeSelected}
      />
      <br />
    </Paper>
  );

  const SMChours = (
    <Container style={Center}>
      <Card variant="bordered" css={{ mw: "700px" }}>
        <Card.Body>
          <Text size={25} style={Center}>
            SMC Hours & Availability
          </Text>
          <Row style={Center}>
            <Col>
              <Text size={20}>Monday — Friday: </Text>
              <Text>8:00 AM — Midnight</Text>
            </Col>
            <Col>
              <Text size={20}>Saturday & Sunday: </Text>
              <Text>12:00 PM — Midnight</Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Spacer y={1} />
    </Container>
  );

  const formActions = (
    //<Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: 'auto', p: 2 }}>
    <Box m="auto" sx={{ maxWidth: 700, width: "90%" }}>
      <FormActions
        setNewEvent={setNewEvent}
        setUpdateEvent={setUpdateEvent}
        setCancelEvent={setCancelEvent}
        setEventID={setEventID}
        setIDError={setIDError}
        setGoodID={setGoodID}
        setUserSelected={setUserSelected}
      />
      <br />
    </Box>
  );

  const requestEventID = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 1, fontSize: 20, lineHeight: 1.5 }}>
        <Grid container alignItems="flex-start" spacing={1}>
          <Grid item xs={1}>
            📌
          </Grid>
          <Grid item xs={11}>
            <FormLabel component="legend">
              Please enter the Event Record ID you recieved in the confirmation
              email before proceeding to the rest of the form.
            </FormLabel>
          </Grid>
        </Grid>
      </Box>
      <Box m="auto" sx={{ my: 2, display: "flex", alignItems: "center" }}>
        <EventID
          IDerror={IDerror}
          setIDError={setIDError}
          eventID={eventID}
          setEventID={setEventID}
          goodID={goodID}
          setGoodID={setGoodID}
          updateEvent={updateEvent}
          CancelEvent={CancelEvent}
        />
      </Box>
    </Paper>
  );

  return (
    <div style={CenterCol}>
      <HeaderWithSubtitle
        title="Schedule SMC Events"
        subtitle="Everyone can take advantage of scheduling time in the edit &
  collaboration spaces in the SMC building. Approved students
  registered for certain classes have privileges to schedule time in
  the recording studio, rehearsal room and control room."
      />
      {/**<SlideCalendar/> */}

      {SMChours}
      {formActions}
      {updateEvent && <Grow in={updateEvent}>{requestEventID}</Grow>}
      {CancelEvent && <Grow in={CancelEvent}>{requestEventID}</Grow>}
      <Grow in={newEvent || (updateEvent && goodID)}>{nameInput}</Grow>
      {userCount > 0 && (newEvent || (updateEvent && goodID)) && (
        <IframeSlide src="https://airtable.com/embed/shr7XfOauvLgRzajc" />
      )}
      {userCount > 0 && (newEvent || (updateEvent && goodID)) && (
        <Grow in={userCount > 0}>{eventDetailsInput}</Grow>
      )}
      {userCount > 0 && (newEvent || (updateEvent && goodID)) && (
        <Grow in={userCount > 0}>{roomInput}</Grow>
      )}
      {userCount > 0 &&
        (newEvent || (updateEvent && goodID)) &&
        roomSelected.length !== 0 && (
          <Grow in={userCount > 0}>{timeInput}</Grow>
        )}
      <Grow in={newEvent || (updateEvent && goodID)}>{courseInput}</Grow>
      {userCount > 0 &&
        timeCorrect &&
        (newEvent || (updateEvent && goodID)) && (
          <Grow in={userCount > 0}>{gearInput}</Grow>
        )}
      {userCount > 0 && (newEvent || (updateEvent && goodID)) && (
        <Submit
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          sessionTitle={sessionTitle}
          setSessionTitle={setSessionTitle}
          eventTypeSelected={eventTypeSelected}
          setEventTypeSelected={setEventTypeSelected}
          facultySelected={facultySelected}
          setFacultySelected={setFacultySelected}
          usageSelected={usageSelected}
          setUsageSelected={setUsageSelected}
          roomTypeSelected={roomTypeSelected}
          setRoomTypeSelected={setRoomTypeSelected}
          roomSelected={roomSelected}
          setRoomSelected={setRoomSelected}
          startTimeSelected={startTimeSelected}
          setStartTimeSelected={setStartTimeSelected}
          endTimeSelected={endTimeSelected}
          setEndTimeSelected={setEndTimeSelected}
          courseSelected={courseSelected}
          setCourseSelected={setCourseSelected}
          gearSelected={gearSelected}
          setGearSelected={setGearSelected}
          eventID={eventID}
          setEventID={setEventID}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          updateEvent={updateEvent}
          setUpdateEvent={setUpdateEvent}
          CancelEvent={CancelEvent}
          setCancelEvent={setCancelEvent}
          setAddCourse={setAddCourse}
          setAddGear={setAddGear}
          setUserCount={setUserCount}
          timeCorrect={timeCorrect}
          roomBookingRecord={roomBookingRecord}
        />
      )}
      <br />
    </div>
  );
}
