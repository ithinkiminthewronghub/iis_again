import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import Select from "@mui/material/Select";
import { useState, useEffect, useCallback, useContext } from "react";
import { MyContext } from "../../App";
import { apiUrl } from "../../utils/consts";
import Popup from "../UI/Popup";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      min={1}
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: "▴",
        },
        decrementButton: {
          children: "▾",
        },
      }}
      {...props}
      ref={ref}
    />
  );
});
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledInputRoot = styled("div")(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `
);

const StyledButton = styled("button")(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 0;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    }
    & .arrow {
      transform: translateY(-1px);
    }
  `
);
export default function LessonInputModal(props) {
  const [repetition, setRepetition] = useState("");
  const { token, showPopup, popupContent } = useContext(MyContext);
  const [teacher, setTeacher] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [value, setValue] = React.useState("");
  const [type, setType] = useState("");

  const getTeachers = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user-profile/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.user_type,
        login: user.username,
      }));
      const filteredUsers = formattedUsers.filter(
        (user) => user.role === "teacher" || user.role === "guarantor"
      );
      setTeachers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setTeachers]);

  const getStudents = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user-profile/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.user_type,
        login: user.username,
        year_of_study: user.year_of_study,
      }));
      const filteredUsers = formattedUsers.filter(
        (user) => user.role === "student" && user.year_of_study === props.year
      );

      setStudents(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setStudents]);

  useEffect(() => {
    getTeachers();
    getStudents();
  }, [getTeachers, getStudents]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const studentIds = students.map((student) => student.id);
    if (data.get("type") && value && repetition && teacher && studentIds) {
      try {
        const response = await fetch(`${apiUrl}/api/educational-activity/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: props.subjectId,
            activity_type: data.get("type"),
            duration: value,
            repetition: repetition,
            optional_requirements: data.get("notes"),
            teachers: [teacher],
            students: studentIds,
          }),
        });

        if (response.ok) {
          console.log("Lesson created succesfully!");
          setValue("");
          setRepetition("");
          setTeacher("");
          setType("");
          showPopup("Lesson created succesfully!", "good");
          props.fetch();
        } else {
          console.error("Error creating lesson:", response.statusText);
          showPopup("Error creating lesson", "bad");
        }
      } catch (error) {
        console.error("An error occurred while creating the lesson:", error);
      }
    }
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
          {popupContent && (
            <Popup text={popupContent.text} type={popupContent.type} />
          )}
          <Grid container spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Please fill up the form about the lesson
            </Typography>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-type"
                name="type"
                required
                fullWidth
                id="type"
                label="Activity type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <NumberInput
                aria-label="Demo number input"
                placeholder="Duration in hours"
                value={value}
                onChange={(event, val) => setValue(val)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-repetition">Repetition</InputLabel>
                <Select
                  labelId="select-repetition"
                  id="select-repetition"
                  value={repetition}
                  label="Repetition"
                  onChange={(event) => setRepetition(event.target.value)}
                >
                  <MenuItem value={"Every Week"}>Every Week</MenuItem>
                  <MenuItem value={"Even Week"}>Even Week</MenuItem>
                  <MenuItem value={"Odd Week"}>Odd Week</MenuItem>
                  <MenuItem value={"One-Time Activity"}>
                    One-time Activity
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-notes"
                name="notes"
                multiline
                required
                fullWidth
                id="notes"
                label="Notes"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-teacher">Teacher</InputLabel>
                <Select
                  labelId="select-teacher"
                  id="select-teacher"
                  value={teacher}
                  label="Teacher"
                  onChange={(event) => setTeacher(event.target.value)}
                >
                  {teachers.map((elem) => (
                    <MenuItem key={elem.id} value={elem.id}>
                      {elem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              sx={{ marginTop: 2 }}
              type="submit"
            >
              add
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
