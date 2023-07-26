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


import ChatSideBar from "../../components/Chat/ChatSideBar";
import { MdClose } from 'react-icons/md';
import { ImLocation2 } from 'react-icons/im';
import { Navbar, SmallAnnouncement } from "../../components";
import { createConversation } from "../../components/Chat/ChatFunctions";


const Home = () => {
    const userData = useContext(CurrentUserContext);
    console.log(userData.userData)
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
                console.log(ann)
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
                    userData.userData.userType === "student"
                        ?  announcements
                            ? announcements.map((announcement) => (
                                <SmallAnnouncement
                                    key={announcement.id}
                                    titre={announcement.Titre}
                                    image={announcement.Image}
                                    lieu={announcement.Lieu}
                                    prof={announcement.Prof}
                                    currentUserId = {userData.userData.uid}
                                    onClick={() => handlePopupOpen(announcement)}
                                />
                            ))
                            : <p>Vous n'avez pas de cours pour l'instant...</p>
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
                                            <p>Programmation web</p>
                                            <p>Guitare</p>
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

    };
                <ChatSideBar userData={userData.userData} />
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
</div>
                );
};


const AnnouncementPopup = (props) => {
    const [newMessage, setNewMessage] = useState(`Bonjour ${props.prof.Nom}, je suis intéressé par votre cours!`)
    const userData = useContext(CurrentUserContext);

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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('props.currentUserId', userData.uid)
       createConversation(userData.userData.uid, props.prof.Id, newMessage)
       handleClose(e)
      }
      
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const src = `mailto:${props.prof.email}subject=Je voudrais participer à votre cours`

    return (
        <div className="announcement-popup" onClick={handleClose}>
            <div className="announcement-popup__content">
                <div className="announcement-popup__header">
                    <img src={props.image} alt={props.titre} className="announcement-popup__body-thumbnail" />
                    <div className="announcement-popup__header-info">
                        <h2>{props.titre}</h2>
                        <div className="flex mt-[10px]">
                            <img src={props.prof.Image} alt={props.prof.Nom} className="profilPic"/>
                            <p className="ml-[10px]">Avec {props.prof.Nom}</p>
                        </div>
                        <div className="flex mt-[10px]">
                            <ImLocation2/>
                            <p>{props.lieu}</p>
                        </div>
                    </div>
                    <MdClose onClick={() => props.onClose()} className="announcement-popup__header-close" />
                </div>
                <div className="announcement-popup__body mb-[40px]">
                    <p>{props.description}</p>
                </div>
                <div class="py-5 px-5 h-5" >
                    <form className="send-message relative flex" 
                                onSubmit={handleSubmit}
                                >
                                    <input
                                        class="w-full bg-sky py-5 px-3 rounded-xl"
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Ecrivez un message..."
                                    />
                                    <button type="submit"
                                    className="rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 bg-primary focus:outline-none">
                                        Contacter</button>
                                </form>
                            </div>
            </div>
        
        </div>
    );
}

export default Home;