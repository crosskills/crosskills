import React from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, database } from "../../services/firebase";
import {Navigate, redirect} from "react-router-dom";

const Home = () => {
    const logout = async () => {
        try{
            await signOut(auth);
            <Navigate to="/login"/>
        }catch (error) {
            console.error(error.message);
        }
    };
  return (
      <div>
        <h1>Home</h1>
        <button onClick={logout}>Sign out</button>
      </div>
  );
};

export default Home;