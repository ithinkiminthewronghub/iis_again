import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState, useCallback, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CourseInfo from "./CourseInfo";
import AddIcon from "@mui/icons-material/Add";
import CourseInputModal from "./CourseInputModal";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { useContext } from "react";
import { apiUrl } from "../../utils/consts";
import Popup from "../UI/Popup";
const EditCourses = () => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [students, setStudents] = useState([]);
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
  const handleAddButtonClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
  };
  const getSubjects = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/course/`);

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
        guarantor: subject.guarantor,
      }));
      setSubjects(formattedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setSubjects]);
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
        (user) => user.role === "student"
      );
      setStudents(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setStudents]);

  useEffect(() => {
    getSubjects();
    getStudents();
  }, [getSubjects, getStudents]);

  const deleteSubject = async (subjectId) => {
    try {
      const response = await fetch(`${apiUrl}/api/course/${subjectId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        showPopup("Subject has deleted succesfully!", "good");
      }
      if (!response.ok) {
        throw new Error(`Failed to delete subject: ${response.statusText}`);
      }

      // If deletion is successful, update the users state
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.id !== subjectId)
      );
    } catch (error) {
      console.error("Error deleting subject:", error);
      showPopup("Error deleting subject", "bad");
    }
  };

  const actualize = async (idOfSubject, actualStudents) => {
    const studentIds = students.map((elem) => elem.id);
    console.log(studentIds);
    try {
      const response = await fetch(`${apiUrl}/api/course/${idOfSubject}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: actualStudents }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete subject: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const addNewStudents = async () => {
    if (students.length > 0 && subjects.length > 0) {
      try {
        // Group students by year of study
        const studentsByYear = students.reduce((acc, student) => {
          const { year_of_study, id } = student;
          if (!acc[year_of_study]) {
            acc[year_of_study] = [];
          }
          acc[year_of_study].push(id);
          return acc;
        }, {});

        // Update subjects with new students
        const updatedSubjects = subjects.map((subject) => {
          const { year, students: subjectStudents = [] } = subject;
          const studentsToAdd = studentsByYear[year] || [];
          const updatedStudents = [
            ...new Set([...subjectStudents, ...studentsToAdd]),
          ];
          return {
            ...subject,
            students: updatedStudents,
          };
        });
        // Perform PATCH request for each updated subject
        const updateRequests = updatedSubjects.map(async (updatedSubject) => {
          const { id, students: updatedStudents } = updatedSubject;
          const response = await fetch(`${apiUrl}/api/course/${id}/`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ students: updatedStudents }),
          });

          if (!response.ok) {
            throw new Error(
              `Failed to update subject ${id}: ${response.statusText}`
            );
          }

          return response.json();
        });

        // Wait for all requests to complete
        await Promise.all(updateRequests);

        console.log("Subjects updated successfully");
        showPopup("Subjects updated successfully", "good");
      } catch (error) {
        console.error("Error updating subjects:", error);
        showPopup("Error updating subjects, something went wrong", "bad");
      }
    }
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      {showInputModal && (
        <CourseInputModal
          setOpen={setShowInputModal}
          open={showInputModal}
          fetchSubjects={getSubjects}
          fetch={() => {
            getSubjects();
          }}
        />
      )}
      {popupContent && (
        <Popup text={popupContent.text} type={popupContent.type} />
      )}
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
            {(me.role === "admin" || me.role === "guarantor") && (
              <Button
                variant="contained"
                sx={{ width: "fit-content" }}
                onClick={addNewStudents}
              >
                add new students to subjects
              </Button>
            )}

            <List>
              {subjects
                .filter((subject) =>
                  me.role === "guarantor" ? subject.guarantor === me.id : true
                )
                .map((elem, index) => {
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
                        {" "}
                        {selectedSubjectId !== elem.id && (
                          <>
                            {elem.shortcut}
                            <div>
                              {me.role === "admin" && (
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",

                                    cursor: "pointer",
                                  }}
                                  onClick={() => deleteSubject(elem.id)}
                                >
                                  <DeleteIcon />
                                </button>
                              )}

                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  marginLeft: "8px",
                                }}
                                onClick={() => handleAddButtonClick(elem.id)}
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </>
                        )}
                        {selectedSubjectId === elem.id && (
                          <CourseInfo
                            subjectId={elem.id}
                            name={elem.shortcut}
                            credits={elem.credits}
                            description={elem.description}
                            setSelected={setSelectedSubjectId}
                            year={elem.year}
                          />
                        )}
                      </ListItem>
                    </React.Fragment>
                  );
                })}
            </List>
            {me.role === "admin" && (
              <Button
                variant="contained"
                onClick={() => setShowInputModal(true)}
                sx={{ marginTop: 4 }}
              >
                ADD SUBJECT
              </Button>
            )}
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditCourses;
