import React, { useEffect, useState } from "react";
import baserow from "../components/baserow";
import NameInput from "../components/NameInput";
import EventDetailsInput from "../components/EventDetailsInput";
import RoomSelection from "../components/RoomSelection";
import TimeInput from "../components/TimeInput";
import GearCheckOut from "../components/GearCheckOut";
import CourseInput from "../components/CourseInput";
import FormActions from "../components/FormActions";
import EventID from "../components/EventID";
import Submit from "../components/Submit";
import ParallaxBackground from "../components/ParallaxBackground";
import IframeSlide from "../components/IframeSlide";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormLabel from "@mui/material/FormLabel";

let peopleAllInfo = [];
let SMCpeople = [];
let facultyList = [];

const fetchPeopleData = async () => {
  try {
    const tableID = 212624; // Replace with your Baserow table ID
    const table = baserow.table(tableID);

    if (!table) {
      throw new Error("The table object is not initialized");
    }

    const params = {
      //   page: 1,
      //   size: 100,
      // Add other parameters as needed, e.g., search, orderBy, orderDir
    };

    const response = await table.list(params);

    if (Array.isArray(response)) {
      SMCpeople = [];
      peopleAllInfo = [];
      facultyList = [];

      response.forEach((recordItem) => {
        const record = recordItem.record;
        let roles = [];

        if (record["Role"] && Array.isArray(record["Role"])) {
          roles = record["Role"].map((role) => role.value);
        }

        const fullName = [record["First Name"], record["Last Name"]]
          .filter(Boolean)
          .join(" ");
        SMCpeople.push({ name: fullName, id: record.id });

        const roomAccess = record["Room Access"]
          ? record["Room Access"].value
          : null;
        const gearAccess = record["Gear Access"]
          ? record["Gear Access"].value
          : null;

        peopleAllInfo.push({
          id: record.id,
          name: fullName,
          roomAccess: roomAccess,
          gearAccess: gearAccess,
          phoneNum: record["Phone"],
        });

        if (roles.includes("Faculty/Staff 🎓")) {
          facultyList.push({ name: fullName, id: record.id });
        }
      });
    } else {
      throw new Error("Invalid response format: expected an array of records.");
    }
  } catch (error) {
    console.error("Error fetching SMC People data from Baserow:", error);
  }
};

// Call the fetchPeopleData function to initiate the data retrieval
fetchPeopleData();

const InputSection = ({ title, description, children }) => (
  <Paper className="my-2 mx-auto p-2">
    <Box className="text-center m-2 text-xl">{title}</Box>
    {description && (
      <Box className="text-sm">
        <FormLabel component="legend" className="ml-4">
          {description}
        </FormLabel>
      </Box>
    )}
    {children}
  </Paper>
);

