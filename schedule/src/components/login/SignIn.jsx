import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useCallback, useEffect, useContext } from "react";
import { red } from "@mui/material/colors";
import styled from "styled-components";
import SignUp from "./SignUp";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import SubjectsModal from "./SubjectsModal";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
// styled components
const P = styled.p`
  text-allign: center;
  color: red;
`;

export default function SignIn() {
  const [badInput, setBadInput] = useState(false);
  const [me, setMe] = useState({ name: "User User", role: "" });
  const { token } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inputData = {
      login: data.get("login"),
      password: data.get("password"),
    };
    console.log(inputData);
    setBadInput(false);
    if (data.get("login") && data.get("password")) {
      try {
        const response = await fetch("http://80.211.202.81:80/api/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("login"),
            password: data.get("password"),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.access;
          localStorage.setItem("token", token);

          console.log("User logged in successfully!");
          window.location.reload();
        } else {
          console.error("Error logging in:", response.statusText);
          setBadInput(true); // Set badInput to true on login failure
        }
      } catch (error) {
        console.error("An error occurred while logging in:", error);
        setBadInput(true); // Set badInput to true on error
      }
    } else {
      setBadPwd(true);
    }
  };
  useEffect(() => {
    // Check if me.role is student and navigate to /schedule
    if (!isLoading && me.role === "student") {
      navigate("/schedule");
    }
    // If me.role is not student, navigate to /editCourses
    else if (!isLoading && me.role === "scheduler") {
      navigate("/editTables");
    } else if (!isLoading && me.role === "teacher") {
      navigate("/editCourses");
    } else if (!isLoading && me.role === "guarantor") {
      navigate("/editCourses");
    } else if (!isLoading && me.role === "admin") {
      navigate("/editUsers");
    }
  }, [isLoading, me.role, navigate]);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {showModal && <SubjectsModal setOpen={setShowModal} open={showModal} />}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            Schedule Planner
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              name="login"
              autoComplete="login"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {badInput && <P>Unknown user</P>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2"></Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  component={RouterLink}
                  to="/signup"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Button
            variant="contained"
            sx={{ marginTop: 10 }}
            onClick={() => setShowModal(true)}
          >
            Show Subjects
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
