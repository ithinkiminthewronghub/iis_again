import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { MyContext } from "../../App";
import { useContext } from "react";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";

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

export default function CourseInputModal(props) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [garant, setGarant] = React.useState("");
  const [value, setValue] = React.useState("");
  const [year, setYear] = useState("");
  const { token } = useContext(MyContext);
  const handleChange = (event) => {
    setGarant(event.target.value);
  };

  const getTeachers = useCallback(async () => {
    try {
      const response = await fetch("http://80.211.202.81:80/api/user-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      const response = await fetch("http://80.211.202.81:80/api/user-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: `${user.name} ${user.last_name}`,
        role: user.user_type,
        login: user.username,
        year_of_study: user.year_of_study,
      }));
      const filteredUsers = formattedUsers.filter(
        (user) => user.role === "student"
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
    const filteredStudents = students.filter(
      (student) => student.year_of_study === year
    );
    const studentIds = filteredStudents.map((student) => student.id);

    if (data.get("name") && data.get("annotation") && garant !== "" && value) {
      try {
        const reqData = {
          name: data.get("name"),
          annotation: data.get("annotation"),
          guarantor: garant,
          number_of_credits: value,
          year_of_study: year,
          teachers: [garant],
          students: studentIds,
        };
	console.log(reqData);
        // Update the role of the selected guarantor
        const updateRoleResponse = await fetch(
          `http://80.211.202.81:80/api/user-profile/${garant}/`,
		
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_type: "guarantor",
            }),
          }
        );

        if (!updateRoleResponse.ok) {
          console.error(
            "Error updating user role:",
            updateRoleResponse.statusText
          );
          return;
        }

        // Create the course
        const createCourseResponse = await fetch(
          "http://80.211.202.81:80/api/course/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reqData),
          }
        );

        if (createCourseResponse.ok) {
          console.log("Subject created successfully!");
        } else {
          console.error(
            "Error creating subject:",
            createCourseResponse.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred while creating the subject:", error);
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
          <Grid container spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Please fill up the form about subject
            </Typography>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-annotation"
                name="annotation"
                multiline
                required
                fullWidth
                id="annotation"
                label="Annotation"
              />
            </Grid>
            <Grid item xs={12}>
              <NumberInput
                aria-label="Demo number input"
                placeholder="How many credits"
                value={value}
                onChange={(event, val) => setValue(val)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-year">Year</InputLabel>
                <Select
                  labelId="select-year"
                  id="select-year"
                  value={year}
                  label="Year"
                  onChange={(event) => setYear(event.target.value)}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-guarantor">Guarantor</InputLabel>
                <Select
                  labelId="select-guarantor"
                  id="select-guarantor"
                  value={garant}
                  label="Guarantor"
                  onChange={handleChange}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              type="submit"
              size="large"
              sx={{ marginTop: 2 }}
            >
              add
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
