import React from "react";
import SideBar from "../UI/SideBar";
import { Box, Stack } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useState, useCallback, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { apiUrl } from "../../utils/consts";
import Popup from "../UI/Popup";
const EditUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [year, setYear] = useState("");
  const { token, showPopup, popupContent } = useContext(MyContext);
  const [badPwd, setBadPwd] = React.useState(false);
  const [emptyForm, setEmptyForm] = React.useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
    passwordRepeat: "",
  });
  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const getUsers = useCallback(async () => {
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
        password: user.password,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // You may want to handle the error here or rethrow it
    }
  }, [setUsers]);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/api/user-profile/${userId}/`, {
        Authorization: `Bearer ${token}`,
        method: "DELETE",
      });
      if (response.ok) {
        showPopup("User deleted successfully!", "good");
      }
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      // If deletion is successful, update the users state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      showPopup("Error deleting user, something went wrong", "bad");
    }
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);
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
          const response = await fetch(`${apiUrl}/api/user-profile/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            console.log("User created successfully!");
            setFormData({
              firstName: "",
              lastName: "",
              login: "",
              password: "",
              passwordRepeat: "",
            });

            // Reset role and year
            setRole("");
            setYear("");
            showPopup("User created successfully", "good");
            getUsers();
          } else {
            console.error("Error creating user:", response.statusText);
            showPopup(
              "Error creating user :-( Try different login and password",
              "bad"
            );
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
    <Box sx={{ margin: "0 auto", width: "100%", maxWidth: "1200px" }}>
      <Stack direction="row">
        <SideBar />

        <Box flex={6} padding={4}>
          <div style={{ maxWidth: "1000px" }}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              {popupContent && (
                <Popup text={popupContent.text} type={popupContent.type} />
              )}
              <Grid container spacing={2} sx={{ display: "flex" }}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-firstName"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-lastName"
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    label="Second Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="username"
                    name="login"
                    required
                    fullWidth
                    id="login"
                    label="Login"
                    value={formData.login}
                    onChange={(e) => handleInputChange("login", e.target.value)}
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
                      <MenuItem value={"scheduler"}>Scheduler</MenuItem>
                      <MenuItem value={"admin"}>Admin</MenuItem>
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
                    error={badPwd}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
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
                    value={formData.passwordRepeat}
                    onChange={(e) =>
                      handleInputChange("passwordRepeat", e.target.value)
                    }
                  />
                </Grid>
                {emptyForm && (
                  <p style={{ color: "red" }}>Please fill up all the fields</p>
                )}

                {badPwd && (
                  <p style={{ color: "red" }}>Passwords are not the same</p>
                )}
                <Grid item xs={12}>
                  <Button variant="contained" type="submit">
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Role</TableCell>
                    <TableCell align="right">Login</TableCell>
                    <TableCell align="right">Controls</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                      <TableCell align="right">{row.login}</TableCell>
                      <TableCell align="right">
                        <button
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            marginLeft: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteUser(row.id)}
                        >
                          <DeleteIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditUsers;
