import { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Onboarding from "./pages/Onboarding/Onboarding";
import Profile from "./pages/Profile/Profile.jsx";
import {Home} from "./pages";
import Login from "./pages/Login/Login.jsx";
import AddAnnonce from "./pages/AddAnnonce/AddAnnonce";
import {signOut} from "firebase/auth";
import {auth} from "./services/firebase";


function App() {

  return(
      <AuthProvider>
          <Router>
              <Routes>
                  <Route exact path='/' element={<PrivateRoute/>}>
                      <Route exact path='/' element={<Home/>}/>
                      <Route exact path="/profile" element={<Profile/>} />
                      <Route exact path="/annonce" element={<AddAnnonce/>} />
                  </Route>
                  <Route exact path="/onboarding" element={<Onboarding/>} />
                  <Route exact path="/login" element={<Login/>} />
              </Routes>
          </Router>
      </AuthProvider>
  )};
export default App;
