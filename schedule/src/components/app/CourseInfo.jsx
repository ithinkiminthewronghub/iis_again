import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useCallback, useEffect, useContext } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LessonInputModal from "./LessonInputModal";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
const CourseInfo = (props) => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
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
  const getLessons = useCallback(async () => {
    try {
      const response = await fetch(
        "http://80.211.202.81:80/api/educational-activity/"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming the response structure is something like { users: [...] }
      const formattedLessons = data.map((lesson) => ({
        subject: lesson.subject,
        activity_type: lesson.activity_type,
        repetition: lesson.repetition,
        duration: lesson.duration,
        notes: lesson.optional_requirements,
        teacher: lesson.teachers,
        id: lesson.id,
      }));
      const myLessons = formattedLessons.filter(
        (elem) => elem.subject === props.subjectId
      );
      setLessons(myLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setLessons]);

  const deleteLesson = async (lessonID) => {
    try {
      const response = await fetch(
        `http://80.211.202.81:80/api/educational-activity/${lessonID}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete lesson: ${response.statusText}`);
      }

      // If deletion is successful, update the users state
      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson.id !== lessonID)
      );
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };
  const getTeachers = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch(
          "http://80.211.202.81:80/api/user-profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
          (user) => user.role === "teacher"
        );
        setTeachers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // You may want to handle the error here or rethrow it
      }
    }
  }, [setTeachers]);

  useEffect(() => {
    getLessons();

    getTeachers();
  }, [getLessons, getTeachers]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {showInputModal && (
        <LessonInputModal
          setOpen={setShowInputModal}
          open={showInputModal}
          year={props.year}
          subjectId={props.subjectId}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: ".3rem 0",
        }}
      >
        {props.name}
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => props.setSelected("")}
        >
          <RemoveIcon />
        </button>
      </div>
      <p>{props.description}</p>
      <p style={{ marginTop: "8px" }}>Credits: {props.credits}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          padding: "12px",
          marginTop: "8px",
          width: "100%",
        }}
      >
        <p style={{ flex: 1 }}>Type</p>
        <p style={{ flex: 1 }}>Frequency</p>
        <p style={{ flex: 1 }}>Teacher</p>
        <p style={{ flex: 1 }}>Duration</p>
        <p style={{ flex: 1 }}>Notes</p>
        <p>Controlls</p>
      </div>
      {lessons.map((innerElem, index) => {
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e0e0e0",
              padding: "12px",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <div style={{ flex: 1 }}>{innerElem.activity_type}</div>
            <div style={{ flex: 1 }}>{innerElem.repetition}</div>
            <div style={{ flex: 1 }}>
              {
                teachers.find((teacher) => teacher.id == innerElem.teacher)
                  ?.name
              }
            </div>
            <div style={{ flex: 1 }}>{innerElem.duration + " hours"}</div>
            <div style={{ flex: 1 }}>{innerElem.notes}</div>
            <div>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <EditIcon />
              </button>
              {(me.role === "admin" || me.role === "guarantor") && (
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteLesson(innerElem.id)}
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          </div>
        );
      })}
      {(me.role === "admin" || me.role === "guarantor") && (
        <Button
          variant="contained"
          onClick={() => setShowInputModal(true)}
          sx={{ marginTop: 4 }}
        >
          ADD LESSON
        </Button>
      )}
    </div>
  );
};

export default CourseInfo;