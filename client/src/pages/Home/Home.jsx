import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { signOut } from "firebase/auth";
import { auth, database } from "../../services/firebase";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


import './Home.scss'

import { MdClose } from 'react-icons/md';
import { ImLocation2 } from 'react-icons/im';
import { Navbar, SmallAnnouncement } from "../../components";

const Home = () => {
    const navigate = useNavigate();

    const [announcements , setAnnouncements] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({});

    const handleLogout = async () => {

        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }

    };

    const handlePopupOpen = (data) => {
        const popupContainer = document.createElement("div");
        document.body.appendChild(popupContainer);
        
        setShowPopup(true);
        setPopupData(data);
    }

    const handlePopupClose = () => {
        setShowPopup(false);
        setPopupData({});   
    }

    useEffect(() => {
        getDocs(collection(database, "Annonces")).then((querySnapshot) => {
            const annonces = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnnouncements(annonces);
        });

    }, []); 

    return (
        <div className="p-10 home">
            <Navbar />
            <button onClick={handleLogout}>Sign out</button>

            <div className="smallannouncements" >
                { announcements ? announcements.map((announcement) => ( 
                    <SmallAnnouncement 
                        key={announcement.id}
                        
                        titre={announcement.Titre}
                        image={announcement.Image}
                        lieu={announcement.Lieu}
                        prof={announcement.Prof}

                        onClick={() => handlePopupOpen(announcement)}
                    />
                )) :
                    <p>There is no announcements...</p>
                }
            </div>


            {/* SHOW POPUP… 🦅 */}
            { showPopup && (
                <AnnouncementPopup
                    titre={popupData.Titre}
                    description={popupData.Description}
                    image={popupData.Image}
                    lieu={popupData.Lieu}
                    prof={popupData.Prof}
                    onClose={handlePopupClose}
                />
            )}

        </div>
    );
};

// POPUP… 🦅
const AnnouncementPopup = (props) => {

    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            props.onClose();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
  
    return (
        <div class="announcement-popup" onClick={handleClose}>

            <div className="announcement-popup__content">
                <div className="announcement-popup__header">
                    <h2>{props.titre}</h2>
                    <MdClose onClick={() => props.onClose()} className="announcement-popup__header-close" /> 
                </div>

                <div className="announcement-popup__body">
                    <img src={props.image} alt={props.titre} className="announcement-popup__body-thumbnail" />

                    <p>{props.description}</p>

                    <div className="">
                        <img src={props.prof.Image} alt={props.prof.Nom} />
                        <p>avec {props.prof.Nom}</p>
                    </div>

                    <div>
                        <ImLocation2/>
                        <p>{props.lieu}</p>
                    </div>

                </div>
            </div>    

        </div>
    );
}

export default Home;