const SMCHours = () => (
  <div>
    <h2 className="text-3xl font-bold mb-4">SMC Hours & Availability</h2>
    <div className="flex justify-center text-xl">
      <div className="w-48 mx-4">
        <p className="mb-2">Monday — Friday:</p>
        <p>8:00 AM — Midnight</p>
      </div>
      <div className="w-48 mx-4">
        <p className="mb-2">Saturday & Sunday:</p>
        <p>12:00 PM — Midnight</p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [userSelected, setUserSelected] = React.useState([]);
  const [sessionTitle, setSessionTitle] = React.useState("");
  const [eventTypeSelected, setEventTypeSelected] = React.useState([]);
  const [roomType, setRoomType] = React.useState("");
  const [facultySelected, setFacultySelected] = React.useState([]);
  const [usageSelected, setUsageSelected] = React.useState([]);
  const [roomTypeSelected, setRoomTypeSelected] = React.useState([]);
  const [roomSelected, setRoomSelected] = React.useState([]);
  const [startTimeSelected, setStartTimeSelected] = React.useState("");
  const [endTimeSelected, setEndTimeSelected] = React.useState("");
  const [courseSelected, setCourseSelected] = React.useState([]);
  const [gearSelected, setGearSelected] = React.useState([]);

  const [IDerror, setIDError] = React.useState(false);
  const [eventID, setEventID] = React.useState("");
  const [goodID, setGoodID] = React.useState(false);

  const [userCount, setUserCount] = React.useState(0);
  const [disabledRoomTypes, setDisabledRoomTypes] = React.useState([]);
  const [timeCorrect, setTimeCorrect] = React.useState(false);
  const [gearList, setGearList] = React.useState([]);
  const [filteredGearList, setFilteredGearList] = React.useState([]);
  const [roomBookingRecord, setRoomBookingRecord] = React.useState([]);

  const [addGear, setAddGear] = React.useState(false);
  const [addCourse, setAddCourse] = React.useState(false);

  const [newEvent, setNewEvent] = React.useState(false);
  const [updateEvent, setUpdateEvent] = React.useState(false);
  const [CancelEvent, setCancelEvent] = React.useState(false);

  // Define states for room lists
  const [recordingStudioRooms, setRecordingStudioRooms] = useState([]);
  const [rehearsalRooms, setRehearsalRooms] = useState([]);
  const [ecRooms, setEcRooms] = useState([]);
  const [eventData, setEventData] = useState(null);

  const fetchEventData = async (eventID) => {
    try {
      const response = await fetch(
        `/api/events/getEventByID?eventId=${eventID}`
      );
      const data = await response.json();
      console.log("EVENT DATA :", data);
      if (response.ok) {
        setEventData(data); // Set fetched data to state
      } else {
        console.error("Error fetching event data:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const nameInput = (
    <InputSection
      title="Who is booking?"
      description="i.e. takes all responsibility!"
    >
      <NameInput
        peopleAllInfo={peopleAllInfo}
        userSelected={userSelected}
        setUserSelected={setUserSelected}
        setUserCount={setUserCount}
        setDisabledRoomTypes={setDisabledRoomTypes}
        setGearList={setGearList}
      />
    </InputSection>
  );

  const eventDetailsInput = (
    <InputSection title="Event Details">
      <EventDetailsInput
        facultyList={facultyList}
        setSessionTitle={setSessionTitle}
        setEventTypeSelected={setEventTypeSelected}
        setFacultySelected={setFacultySelected}
        setUsageSelected={setUsageSelected}
        defaultSessionTitle={eventData?.["Event Name"]}
        defaultEventType={eventData?.["Event Type"]?.value}
        defaultEventUsage={eventData?.["Intent of Use"]?.value}
      />
    </InputSection>
  );

  const roomInput = (
    <InputSection
      title="Room Selection"
      description="📌 If the Edit & Collaboration Spaces is selected, option to add gear(s) to your booking will be available at the end of the form."
    >
      <RoomSelection
        roomOptionStudio={recordingStudioRooms}
        roomOptionRehearsal={rehearsalRooms}
        roomOptionECspace={ecRooms}
        disabledRoomTypes={disabledRoomTypes}
        setRoomTypeSelected={setRoomTypeSelected}
        setRoomSelected={setRoomSelected}
        roomBookingRecord={roomBookingRecord}
        setRoomBookingRecord={setRoomBookingRecord}
        onRoomSelectionChange={(selectedRoomType) => {
          setRoomType(selectedRoomType.toString());
        }}
        initialRoomType={updateEvent && eventData ? eventData["Room Type"] : ""}
        initialRooms={
          updateEvent && eventData
            ? eventData["🚪 Room(s)"].map((room) => room.value)
            : []
        }
        isUpdateMode={updateEvent}
      />
    </InputSection>
  );

  const timeInput = (
    <InputSection
      title="Session Time"
      description="📌 Based on your chosen Session Time, we wil notify you with the availability of the room(s) selected above."
    >
      <TimeInput
        setStartTimeSelected={setStartTimeSelected}
        setEndTimeSelected={setEndTimeSelected}
        setTimeCorrect={setTimeCorrect}
        roomBookingRecord={roomBookingRecord}
        gearList={gearList}
        setFilteredGearList={setFilteredGearList}
      />
    </InputSection>
  );

  const courseInput = (
    <InputSection title="Courses">
      <CourseInput
        setCourseSelected={setCourseSelected}
        addCourse={addCourse}
        setAddCourse={setAddCourse}
      />
    </InputSection>
  );

  const gearInput = (
    <InputSection title="Gear Checkout">
      <GearCheckOut
        gearSelected={gearSelected}
        setGearSelected={setGearSelected}
        gearList={filteredGearList}
        addGear={addGear}
        setAddGear={setAddGear}
        startTimeSelected={startTimeSelected}
        endTimeSelected={endTimeSelected}
      />
    </InputSection>
  );

  const formActions = (
    <Box className="m-auto">
      <FormActions
        setNewEvent={setNewEvent}
        setUpdateEvent={setUpdateEvent}
        setCancelEvent={setCancelEvent}
        setEventID={setEventID}
        setIDError={setIDError}
        setGoodID={setGoodID}
        setUserSelected={setUserSelected}
      />
    </Box>
  );

  const requestEventID = (
    <InputSection
      title="Event Record ID"
      description="Please enter the Event Record ID you received in the confirmation email before proceeding to the rest of the form."
    >
      <EventID
        IDerror={IDerror}
        setIDError={setIDError}
        eventID={eventID}
        setEventID={setEventID}
        goodID={goodID}
        setGoodID={setGoodID}
        updateEvent={updateEvent}
        CancelEvent={CancelEvent}
        fetchEventData={fetchEventData}
      />
    </InputSection>
  );

  const fetchRoomsData = async (apiRoute) => {
    try {
      const response = await fetch(`/api/${apiRoute}`);
      const data = await response.json();

      if (data && data.results) {
        const rooms = data.results.map((room) => ({
          key: room.id,
          name: room.Name,
          events: room.Events,
        }));

        if (apiRoute === "studio") {
          setRecordingStudioRooms(rooms);
        } else if (apiRoute === "rehearsal") {
          setRehearsalRooms(rooms);
        } else if (apiRoute === "edit_collab") {
          setEcRooms(rooms);
        }
      } else {
        throw new Error(
          "Invalid response format: expected 'results' in response."
        );
      }
    } catch (error) {
      console.error(`Error fetching room data from ${apiRoute}:`, error);
    }
  };

  useEffect(() => {
    // Call the function to fetch data when the component mounts
    fetchPeopleData();
    fetchRoomsData("studio");
    fetchRoomsData("rehearsal");
    fetchRoomsData("edit_collab");
  }, []);

  return (
    <div
      id="background-container"
      className="text-center bg-neutral-900 min-h-screen"
    >
      <div className="relative min-h-screen">
        <ParallaxBackground
          image="/images/20210803-Sweetwater-Sign-JW-004.jpg"
          height="100vh"
        />

        <div className="flex flex-col justify-center items-center h-screen text-center p-4 bg-opacity-50 bg-black">
          <h1 className="text-white text-5xl font-bold mb-6">
            Discover the Sweetwater Music Center Advantage
          </h1>
          <p className="text-white text-xl mb-8">
            At Sweetwater, we&apos;re dedicated to empowering students and
            faculty at Purdue Fort Wayne with the tools they need to excel in
            their creative endeavors. Our cutting-edge facilities are designed
            to inspire, innovate, and elevate your music and multimedia
            projects.
          </p>
        </div>

        <ParallaxBackground
          image="/images/20151030-University-Singers-JW-55.jpg"
          height="500px"
        />

        <div className="flex flex-col justify-center items-center h-screen text-center p-4 bg-opacity-50 bg-black">
          <h1 className="text-white text-5xl font-bold mb-6">
            Your Space, Your Choice
          </h1>
          <p className="text-white text-xl mb-8">
            Explore a World of Possibilities with the SMC Booking App:
          </p>
          <ul className="list-disc list-inside text-white text-lg mb-8">
            <li className="mb-4">
              <strong>Recording Studios:</strong> Immerse yourself in the world
              of music with our professional-grade recording studios equipped
              with the latest technology.
            </li>
            <li className="mb-4">
              <strong>Rehearsal Rooms:</strong> Fine-tune your performances in
              our soundproof rehearsal spaces, perfect for practice and
              creativity.
            </li>
            <li className="mb-4">
              <strong>Edit & Collaboration Spaces:</strong> Fuel your creativity
              and innovation in dedicated spaces designed for seamless teamwork
              and collaboration.
            </li>
          </ul>
        </div>

        <ParallaxBackground
          image="/images/20220915-Sweetwater-center-JW-023.jpg"
          height="500px"
        />

        <div
          id="manage-events-section"
          className="flex flex-col justify-center items-center h-screen text-center p-4 bg-opacity-50 bg-black"
        >
          <h1 className="text-white text-5xl font-bold mb-6">
            Schedule SMC Events
          </h1>
          <p className="text-white text-xl mb-8">
            Everyone can take advantage of scheduling time in the edit &
            collaboration spaces in the SMC building. Approved students
            registered for certain classes have privileges to schedule time in
            the recording studio, rehearsal room, and control room.
          </p>
          <SMCHours />
          <div className="mt-4">
            {formActions}
            <Collapse in={newEvent || (updateEvent && goodID)}>
              {nameInput}
              {userCount > 0 && (
                <div>
                  <IframeSlide src="https://baserow.io/public/calendar/Af_TFnmy4569RwnAVDp7ErFB82F3ScK5DIU1bMsySP0" />
                  {eventDetailsInput}
                  {roomInput}
                  {roomSelected.length !== 0 && timeInput}
                  {courseInput}
                  {timeCorrect && gearInput}
                </div>
              )}
            </Collapse>
            {(updateEvent || CancelEvent) && (
              <Collapse in>{requestEventID}</Collapse>
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
                roomType={roomType}
              />
            )}
          </div>
        </div>

        <ParallaxBackground
          image="/images/20180810-Sweetwater-facility-JW-041.jpg"
          height="500px"
        />
      </div>
    </div>
  );
}
