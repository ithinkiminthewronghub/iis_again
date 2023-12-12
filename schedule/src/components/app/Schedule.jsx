import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import { useState, useEffect, useCallback, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { MyContext } from "../../App";

const Schedule = () => {
  const [activities, setActivities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [myYear, setMyYear] = useState(0);
  const { token } = useContext(MyContext);
  const [me, setMe] = useState({ name: "user" });

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
  const getStudents = useCallback(async () => {
    try {
      const response = await fetch("http://80.211.202.81:80/api/user-profile/");

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
        (user) => user.role === "student"
      );

      setStudents(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setStudents]);

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
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // You may want to handle the error here or rethrow it
      }
    }
  }, [setMe]);

  useEffect(() => {
    getActivities();
    getSubjects();
    getSchedule();
    getRooms();
    getStudents();
  }, [getActivities, getSubjects, getSchedule, getRooms, getStudents]);

  useEffect(() => {
    getMe();
  }, [getMe, token]);

  useEffect(() => {
    const currentUser = students.find((elem) => elem.id === me.id);
    if (currentUser) {
      setMyYear(currentUser.year_of_study);
    }
  }, [students, me]);

  const DayListItem = (props) => {
    const filteredSchedule = schedule
      .filter(
        (elem) =>
          elem.day === props.day &&
          activities.find((activ) => activ.id == elem.activity)?.subject_id &&
          subjects.find(
            (innerElem) =>
              innerElem.id ===
              activities.find((activity) => activity.id === elem.activity)
                ?.subject_id
          )?.year == myYear
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <p style={{ fontSize: "1.5rem" }}>
                    {activities.find(
                      (activity) => activity.id === elem.activity
                    )?.subject_id &&
                      subjects.find(
                        (innerElem) =>
                          innerElem.id ===
                          activities.find(
                            (activity) => activity.id === elem.activity
                          ).subject_id
                      )?.shortcut + ","}
                  </p>
                  <p style={{ marginLeft: ".5rem" }}>
                    {
                      activities.find(
                        (activity) => activity.id === elem.activity
                      )?.type
                    }
                  </p>
                </div>
                <div style={{ display: "flex", marginTop: ".75rem" }}>
                  <p>{elem.start.slice(0, 5)}</p>
                  <p style={{ marginLeft: ".5rem" }}>
                    {
                      rooms.find(
                        (roomElem) =>
                          roomElem.id ===
                          schedule.find(
                            (activity) => activity.id === elem.activity
                          )?.room
                      )?.name
                    }
                  </p>
                  <p style={{ marginLeft: ".5rem" }}>
                    {activities.find(
                      (activity) => activity.id === elem.activity
                    )?.duration + " hours"}
                  </p>
                  <p style={{ marginLeft: ".5rem" }}>
                    {
                      activities.find(
                        (activity) => activity.id === elem.activity
                      )?.repetition
                    }
                  </p>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </ListItem>
    );
  };
  const currentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // one week in milliseconds
    const weekNumber = Math.floor(diff / oneWeek);

    return weekNumber % 2 === 0 ? "Even Week" : "Odd Week";
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
            <Typography variant="h5">Now Is {currentWeek()}</Typography>
            <List sx={{ width: "100%" }}>
              <DayListItem day="Monday" />
              <DayListItem day="Tuesday" />
              <DayListItem day="Wednesday" />
              <DayListItem day="Thursday" />
              <DayListItem day="Friday" />
            </List>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default Schedule;
