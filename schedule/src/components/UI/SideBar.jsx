import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import EditIcon from "@mui/icons-material/Edit";
import Home from "@mui/icons-material/Home";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate, useLocation } from "react-router-dom";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import { useState, useCallback, useEffect, useContext } from "react";
import { MyContext } from "../../App.jsx";
import { apiUrl } from "../../utils/consts.js";
const SidebarItem = (props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(props.navigate);
  };
  const location = useLocation();
  const isActive = location.pathname === props.navigate;
  return (
    <ListItem
      disablePadding
      onClick={handleClick}
      sx={{ backgroundColor: isActive ? "#e0e0e0" : "transparent" }}
    >
      <ListItemButton component="a" href="#">
        <ListItemIcon style={{ marginRight: "-20px" }}>
          {props.logo}
        </ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItemButton>
    </ListItem>
  );
};

const SideBar = () => {
  const navigate = useNavigate();
  const { token } = useContext(MyContext);
  const [me, setMe] = useState({ name: "User User", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Perform any other cleanup actions if neede
    // Navigate to the login page or any other desired page after logout
    navigate("/");
    window.location.reload();
  };

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

  return (
    <Box
      bgcolor="none"
      flex={1}
      borderRight="1px solid #e0e0e0"
      maxWidth="240px"
    >
      <List sx={{ padding: 0 }}>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemText>{me.name.split(" ")[0]}</ListItemText>
        </ListItem>
        <ListItem sx={{ paddingTop: 0 }}>
          <ListItemText>{me.name.split(" ")[1]}</ListItemText>
        </ListItem>
        <ListItem sx={{ paddingTop: 0, paddingBottom: "40px" }}>
          <ListItemText>{me.role}</ListItemText>
        </ListItem>
        <Divider />
        {me.role === "student" && (
          <>
            <SidebarItem
              name={"Schedule"}
              logo={<Home />}
              navigate={"/schedule"}
            />
            <SidebarItem
              name={"Subject Registration"}
              logo={<AppRegistrationIcon />}
              navigate={"/subjectReg"}
            />
          </>
        )}
        {(me.role === "admin" ||
          me.role === "scheduler" ||
          me.role === "teacher" ||
          me.role === "guarantor") && (
          <>
            {me.role === "admin" && (
              <>
                {" "}
                <SidebarItem
                  name={"Edit Users"}
                  logo={<EditIcon />}
                  navigate={"/editUsers"}
                />
              </>
            )}
            <SidebarItem
              name={"Edit Rooms"}
              logo={<RoomServiceIcon />}
              navigate={"/editRooms"}
            />
            {(me.role === "admin" ||
              me.role === "teacher" ||
              me.role === "guarantor") && (
              <SidebarItem
                name={"Edit Courses"}
                logo={<DesignServicesIcon />}
                navigate={"/editCourses"}
              />
            )}
            <SidebarItem
              name={"Edit Timetables"}
              logo={<EditCalendarIcon />}
              navigate={"/editTables"}
            />
          </>
        )}

        <Divider />
        <ListItem alignItems="center">
          <ListItemIcon
            sx={{ paddingBottom: 2, paddingTop: 2, marginRight: 0 }}
            onClick={handleLogout}
          >
            <LogoutIcon
              fontSize="large"
              style={{ transform: "scaleX(-1)", cursor: "pointer" }}
            />
          </ListItemIcon>
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
};
export default SideBar;
