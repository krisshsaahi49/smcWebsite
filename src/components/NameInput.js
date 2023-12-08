import React, { useEffect, useCallback } from "react";
import { Button } from "@nextui-org/react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

let userValues = [];
const emojis = [
	"🎹",
	"😃",
	"😀",
	"😊",
	"📯",
	"🪕",
	"🎵",
	"🎺",
	"🥁",
	"🎻",
	"🎷",
	"😂",
	"🎸",
	"😋",
	"😎",
];

const userEmoji = [];
const userNameList = [];

function renderItem({ item, handleRemoveName }) {
	const emoji = userEmoji[userNameList.indexOf(item)];

	return (
		<ListItem>
			<ListItemText primary={emoji + " " + item} />
			<IconButton
				edge="end"
				aria-label="delete"
				title="Delete"
				onClick={() => handleRemoveName(item)}
				size="large"
			>
				<DeleteIcon />
			</IconButton>
		</ListItem>
	);
}

let gearList = [];
let lendLevel = "";
let roomTypes;

async function filterGear() {

	if (userValues.some((element) => element.gearAccess === "Gear Level 4")) {
		lendLevel = "https://api.baserow.io/api/database/rows/table/212627/?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%5D%2C%22groups%22%3A%5B%7B%22filter_type%22%3A%22OR%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103885%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103886%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103887%22%7D%5D%2C%22groups%22%3A%5B%5D%7D%5D%7D";
	} else if (
		userValues.some((element) => element.gearAccess === "Gear Level 3")
	) {
		lendLevel = "https://api.baserow.io/api/database/rows/table/212627/?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%5D%2C%22groups%22%3A%5B%7B%22filter_type%22%3A%22OR%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103885%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103886%22%7D%5D%2C%22groups%22%3A%5B%5D%7D%5D%7D";
	} else if (
		userValues.some((element) => element.gearAccess === "Gear Level 2")
	) {
		lendLevel = "https://api.baserow.io/api/database/rows/table/212627/?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%5D%2C%22groups%22%3A%5B%7B%22filter_type%22%3A%22OR%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103885%22%7D%5D%2C%22groups%22%3A%5B%5D%7D%5D%7D";
	} else if (
		userValues.some((element) => element.gearAccess === "Gear Level 1")
	) {
		lendLevel = "https://api.baserow.io/api/database/rows/table/212627/?user_field_names=true&filters=%7B%22filter_type%22%3A%22AND%22%2C%22filters%22%3A%5B%7B%22type%22%3A%22single_select_equal%22%2C%22field%22%3A%22Availability%22%2C%22value%22%3A%221103796%22%7D%2C%7B%22type%22%3A%22multiple_select_has%22%2C%22field%22%3A%22Gear%20Lending%20Level%22%2C%22value%22%3A%221103884%22%7D%5D%2C%22groups%22%3A%5B%5D%7D";
	} else {
		return gearList;
	}

    try {
        const response = await fetch(lendLevel,{
            method: 'GET',
            headers: {
                'Authorization': `Token HbYQMdxStJRoUvVLyjjegU0s86MIQY9F`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        gearList = data.results.map(item => ({
            id: item.id,
            name: item['Item Description'],
            manufacturer: item.Manufacturer && item.Manufacturer.map(m => m.value).join(', '),
            model: item.Model,
            category: item.Category && item.Category.value,
            availability: item.Availability && item.Availability.value,
            image: item.Image && item.Image[0] && item.Image[0].url,
            // ... include other fields you need
        }));
        return gearList;
    } catch (error) {
        console.error('Error fetching gear list:', error);
		return [];
    }
}

function filterRoomType(disabled) {
	if (userValues.some((element) => element.roomAccess === "Room Access 3")) {
		disabled = [];
	} else if (
		userValues.some((element) => element.roomAccess === "Room Access 2")
	) {
		disabled = ["Recording Studio 🎙️"];
	} else if (
		userValues.some((element) => element.roomAccess === "Room Access 1")
	) {
		disabled = ["Recording Studio 🎙️", "Rehearsal Spaces 🎧"];
	} else {
		disabled = [
			"Recording Studio 🎙️",
			"Rehearsal Spaces 🎧",
			"Edit & Collaboration Spaces 🎒",
		];
	}
	return disabled;
}

function NameInput({
	peopleAllInfo,
	setUserSelected,
	setUserCount,
	setDisabledRoomTypes,
	setGearList,
}) {
	const [open, setOpen] = React.useState(false);
	const [passFail, setPassFail] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [phoneVal, setPhoneVal] = React.useState(null);

	const Initilize = useCallback(async () => {
		userValues = [];
		gearList = [];
		roomTypes = [
			"Recording Studio 🎙️",
			"Rehearsal Spaces 🎧",
			"Edit & Collaboration Spaces 🎒",
		];
		const resolvedGearList = await filterGear();
		setGearList(resolvedGearList);
		setDisabledRoomTypes(filterRoomType(roomTypes));
	}, [setDisabledRoomTypes, setGearList]);

	useEffect(() => {
		(async () => {
			await Initilize();
		})();
	}, [Initilize]);
	

	const handleRemoveName = (item) => {
		userNameList.splice(userNameList.indexOf(item), 1);
		userValues = userValues.filter((user) => user.name !== item);

		gearList = [];
		roomTypes = [
			"Recording Studio 🎙️",
			"Rehearsal Spaces 🎧",
			"Edit & Collaboration Spaces 🎒",
		];
		setGearList(filterGear());
		setDisabledRoomTypes(filterRoomType(roomTypes));

		setUserCount(userNameList.length);
		setUserSelected(userValues);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason !== "backdropClick") {
			setOpen(false);
			setValue(null);
			setPhoneVal(null);
		}
	};

	const handleName = (event, newValue) => {
		if (newValue == null) {
			setValue(null);
			return;
		}
		if (
			typeof newValue === "string" &&
			!peopleAllInfo.some((person) => person.name === newValue)
		) {
		} else {
			setValue(newValue);
		}
	};

	const updateGearList = async () => {
		const resolvedGearList = await filterGear();
		setGearList(resolvedGearList);
	};

	const handleChange = (newValue) => {
		if (!value) {
			return;
		}
		if (nameCheck(newValue, value.name, phoneVal)) {
			if (newValue != null) {
				if (userNameList.indexOf(newValue.name) > -1) {
				} else {
					setPassFail(false);
					const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
					userEmoji.push(randomEmoji);
					handleClose();
					userValues.push(newValue);
					userNameList.push(newValue.name);
					setUserCount(userNameList.length);
					setUserSelected(userValues);
					setDisabledRoomTypes(filterRoomType(roomTypes));
					updateGearList();

				}
			}
		} else {
			setPassFail(true);
		}
	};

	const nameCheck = (recordVal, name, number) => {
		const phonePass = recordVal.phoneNum.slice(-4);
		return recordVal.name === name && phonePass === number;
	};
	const handleOk = () => {
		handleChange(value);
	};

	return (
		<div className="bg-transparent">
			<div className="flex justify-center my-2">
				<Button bordered shadow color="warning" auto onPress={handleClickOpen}>
					ADD
				</Button>
			</div>
			<Dialog
				disableEscapeKeyDown
				open={open}
				onClose={handleClose}
				className="mx-auto max-w-2xl"
			>
				<DialogTitle>Find your name</DialogTitle>
				<DialogContent>
					<Autocomplete
						value={value}
						onChange={handleName}
						selectOnFocus
						clearOnBlur={true}
						handleHomeEndKeys
						id="Search-for-name"
						options={peopleAllInfo}
						getOptionLabel={(option) => {
							if (typeof option === "string") {
								return option;
							} else return option.name;
						}}
						renderOption={(props, option) => <li {...props}>{option.name}</li>}
						freeSolo
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search for name"
								helperText="Please enter your name here :)"
								size="small"
								variant="standard"
								value={params.inputProps.value || ""}
							/>
						)}
					/>
					<TextField
						{...(passFail ? { error: true } : {})}
						id={passFail ? "passwordFailure" : "phone-val"}
						label={passFail ? "Please enter correct password" : "Last 4 of Ph#"}
						helperText={passFail ? "User+Password combo failed." : ""}
						size="small"
						variant="standard"
						value={phoneVal || ""}
						onChange={(e) => setPhoneVal(e.target.value)}
					/>
				</DialogContent>

				<DialogActions>
					<Button bordered shadow color="warning" auto onClick={handleOk}>
						Ok
					</Button>
					<Button bordered shadow color="warning" auto onClick={handleClose}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			{userNameList.length !== 0 && (
				<Paper variant="outlined">
					<Paper />
					{userNameList.map((item, index) => (
						<React.Fragment key={item}>
							{index !== 0 && <Divider />}
							<div className="p-2" key={item}>
								{renderItem({ item, handleRemoveName })}
							</div>
						</React.Fragment>
					))}
				</Paper>
			)}
		</div>
	);
}

export default NameInput;
