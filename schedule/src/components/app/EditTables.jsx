import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import { useState, useEffect, useCallback, useContext } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { MyContext } from "../../App";
const EditTables = () => {
  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [chosenTime, setChosenTime] = useState("");
  const [activities, setActivities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState("");
  const { token } = useContext(MyContext);
  const [me, setMe] = useState({ name: "User User", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const getMe = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch("http://80.211.202.81:80/api/user-info/", {
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
      const response = await fetch("http://80.211.202.81:80/api/room/");

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
  const getSchedule = useCallback(async () => {
    try {
      const response = await fetch(
        "http://80.211.202.81:80/api/schedule-activity/"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch schedule: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedSchedule = data.map((elem) => ({
        id: elem.id,
        day: elem.day_of_week,
        room: elem.room,
        start: elem.start_time,
        activity: elem.educational_activity,
      }));
      setSchedule(formattedSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setSchedule]);
  const deleteSchedule = async (scheduleID) => {
    try {
      const response = await fetch(
        `http://80.211.202.81:80/api/schedule-activity/${scheduleID}/`,
        {
          Authorization: `Bearer ${token}`,
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete schedule item: ${response.statusText}`
        );
      }

      // If deletion is successful, update the users state
      setSchedule((prevRooms) =>
        prevRooms.filter((room) => room.id !== scheduleID)
      );
    } catch (error) {
      console.error("Error deleting schedule item:", error);
    }
  };

  const getActivities = useCallback(async () => {
    try {
      const response = await fetch(
        "http://80.211.202.81:80/api/educational-activity/"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedActivities = data.map((elem) => ({
        id: elem.id,
        subject_id: elem.subject,
        type: elem.activity_type,
        duration: elem.duration,
        repetition: elem.repetition,
      }));
      setActivities(formattedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setActivities]);
  const getSubjects = useCallback(async () => {
    try {
      const response = await fetch("http://80.211.202.81:80/api/course/");

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedSubjects = data.map((subject) => ({
        shortcut: subject.name,
        id: subject.id,
        year: subject.year_of_study,
      }));
      setSubjects(formattedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setSubjects]);
  useEffect(() => {
    getActivities();
    getSubjects();
    getSchedule();
    getRooms();
  }, [getActivities, getSubjects, getSchedule, getRooms]);

  const MyTimePicker = () => {
    return (
      <FormControl fullWidth>
        <InputLabel id="select-time">Starting time</InputLabel>
        <Select
          labelId="select-time"
          id="select-time"
          value={chosenTime}
          label="Starting time"
          onChange={(event) => setChosenTime(event.target.value)}
        >
          <MenuItem value={"07"}>7:00</MenuItem>
          <MenuItem value={"08"}>8:00</MenuItem>
          <MenuItem value={"09"}>9:00</MenuItem>
          <MenuItem value={"10"}>10:00</MenuItem>
          <MenuItem value={"11"}>11:00</MenuItem>
          <MenuItem value={"12"}>12:00</MenuItem>
          <MenuItem value={"13"}>13:00</MenuItem>
          <MenuItem value={"14"}>14:00</MenuItem>
          <MenuItem value={"15"}>15:00</MenuItem>
          <MenuItem value={"16"}>16:00</MenuItem>
          <MenuItem value={"17"}>17:00</MenuItem>
          <MenuItem value={"18"}>18:00</MenuItem>
          <MenuItem value={"19"}>19:00</MenuItem>
          <MenuItem value={"20"}>20:00</MenuItem>
        </Select>
      </FormControl>
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({
      day: day,
      time: chosenTime,
      activity: activity,
    });
    if (day && chosenTime && activity) {
      try {
        const response = await fetch(
          "http://80.211.202.81:80/api/schedule-activity/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              day_of_week: day,
              room: room,
              start_time: `${chosenTime}:00:00`,
              educational_activity: activity,
            }),
          }
        );

        if (response.ok) {
          console.log("Activity created succesfully!");
        } else {
          console.error("Error creating activity:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred while creating the activity:", error);
      }
    }
  };
  const DayListItem = (props) => {
    const filteredSchedule = schedule
      .filter(
        (elem) =>
          elem.day === props.day &&
          activities.find((activ) => activ.id == elem.activity)?.subject_id &&
          subjects.find(
            (subj) =>
              subj.id ==
              activities.find((activity) => activity.id === elem.activity)
                .subject_id
          )?.year == filter
      )
      .sort((a, b) => {
        // Convert 'HH:MM:SS' time to total minutes for comparison
        const getTimeInMinutes = (time) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes;
        };

        const timeA = getTimeInMinutes(a.start);
        const timeB = getTimeInMinutes(b.start);

        return timeA - timeB;
      });
    return (
      <ListItem
        disablePadding
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ width: "100%" }}>
          {props.day}
        </Typography>
        <List sx={{ width: "100%" }}>
          {filteredSchedule.map((elem) => (
            <ListItem
              key={elem.id}
              sx={{
                border: "1px solid #e0e0e0",
                marginTop: 1,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                {activities.find((activity) => activity.id === elem.activity)
                  ?.subject_id &&
                  subjects.find(
                    (innerElem) =>
                      innerElem.id ===
                      activities.find(
                        (activity) => activity.id === elem.activity
                      ).subject_id
                  )?.shortcut + ", "}
                {elem.start.slice(0, 5) + ", "}
                {activities.find((activity) => activity.id === elem.activity)
                  ?.type + ", "}
                {rooms.find((room) => room.id === elem.room)?.name + ", "}
                {activities.find((activity) => activity.id === elem.activity)
                  ?.duration + " hours, "}
                {
                  activities.find((activity) => activity.id === elem.activity)
                    ?.repetition
                }
              </div>
              {(me.role === "admin" || me.role === "scheduler") && (
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",

                    cursor: "pointer",
                  }}
                  onClick={() => deleteSchedule(elem.id)}
                >
                  <DeleteIcon />
                </button>
              )}
            </ListItem>
          ))}
        </List>
      </ListItem>
    );
  };
  return (
    <Box sx={{ margin: "0 auto", width: "100%", maxWidth: "1200px" }}>
      <Stack direction="row">
        <SideBar />
        <Box flex={6} padding={4}>
          <div style={{ maxWidth: "1000px" }}>
            {(me.role === "admin" || me.role === "scheduler") && (
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-day">Day of the week</InputLabel>
                      <Select
                        labelId="select-day"
                        id="select-day"
                        value={day}
                        label="Day of the week"
                        onChange={(event) => setDay(event.target.value)}
                      >
                        <MenuItem value={"Monday"}>Monday</MenuItem>
                        <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
                        <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
                        <MenuItem value={"Thursday"}>Thursday</MenuItem>
                        <MenuItem value={"Friday"}>Friday</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MyTimePicker />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-room">Room</InputLabel>
                      <Select
                        labelId="select-room"
                        id="select-room"
                        value={room}
                        label="Room"
                        onChange={(event) => setRoom(event.target.value)}
                      >
                        {rooms.map((elem) => (
                          <MenuItem key={elem.id} value={elem.id}>
                            {elem.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-activity">Activities</InputLabel>
                      <Select
                        labelId="select-activity"
                        id="select-activity"
                        value={activity}
                        label="Activities"
                        onChange={(event) => setActivity(event.target.value)}
                      >
                        {activities.map((elem) => (
                          <MenuItem key={elem.id} value={elem.id}>
                            {subjects.find(
                              (innerElem) => innerElem.id === elem.subject_id
                            )?.shortcut + ", "}
                            {elem.type + ", "}
                            {elem.duration + " hours, "}
                            {elem.repetition}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit">
                      ADD
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box component="form" noValidate sx={{ marginTop: 10 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="select-day">
                      Filter schedule by year of study
                    </InputLabel>
                    <Select
                      labelId="select-filter"
                      id="select-filter"
                      value={filter}
                      label="Filter schedule by year of study"
                      onChange={(event) => setFilter(event.target.value)}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </div>
          <List sx={{ width: "100%" }}>
            <DayListItem day="Monday" />
            <DayListItem day="Tuesday" />
            <DayListItem day="Wednesday" />
            <DayListItem day="Thursday" />
            <DayListItem day="Friday" />
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditTables;
