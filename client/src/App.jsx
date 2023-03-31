import { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import { AuthProvider } from "./services/auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Onboarding from "./pages/Onboarding/Onboarding";

function App() {
  return(
      <AuthProvider>
          <Router>
              <Routes>
                  <Route exact path='/' element={<PrivateRoute/>}>
                        <Route exact path='/' element={<Home/>}/>
                  </Route>
                  <Route exact path="/onboarding" element={<Onboarding/>} />
                  <Route exact path="/login" element={<Login/>} />
              </Routes>
          </Router>
      </AuthProvider>
  )};
export default App;
