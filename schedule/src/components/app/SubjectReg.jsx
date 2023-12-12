import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect, useCallback, useContext } from "react";
import { MyContext } from "../../App";
const SubjectReg = () => {
  const [subjects, setSubjects] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [me, setMe] = useState({ name: "user" });
  const { token } = useContext(MyContext);

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
        description: subject.annotation,
        credits: subject.number_of_credits,
        id: subject.id,
        year: subject.year_of_study,
        students: subject.students,
      }));

      setSubjects(formattedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setSubjects]);

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
    getSubjects();
    getMe();
  }, [getSubjects, getMe]);

  useEffect(() => {
    // Filter subjects with myId and set them to mySubjects
    if (me.id !== null && subjects.length > 0) {
      const filteredSubjects = subjects.filter((course) =>
        course.students.includes(me.id)
      );
      setMySubjects(filteredSubjects);
    }
  }, [subjects, me]);

  const handleCheckboxChange = async (subjectId) => {
    // Find the subject by ID
    const updatedSubjects = mySubjects.map((subject) => {
      if (subject.id === subjectId) {
        // Toggle the student in the subject's students array
        const updatedStudents = subject.students.includes(me.id)
          ? subject.students.filter((student) => student !== me.id)
          : [...subject.students, me.id];

        // Update the server
        fetch(`http://80.211.202.81:80/api/course/${subjectId}/`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ students: updatedStudents }),
        });

        // Update the subject with the new students array
        return { ...subject, students: updatedStudents };
      }
      return subject;
    });
    setMySubjects(updatedSubjects);
  };

  return (
    <Box sx={{ margin: "0 auto", width: "100%", maxWidth: "1200px" }}>
      <Stack direction="row">
        <SideBar />
        <Box flex={6} padding={4}>
          <div style={{ maxWidth: "1000px" }}>
            <Typography variant="h5" gutterBottom>
              Subjects
            </Typography>
            <List sx={{ border: "1px solid #e0e0e0", padding: 0 }}>
              {mySubjects.map((elem) => {
                return (
                  <ListItem
                    key={elem.id}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p style={{ fontSize: "1.5rem" }}>{elem.shortcut}</p>
                        <p style={{ marginTop: ".5rem" }}>{elem.description}</p>
                      </div>

                      <Checkbox
                        checked={elem.students.includes(me.id)}
                        onChange={() => handleCheckboxChange(elem.id)}
                      />
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default SubjectReg;
