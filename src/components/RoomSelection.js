import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";

let userRoomType;
let userRoomSelection;

const roomTypes = [
  "Recording Studio 🎙️",
  "Rehearsal Spaces 🎧",
  "Edit & Collaboration Spaces 🎒",
];

let roomOptionsAllInfo = [];
let roomSelectedAllInfo = [];
let eventsList = [];

export default function RoomSelectionInput({
  roomOptionStudio,
  roomOptionRehearsal,
  roomOptionECspace,
  disabledRoomTypes,
  roomBookingRecord,
  setRoomBookingRecord,
  onRoomTypeChange,
  onRoomSelectionChange,
  initialRoomType,
  initialRooms,
  isUpdateMode,
}) {
  const [roomType, setRoomType] = React.useState("");
  const [room, setRoom] = React.useState(
    isUpdateMode && initialRooms ? initialRooms : []
  );

  const [isInitialSetupDone, setIsInitialSetupDone] = React.useState(false);

useEffect(() => {
  if (isUpdateMode && !isInitialSetupDone) {
    setRoomType(initialRoomType);
    setRoom(initialRooms);

    switch (initialRoomType) {
      case "Recording Studio 🎙️":
        roomOptionsAllInfo = roomOptionStudio;
        setIsStudio(true);
        setIsRehearsal(false);
        setIsECspace(false);
        break;
      case "Rehearsal Spaces 🎧":
        roomOptionsAllInfo = roomOptionRehearsal;
        setIsStudio(false);
        setIsRehearsal(true);
        setIsECspace(false);
        break;
      case "Edit & Collaboration Spaces 🎒":
        roomOptionsAllInfo = roomOptionECspace;
        setIsStudio(false);
        setIsRehearsal(false);
        setIsECspace(true);
        break;
      default:
        // Handle default case
        break;
    }

    setIsInitialSetupDone(true);
  }
}, [isUpdateMode, initialRoomType, initialRooms]); // Keep these dependencies

useEffect(() => {
  onRoomTypeChange(roomType);
}, [roomType, onRoomTypeChange]);

useEffect(() => {
  onRoomSelectionChange(room);
}, [room, onRoomSelectionChange]);
  
  const [isStudio, setIsStudio] = React.useState(false);
  const [isRehearsal, setIsRehearsal] = React.useState(false);
  const [isECspace, setIsECspace] = React.useState(false);

  const handleChangeRoomType = (event) => {
    const {
      target: { value },
    } = event;
    // setRoomType(typeof value === "string" ? value.split(",") : value);
    setRoomType(value);
    userRoomType = value;
    onRoomTypeChange(value);
    setRoom([]);

    if (userRoomType === "Recording Studio 🎙️") {
      roomOptionsAllInfo = roomOptionStudio;
      setIsStudio(true);
      setIsRehearsal(false);
      setIsECspace(false);
      setRoom([]);
    } else if (userRoomType === "Rehearsal Spaces 🎧") {
      roomOptionsAllInfo = roomOptionRehearsal;
      setIsStudio(false);
      setIsRehearsal(true);
      setIsECspace(false);
      setRoom([]);
    } else if (userRoomType === "Edit & Collaboration Spaces 🎒") {
      roomOptionsAllInfo = roomOptionECspace;
      setIsStudio(false);
      setIsRehearsal(false);
      setIsECspace(true);
      setRoom([]);
    }
  };

  const handleChangeRoom = (event) => {
    const {
      target: { value },
    } = event;
    setRoom(typeof value === "string" ? value.split(",") : value);
    userRoomSelection = value;
    onRoomSelectionChange(value);

    const valueLength = value.length;
    const roomOptionsLength = roomOptionsAllInfo.length;
    roomSelectedAllInfo = [];

    for (let i = 0; i < valueLength; i++) { 
      for (let x = 0; x < roomOptionsLength; x++) {
        if (roomOptionsAllInfo[x].name === value[i])
          roomSelectedAllInfo.push(roomOptionsAllInfo[x]);
      }
    }

    const roomSelectedAllInfoLength = roomSelectedAllInfo.length;
    eventsList = [];
    let eventsListLength = 0;

    for (let j = 0; j < roomSelectedAllInfoLength; j++) {
      axios
        .get(
          `https://api.baserow.io/api/database/rows/table/212625/${roomSelectedAllInfo[j].key}/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token HbYQMdxStJRoUvVLyjjegU0s86MIQY9F`,
            },
          }
        )
        .then((response) => {
          const record = response.data;
          eventsList.push({
            name: record["Name"],
            id: record.id,
            eventStart: record["Events Start"],
            eventEnd: record["Events End"],
            eventStatus: record["Events Status"],
          });
          eventsListLength++;
          if (eventsListLength === roomSelectedAllInfoLength) {
            setRoomBookingRecord(eventsList);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    if (roomBookingRecord.length !== 0) {
    }
  }, [roomBookingRecord]);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setRoom((current) => current.filter((item) => item !== value));
    onRoomSelectionChange((current) => current.filter((item) => item !== value));
  };

  const roomSelection = (label, roomOptions) => (
    <FormControl fullWidth variant="standard">
      <InputLabel>{label}</InputLabel>
      <Select
        variant="standard"
        labelId="event-multiple-selection"
        id="event-multiple-chip"
        value={room}
        onChange={handleChangeRoom}
        multiple
        renderValue={(selected) => (
          <Box>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                onDelete={(e) => handleDelete(e, value)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              />
            ))}
          </Box>
        )}
      >
        {roomOptions.map((option) => (
          <MenuItem key={option.key} value={option.name}>
            <Checkbox checked={room.indexOf(option.name) > -1} />
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <div className="bg-transparent">
      <Stack>
        <div>
          <FormControl fullWidth variant="standard">
            <InputLabel id="event-type-label">Room Type</InputLabel>
            <Select
              value={roomType}
              onChange={handleChangeRoomType}
              renderValue={(selected) => selected}
            >
              {roomTypes.map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  disabled={disabledRoomTypes.indexOf(type) > -1}
                >
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          {isStudio && roomSelection("Select studio room(s)", roomOptionStudio)}
          {isRehearsal &&
            roomSelection("Select rehearsal room(s)", roomOptionRehearsal)}
          {isECspace &&
            roomSelection(
              "Select Edit & Collaboration room(s)",
              roomOptionECspace
            )}
        </div>
      </Stack>
    </div>
  );
}
