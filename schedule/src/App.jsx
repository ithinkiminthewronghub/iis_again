import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SignUp";
import NoPage from "./components/UI/NoPage";
import Schedule from "./components/app/Schedule";
import SubjectReg from "./components/app/SubjectReg";
import EditUsers from "./components/app/EditUsers";
import EditCourses from "./components/app/EditCourses";
import EditTables from "./components/app/EditTables";
import EditRooms from "./components/app/EditRooms";
import { createContext, useEffect, useState } from "react";

export const MyContext = createContext("");

function App() {
  const [token, setToken] = useState("");
  const showPopup = (text, type) => {
    // You can add logic here to show the popup as needed
    // For now, let's use state to manage the popup content
    setPopupContent({ text, type });
    setTimeout(() => {
      setPopupContent(null);
    }, 3000);
  };
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    // Fetch the token from localStorage during component initialization
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    // Set up an event listener to update the token when it changes in localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      if (updatedToken !== token) {
        setToken(updatedToken);
      }
    };

    // Add the event listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={{ token, showPopup, popupContent }}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/subjectReg" element={<SubjectReg />} />
            <Route path="/editUsers" element={<EditUsers />} />
            <Route path="/editRooms" element={<EditRooms />} />
            <Route path="/editCourses" element={<EditCourses />} />
            <Route path="/editTables" element={<EditTables />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
