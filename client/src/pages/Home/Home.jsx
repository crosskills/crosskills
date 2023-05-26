import React, { useState, useEffect, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth, database  } from "../../services/firebase";
import { collection, getDocs, addDoc, setDoc, doc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../services/auth";
import {CurrentUserContext} from "../../services/auth";
import {HiOutlinePlusSm} from "react-icons/hi";


import './Home.scss'

import { MdClose } from 'react-icons/md';
import { ImLocation2 } from 'react-icons/im';
import { Navbar, SmallAnnouncement } from "../../components";

const Home = () => {
    const userData = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [announcements , setAnnouncements] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [annonces, setAnnonces] = useState([]);
    const [popupData, setPopupData] = useState({});
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
    useEffect( () => {
        getDocs(collection(database, "Annonces")).then((querySnapshot) => {
            const annonces = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnnouncements(annonces);
        });
        if (userData.userData.userType === "teacher") {
            async function getTeacherAnnouncements() {
                let ann = [];
                const q = query(collection(database, "Annonces"), where("Prof.Id", "==", userData.userData.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    ann.push(doc.data());
                });
                setAnnonces(ann);
            }

            getTeacherAnnouncements()
            console.log(annonces)
        }
    }, []); 

    return (
        <div className="p-10 home flex flex-col items-center">
            <Navbar user={userData}/>
            {/*<button onClick={handleLogout}>Sign out</button>*/}
            <div className="smallannouncements body" >
                {
                    userData.userType === "student"
                        ?  announcements
                            ? announcements.map((announcement) => (
                                <SmallAnnouncement
                                    key={announcement.id}

                                    titre={announcement.Titre}
                                    image={announcement.Image}
                                    lieu={announcement.Lieu}
                                    prof={announcement.Prof}

                                    onClick={() => handlePopupOpen(announcement)}
                                />
                            ))
                            : <p>There is no announcements...</p>
                        : <div className="body teacher">
                            <div className="teacher-info">
                                <h1>Vos Cours</h1>
                                <div className="w-full flex items-start justify-between gap-[30px] mt-[20px]">
                                    <div className="btn-plain btn-teacher w-1/2 flex items-center justify-between hover:cursor-pointer" onClick={()=> navigate("/annonce")}>
                                        Créer un cours <HiOutlinePlusSm className="icon-plus ml-[10px]"/>
                                    </div>
                                    <div className="w-1/2 flex flex-col">
                                        <p className="font-bold mb-[10px]">Les cours les plus recherché ces derniers temps :</p>
                                        <div className="flex flex-wrap famous-class">
                                            <p>Tennis</p>
                                            <p>Tennis</p>
                                            <p>Tennis</p>
                                            <p>Tennis</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3>Cours Actifs</h3>
                                    <div className="active-cours mt-[20px]">
                                    {
                                        annonces && annonces.length >= 1 ? annonces.map((annonce) => (
                                            <div className="active-cour flex items-center mb-[20px]">
                                                <img src={annonce.Image} alt=""/>
                                                <div className="flex flex-col ml-[20px]">
                                                    <p className="cour-title">{annonce.Titre}</p>
                                                    <p>{annonce.Lieu}</p>
                                                </div>
                                            </div>
                                        )): <p>There is no announcements...</p>
                                    }
                                    </div>
                                </div>
                            </div>
                            </div>

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
