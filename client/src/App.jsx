import { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/login.jsx";
import SignUp from "./pages/Sign Up/signUp.jsx";
import { AuthProvider } from "./services/auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";

function App() {
  return(
      <AuthProvider>
          <Router>
              <Routes>
                  <Route exact path='/' element={<PrivateRoute/>}>
                      <Route exact path='/' element={<Home/>}/>
                  </Route>
                  <Route exact path="/login" element={<Login/>} />
                  <Route exact path="/signup" element={<SignUp/>} />
              </Routes>
          </Router>
      </AuthProvider>
  )};
export default App;
