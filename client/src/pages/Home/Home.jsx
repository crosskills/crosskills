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

                    <img src={props.image} alt={props.titre} className="announcement-popup__header-thumbnail" />

                    <div className="">

                        <h2>{props.titre}</h2>

                        <div className="announcement-popup__header-author">
                            <div className="flex gap-3 items-center">
                                <img src={props.prof.Image} alt={props.prof.Nom} />
                                <p>avec {props.prof.Nom}</p>
                            </div>

                            <div className="flex gap-1 items-center mt-3">
                                <ImLocation2 className="text-lg"/>
                                <p>{props.lieu}</p>
                            </div>    
                        </div>

                    </div>

                    <MdClose onClick={() => props.onClose()} className="announcement-popup__header-close" />
                </div>

                <div className="announcement-popup__body mt-6 flex gap-12">

                    <div className="w-3/5 flex flex-col gap-8">
                        <div className="announcement-popup__body-apropos">
                            <h3 className="text-black capitalize">A propos du cours</h3>

                            <p className="text-base font-normal">{props.description}</p>
                        </div>

                        <div className="announcement-popup__body-apropos-author">
                            <h4>A propos de {props.prof.Nom}</h4>

                            <p className="text-base font-normal">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque sit incidunt, dolore consectetur tenetur ad ipsam. Laborum, veniam natus. Vitae!</p>
                        </div>

                        <div className="announcement-popup__body-avis">
                            <h4>Avis</h4>
                            <br /><br /><br />
                        </div>
                    </div>

                    <div className="flex-col text-black">

                        <div>
                            Tous niveaux
                        </div>

                        <div>
                            Français
                        </div>
                    </div>

                </div>
            </div>    

        </div>
    );
}

export default Home;
