import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import { useState, useCallback, useEffect, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import Popup from "../UI/Popup";
import { apiUrl } from "../../utils/consts";
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
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
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
const EditRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [value, setValue] = React.useState("");
  const { token, showPopup, popupContent } = useContext(MyContext);
  const [me, setMe] = useState({ name: "User User", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const getMe = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/api/user-info/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch rooms: ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming the response structure is something like { users: [...] }
        const formatted = data.map((elem) => ({
          id: elem.user_id,
          name: `${elem.first_name} ${elem.last_name}`,
          role: elem.user_type,
        }));
        setMe(formatted[0]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setIsLoading(false);
        // You may want to handle the error here or rethrow it
      }
    }
  }, [setMe, setIsLoading, token]);

  useEffect(() => {
    getMe();
  }, [getMe, token]);
  const getRooms = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/room/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedRooms = data.map((room) => ({
        name: room.room_number,
        capacity: room.capacity,
        id: room.id,
      }));
      setRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setRooms]);

  const deleteRoom = async (roomID) => {
    try {
      const response = await fetch(`${apiUrl}/api/room/${roomID}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        showPopup("Room has deleted succesfully", "good");
      }
      if (!response.ok) {
        throw new Error(`Failed to delete room: ${response.statusText}`);
      }

      // If deletion is successful, update the users state
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomID));
    } catch (error) {
      console.error("Error deleting room:", error);
      showPopup("Error deleting room", "bad");
    }
  };
  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    console.log({
      room: data.get("room"),
      capacity: value,
    });
    if (data.get("room") && value) {
      try {
        const response = await fetch(`${apiUrl}/api/room/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room_number: data.get("room"),
            capacity: value,
          }),
        });

        if (response.ok) {
          console.log("Room created succesfully!");

          form.reset();
          setValue("");
          getRooms();
          showPopup("Room created succesfully", "good");
        } else {
          console.error("Error creating room:", response.statusText);
          showPopup("Error creating room", "bad");
        }
      } catch (error) {
        console.error("An error occurred while creating the room:", error);
      }
    }
  };

  return (
    <Box sx={{ margin: "0 auto", width: "100%", maxWidth: "1200px" }}>
      <Stack direction="row">
        <SideBar />
        <Box flex={6} padding={4}>
          <div
            style={{
              maxWidth: "1000px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {popupContent && (
              <Popup text={popupContent.text} type={popupContent.type} />
            )}
            {me.role === "admin" && (
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ display: "flex" }}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-room"
                      name="room"
                      required
                      fullWidth
                      id="room"
                      label="Room"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <NumberInput
                      aria-label="Demo number input"
                      placeholder="Capacity"
                      value={value ?? ""}
                      onChange={(event, val) => setValue(val)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit">
                      ADD
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            <List sx={{ marginTop: 6 }}>
              {rooms.map((elem, index) => {
                return (
                  <React.Fragment key={elem.id}>
                    <ListItem
                      sx={{
                        border: "1px solid #e0e0e0",
                        marginTop: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {elem.name}, Capacity: {elem.capacity}
                      {me.role === "admin" && (
                        <div>
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",

                              cursor: "pointer",
                            }}
                            onClick={() => deleteRoom(elem.id)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      )}
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditRooms;
