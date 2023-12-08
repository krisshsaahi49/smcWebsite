import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Modal, Box, Typography, Button } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";

import HeaderWithSubtitle from "../components/HeaderWithSubtitle";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [recordingStudioEvents, setRecordingStudioEvents] = useState([]);
  const [rehearsalSpaceEvents, setRehearsalSpaceEvents] = useState([]);
  const [editCollabSpaceEvents, setEditCollabSpaceEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dataObject, setDataObject] = useState({});
  // Function to fetch events from a specific API endpoint
  const fetchEvents = async (apiRoute) => {
    let allRecords = [];
    let nextPage = 1;

    while (nextPage) {
      const response = await fetch(`/api/${apiRoute}?page=${nextPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDataObject(data);
      allRecords = allRecords.concat(
        data.results.map((event) => ({
          id: event.id,
          title: event["Event Name"],
          eventType: event["Event Type"]?.value || "N/A",
          rooms:
            event["🚪 Room(s)"]?.map((room) => room.value).join(", ") || "N/A",
          class: event["Class"]?.map((c) => c.value).join(", ") || "N/A",
          start: new Date(event["Start Time"]),
          end: new Date(event["Proposed End Time"]),
          status: event["Status"]?.value || "N/A",
          location:
            event["Location"]?.map((loc) => loc.value).join(", ") || "N/A",
          roomType: event['Room Type']
        }))
      );
      nextPage = data.next ? nextPage + 1 : null;
    }

    return allRecords;
  };

  useEffect(() => {
    fetchEvents("recordingStudio")
      .then(setRecordingStudioEvents)
      .catch((error) => console.error("Error fetching recording studio events:", error));

    fetchEvents("rehearsalSpace")
      .then(setRehearsalSpaceEvents)
      .catch((error) => console.error("Error fetching rehearsal space events:", error));

    fetchEvents("edit_collabSpace")
      .then(setEditCollabSpaceEvents)
      .catch((error) => console.error("Error fetching edit & collab space events:", error));
  }, []);

  const handleEventSelect = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  // ... (Modal component remains unchanged)

  return (
    <div className="bg-neutral-900 flex flex-col items-center justify-center pt-[4.875rem] bg-transparent">
      <div className="w-full max-w-4xl px-4 py-2">
        <SectionCalendar
          title="Recording Studio"
          subtitle="Please check out the calendar below before you book a slot at the Recording Studio"
          events={recordingStudioEvents}
          handleEventSelect={handleEventSelect}
          data={dataObject}
        />
        <SectionCalendar
          title="Rehearsal Room"
          subtitle="Please check out the calendar below before you book a Rehearsal Space"
          events={rehearsalSpaceEvents}
          handleEventSelect={handleEventSelect}
          data={dataObject}
        />
        <SectionCalendar
          title="Edit & Collabaration Spaces"
          subtitle="Take advantage of the edit suites and other collaboration spaces in the SMC building."
          events={editCollabSpaceEvents}
          handleEventSelect={handleEventSelect}
          data={dataObject}
        />
        {/* Modal for displaying event details */}
        <Modal
          open={!!selectedEvent}
          onClose={closeModal}
          aria-labelledby="event-details-title"
          className="flex items-center justify-center p-4"
        >
          <Box
            bgcolor="background.paper"
            p={4}
            borderRadius={2}
            boxShadow={24}
            className="w-full max-w-md"
          >
            {selectedEvent && (
              <>
                <Typography
                  id="event-details-title"
                  variant="h6"
                  component="h2"
                  color="text.primary"
                  gutterBottom
                >
                  {selectedEvent.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Type:</strong> {selectedEvent.eventType}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Room(s):</strong> {selectedEvent.rooms}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Class:</strong> {selectedEvent.class}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Start Time:</strong>{" "}
                  {selectedEvent.start.toLocaleString()}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>End Time:</strong>{" "}
                  {selectedEvent.end.toLocaleString()}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Status:</strong> {selectedEvent.status}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  <strong>Location:</strong> {selectedEvent.location}
                </Typography>
                {/* Add other event details */}
                <Button onClick={closeModal} variant="outlined" color="primary">
                  Close
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

function SectionCalendar({ title, subtitle, events, handleEventSelect, data }) {

  const getEventStyle = (event) => {
    const roomTypeColorMapping = {
      "Recording Studio 🎙️": "blue",
      "Rehearsal Spaces 🎧": "green",
      "Edit & Collaboration Spaces 🎒": "red",
    };

    let roomType = event.roomType; 
    console.log(roomType);
  
    let backgroundColor = roomTypeColorMapping[roomType] || 'grey';
    // console.log(backgroundColor);
  
    return {
      style: {
        backgroundColor,
        overflow: 'hidden',
        padding: '2px 5px',
        maxHeight: '100%',
        borderRadius: '0',
      }
    };
  };
  



  const CustomEvent = ({ event }) => {
    const backgroundColor = getEventStyle(event).style.backgroundColor;
    return (
      <div style={{ backgroundColor, overflow: 'hidden', padding: '2px 5px' }}>
        {event.title}
      </div>
    );
  };
  return (
    <>
      <HeaderWithSubtitle title={title} subtitle={subtitle} />
      <Calendar
        components={{
          event: CustomEvent
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventSelect}
        eventPropGetter={getEventStyle}
        className="rounded-lg shadow-lg overflow-hidden my-4 bg-white text-gray-700"
        style={{ height: 600, marginBottom: 30 }}
      />
    </>
  );
}
