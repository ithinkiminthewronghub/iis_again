import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState, useEffect, useCallback } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SubjectsModal = (props) => {
  const [subjects, setSubjects] = useState([]);

  const getSubjects = useCallback(async () => {
    try {
      const response = await fetch("http://80.211.202.81:80/api/course/");

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects: ${response.statusText}`);
      }

      const data = await response.json();
      // Assuming the response structure is something like { users: [...] }
      const formattedSubjects = data.map((subject) => ({
        id: subject.id,
        shortcut: subject.name,
        description: subject.annotation,
      }));
      setSubjects(formattedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setSubjects]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* Your content goes here */}
          <List>
            {subjects.map((elem) => {
              return (
                <ListItem
                  key={elem.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <p style={{ fontSize: "1.5rem" }}>{elem.shortcut}</p>
                  <p>{elem.description}</p>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Modal>
    </div>
  );
};

export default SubjectsModal;
