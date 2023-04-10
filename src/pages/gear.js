"use client";
import React from "react";
import IndividualNameInput from "../components/form/NameInput/IndividualNameInput";
import IndividualTimeInput from "../components/form/TimeInput/IndividualTimeInput";
import IndividualGearCheckOut from "../components/GearInput/IndividualGearCheckOut";
import IndividualSubmit from "../components/form/SubmitButton/IndividualSubmit";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import FormLabel from "@mui/material/FormLabel";
import base from "../components/airtable";

///////////////////////////////////////////             ///////////////////////////////////////////
///////////////////////////////////////////  API CALLS  ///////////////////////////////////////////
///////////////////////////////////////////             ///////////////////////////////////////////

const peopleAllInfo = [];

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
        peopleAllInfo[x] = {
          id: record.id,
          name: record.get("Person"),
          gearAccess: record.get("Gear Access"),
        };
        x = x + 1;
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    },
    function done(err) {
      if (err) {
      }
    }
  );

function Gear1() {
  const [userSelected, setUserSelected] = React.useState([]);
  const [gear, setGear] = React.useState([]);
  const [gearList, setGearList] = React.useState([]);
  const [gearSelected, setGearSelected] = React.useState([]);
  const [startTimeSelected, setStartTimeSelected] = React.useState("");
  const [endTimeSelected, setEndTimeSelected] = React.useState("");

  const [timeCorrect, setTimeCorrect] = React.useState(false);

  const nameInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 2, fontSize: 22, lineHeight: 2 }}>
        Who is booking?
        <br />
        <FormLabel component="legend">
          Add users to see a list of gear available to your access level in the
          Select Gear menu.
        </FormLabel>
      </Box>
      <IndividualNameInput
        peopleAllInfo={peopleAllInfo}
        setUserSelected={setUserSelected}
        userSelected={userSelected}
        setGearList={setGearList}
      />
    </Paper>
  );

  const timeInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 2, fontSize: 22, lineHeight: 2 }}>
        Session Time
        <FormLabel component="legend">
          Based on your chosen Session Time, we wil notify you with the
          availability of the room(s) selected above.
        </FormLabel>
      </Box>
      <IndividualTimeInput
        setStartTimeSelected={setStartTimeSelected}
        setEndTimeSelected={setEndTimeSelected}
        setTimeCorrect={setTimeCorrect}
      />
      <br />
    </Paper>
  );

  const gearInput = (
    <Paper sx={{ maxWidth: 700, width: "90%", my: 2, mx: "auto", p: 2 }}>
      <Box sx={{ textAlign: "left", m: 2, fontSize: 22, lineHeight: 2 }}>
        Select Gear
        <br />
      </Box>
      <IndividualGearCheckOut
        setGearSelected={setGearSelected}
        gearList={gearList}
        gear={gear}
        setGear={setGear}
        startTimeSelected={startTimeSelected}
        endTimeSelected={endTimeSelected}
      />
      <br />
    </Paper>
  );
  return (
    <div>
      <Grow in={true}>{nameInput}</Grow>
      <Grow in={true}>{timeInput}</Grow>
      <Grow in={true}>{gearInput}</Grow>

      <IndividualSubmit
        userSelected={userSelected}
        startTimeSelected={startTimeSelected}
        endTimeSelected={endTimeSelected}
        gearSelected={gearSelected}
        timeCorrect={timeCorrect}
      />
    </div>
  );
}

export default function Gear() {
  return (
    <div>
      <Gear1 />
    </div>
  );
}
