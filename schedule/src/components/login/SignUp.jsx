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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link as RouterLink } from "react-router-dom";

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

export default function SignUp() {
  const [role, setRole] = React.useState("");
  const [year, setYear] = React.useState("");
  const [badPwd, setBadPwd] = React.useState(false);
  const [emptyForm, setEmptyForm] = React.useState(false);

  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };
  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requiredFields = [
      "firstName",
      "lastName",
      "login",
      "password",
      "passwordRepeat",
    ];
    const isFormEmpty = requiredFields.some(
      (field) => !data.get(field) || !data.get(field).trim()
    );
    if (isFormEmpty) {
      setEmptyForm(true);
      return;
    } else {
      if (role == "") {
        setEmptyForm(true);
      } else {
        if (role === "student" && year == "") {
          setEmptyForm(true);
        } else {
          setEmptyForm(false);
        }
      }
    }
    if (data.get("password") === data.get("passwordRepeat")) {
      setBadPwd(false);
      // Append role and year to FormData
      data.append("role", role);
      if (role === "student") {
        data.append("year", year);
      }
      console.log({
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        login: data.get("login"),
        password: data.get("password"),
        role: data.get("role"),
        year: data.get("year"),
      });
      if (!emptyForm && !badPwd) {
        const requestBody = {
          username: data.get("login"),
          password: data.get("password"),
          user_type: data.get("role"),
          first_name: data.get("firstName"),
          last_name: data.get("lastName"),
        };

        if (data.get("role") === "student") {
          requestBody.year_of_study = year; // Assuming `year` is the variable you want to include
        }
        try {
          const response = await fetch(
            "http://80.211.202.81:80/api/user-profile/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            console.log("User created successfully!");
          } else {
            console.error("Error creating user:", response.statusText);
          }
        } catch (error) {
          console.error("An error occurred while creating the user:", error);
        }
      }
    } else {
      setBadPwd(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="role"
                    onChange={handleChangeRole}
                  >
                    <MenuItem value={"student"}>Student</MenuItem>
                    <MenuItem value={"teacher"}>Teacher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {role == "student" && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Year of study
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={year}
                      label="Year of study"
                      onChange={handleChangeYear}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="login"
                  label="Login"
                  name="login"
                  autoComplete="login"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={badPwd}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                <TextField
                  error={badPwd}
                  margin="normal"
                  required
                  fullWidth
                  name="passwordRepeat"
                  label="Repeat password"
                  type="password"
                  id="repeatPassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            {emptyForm && (
              <p style={{ color: "red" }}>Please fill up all the fields</p>
            )}

            {badPwd && (
              <p style={{ color: "red" }}>Passwords are not the same</p>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" component={RouterLink} to="/">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
