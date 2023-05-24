import React, { useState, useEffect, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, database } from "../../services/firebase";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../services/auth";
import {CurrentUserContext} from "../../services/auth";


import './Home.scss'

import { Navbar, Announcement } from "../../components";

const Home = () => {
    const userData = useContext(CurrentUserContext);
    const user = {prenom: "",userType: ""}
    const [announcements , setAnnouncements] = useState([]);
    useEffect(() => {
        getDocs(collection(database, "Annonces")).then((querySnapshot) => {
            const annonces = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnnouncements(annonces);
        });
    }, [userData]);

    const navigate = useNavigate();

    const logout = async () => {

        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }

    };
    
  return (
      <div className="p-10 home">
        <Navbar
            user={userData}
        />
        <button onClick={logout}>Sign out</button>
        { announcements ? announcements.map((announcement) => (
            <div className="smallannouncements" key={announcement.id}>
                <Announcement key={announcement.id} title={announcement.Titre} />
            </div>
        )) :
            <p>There is no announcements...</p>
        }
      </div>
  );
};

export default Home;