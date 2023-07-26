import {React, useState, useEffect, useRef, useContext} from "react";
import {collection, getDocs, addDoc, setDoc, doc, updateDoc} from "firebase/firestore";
import {auth, database, storage} from "../../services/firebase";

import specifySkill from "../../assets/copines_ski.png"
import logo from "../../assets/images/logoBLeu.png";
import onBoardingStudent from "../../assets/images/onboarding_learning.png";
import onBoardingTeacher from "../../assets/images/onboarding_teacher.png";
import arrow from "../../assets/icons/arrow.svg";
import {createUserWithEmailAndPassword, onAuthStateChanged,updateProfile} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "./AddAnnonce.scss";
import {AuthContext, CurrentUserContext} from "../../services/auth";
import "../../styles/main.scss";
import Dropdown from "../../components/Dropdown/dropdown";
import {ImLocation2} from "react-icons/im";
import {HiCamera} from "react-icons/hi";
import {MdClose, MdPhotoCamera} from "react-icons/md";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";

import Select from "react-select";

// Assume you have a list of cities in France
const citiesInFrance = [
    { label: "Paris", value: "Paris" },
    { label: "Lyon", value: "Lyon" },
    // ...more cities
  ];

const AddAnnonce = () => {
    const userData = useContext(CurrentUserContext);
    const [onboardingTeacherPannel, setOnboardingTeacherPannel] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);
    const [catTeacher, setCatTeacher] = useState("");
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [titreAnnonce, setTitreAnnonce] = useState("");
    const [descAnnonce, setDescAnnonce] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);

    const history = useNavigate();

    console.log(userData)
    function handleUpload(file) {
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage,`/users/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setImage(url)
                });
            }
        );
    }
    const handleChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
        handleUpload(e.target.files[0])
    }
    const sendAnnonce = async () => {
        addDoc(collection(database, "Annonces"), {
            Titre: titreAnnonce,
            Description: descAnnonce,
            Image:image,
            Lieu: selectedCity,
            Prof: {
                Id: userData.userData.uid,
                Image: userData.userData.image,
                Nom: userData.userData.prenom,
            },
        }).then((docRef) => {
            updateDoc(doc(database, "Users", userData.userData.uid), {
                annonces: docRef.id,
            })
        })
        history("/");
    };

    useEffect(() => {
        getDocs(collection(database, "Categories")).then((querySnapshot) => {
            const categoriesListFetch = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesListFetch);
            let subCatList = [];
            categoriesListFetch.map((cat) => {
                cat["sous-cat"].map((subCat) => {
                    subCatList.push(subCat);
                });
            })
            setCategoriesList(subCatList);
        });
    }, []);


    function nextPannelTeacher(index){
        setOnboardingTeacherPannel(index);
        if (index == 0){
            setOnboardingTeacherPannel(0)
            setOnboardingTeacherPannel(0)
        }
    }

    function searchCat(event){
        setSearchText(event.target.value);
        setSearchIsOpen(true);
    }

    const filteredItems = categoriesList.filter((item) =>
        item.toLowerCase().includes(searchText.toLowerCase())
    );
    const maxResults = 5;
    const displayedItems = filteredItems.slice(0, maxResults);

    function addCatFirebase(cat){
        console.log("click");
        addDoc(collection(database, "Categories to add"), {
            name: cat,
        }).then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function selectCatTeacher(cat){
        setCatTeacher(cat);
        setOnboardingTeacherPannel(onboardingTeacherPannel+1)
    }

    const [selectedCity, setSelectedCity] = useState(null);

    return (
        <div className="flex flex-col items-center w-full h-full onboarding p-[60px]">
            <img src={logo} alt="" className="max-w-[300px]"/>
                <div>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-[20px] mt-[20px]">
                            <button className={onboardingTeacherPannel == 1 ? 'btn-tab':onboardingTeacherPannel < 1 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 1 ? ()=>nextPannelTeacher(1): null}>1. Centres d'intérêt</button>
                            <button className={onboardingTeacherPannel == 2 ? 'btn-tab':onboardingTeacherPannel < 2 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 2 ? ()=>nextPannelTeacher(2): null}>2. Descriptif</button>
                            {/*<button className={onboardingTeacherPannel == 3 ? 'btn-tab':onboardingTeacherPannel < 3 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 3 ? ()=>nextPannelTeacher(3): null}>3. Descriptif</button>*/}
                            <button className={onboardingTeacherPannel == 3 ? 'btn-tab':onboardingTeacherPannel < 3 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 3 ? ()=>nextPannelTeacher(3): null}>3. Envoie ton annonce</button>
                        </div>
                        {onboardingTeacherPannel == 1 ? (
                                <div className="my-[40px] flex flex-col items-center w-2/3">
                                    <div className="flex gap-x-[40px]">
                                        <div className="w-1/3">
                                            <div className="w-full bg-sky rounded-[50px] p-10">
                                                <h3 className="text-4xl mb-4">Bon à savoir</h3>
                                                <p>CROSSKILLS te propose d’enseigner et de partager tes connaissances dans plus de 50 disciplines. Utilise le moteur de recherche ou bien sélectionne directement ta matière principale dans le menu et laisse-toi guider pour que l’aventure commence</p>
                                            </div>
                                        </div>
                                        <div className="w-2/3 ml-[40px]">
                                            <h1 className="">Quel compétence souhaites-tu transmettre ?</h1>
                                            <input
                                                className="w-full relative z-[1] input-blanc"
                                                type="text"
                                                placeholder="Essaye piano..."
                                                value={searchText}
                                                onChange={searchCat}/>
                                            {searchIsOpen && searchText !== "" ? (
                                                <ul className="dropdown-list--serach z-0">
                                                    {displayedItems.length == 0 ?
                                                        <li
                                                            key={searchText}
                                                            className="dropdown-item--search"
                                                            onClick={() => addCatFirebase(searchText)}
                                                        >
                                                            {searchText} <span className="text-primary font-bold ml-[10px]">+ Ajouter cette catégorie</span>
                                                        </li>
                                                        : displayedItems.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                className="dropdown-item--search"
                                                                onClick={() => selectCatTeacher(item)}
                                                            >
                                                                {item}
                                                            </li>
                                                        ))}
                                                </ul>
                                            ): (
                                                <div>
                                                    <h4 className="mt-10 mb-6">LES TOP CATÉGORIES...</h4>
                                                    {categories.map(category => (
                                                        <Dropdown
                                                            key={category.id}
                                                            label={category.Nom}
                                                            options={category["sous-cat"]}
                                                            onChange={selectCatTeacher}
                                                        >
                                                        </Dropdown>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className="flex gap-x-4">

                                        <button className="btn-plain" onClick={()=>nextPannelTeacher(2)}>
                                            Suivant
                                        </button>
                                    </div>


                                </div>
                            )
                            :null}
                        {onboardingTeacherPannel == 2 ? (
                                <div className="my-[40px] flex flex-col items-center w-2/3">
                                    <div className="flex gap-x-[40px]">
                                        <div className="w-1/3">
                                            <div className="w-full bg-sky rounded-[50px] p-10">
                                                <h3 className="text-4xl mb-4">Bon à savoir</h3>
                                                <p>CROSSKILLS te propose d’enseigner et de partager tes connaissances dans plus de 50 disciplines. Utilise le moteur de recherche ou bien sélectionne directement ta matière principale dans le menu et laisse-toi guider pour que l’aventure commence</p>
                                            </div>
                                        </div>
                                        <div className="w-2/3 ml-[40px]">
                                            <h1 className="">Vous avez choisi <span className="text-primary">{catTeacher}</span> !</h1>
                                            <h4><span className="text-primary">Titre</span> de votre annonce</h4>
                                            <p>(10 mots maximum)</p>
                                            <input
                                                className="w-full input-text"
                                                type="text"
                                                placeholder="Ex: Cours de piano"
                                                onChange={(e) => setTitreAnnonce(e.target.value)}
                                            />
                                            <h4 className="mt-[20px]"><span className="text-primary">Description</span> de votre annonce</h4>
                                            <p>(150 mots maximum)</p>
                                            <textarea
                                                className="w-full input-text"
                                                rows="10"
                                                placeholder="Ex: Je suis pianiste depuis 10 ans et je propose des cours de piano pour tous niveaux. Je peux me déplacer à votre domicile ou vous recevoir chez moi. N'hésitez pas à me contacter pour plus d'informations."
                                                onChange={(e) => setDescAnnonce(e.target.value)}
                                            />

                                            <Select
                                                value={selectedCity}
                                                onChange={setSelectedCity}
                                                options={citiesInFrance}
                                                isSearchable
                                                placeholder="Select a city..."
                                            />

                                            <div className="flex gap-x-4">
                                                <button className="btn-plain-return bg-white" onClick={()=>nextPannelTeacher(1)}>
                                                    RETOUR
                                                </button>
                                                <button className="btn-plain" onClick={()=>nextPannelTeacher(3)}>
                                                    Suivant
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            :null}
                        {onboardingTeacherPannel == 3 ? (
                            <div className="check-annonce flex flex-col items-center">
                                <h2 className="my-[20px]">Vérifiez votre annonce :</h2>
                                <div className="announcement-popup__header">
                                     <div className="import-image hover:cursor-pointer">
                                            <input type="file" onChange={handleChange} accept="/image/*" className="absolute h-full w-full z-30 opacity-0"/>
                                            <MdPhotoCamera color="white" size={82} className="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] z-20"/>
                                            <div className="absolute h-full w-full bg-black opacity-30 rounded-3xl"></div>
                                            <img src={image} className=" w-full rounded-3xl" alt="photo de profil par défaut" />
                                     </div>
                                    <div className="announcement-popup__header-info">
                                        <h2>{titreAnnonce}</h2>
                                        <div className="flex mt-[10px]">
                                            { userData.userData.image && userData.userData.image != "" ?
                                                <img src={userData.userData.image} alt="" className="profilPic"/>
                                                : <div className="profilPic  empty">
                                                    <p>{userData.userData.prenom.charAt(0)}</p>
                                                </div>
                                            }
                                            <p className="ml-[10px]">Avec {userData.userData.prenom}</p>
                                        </div>
                                        {/*<div className="flex mt-[10px]">*/}
                                        {/*    <ImLocation2/>*/}
                                        {/*    <p>{}</p>*/}
                                        {/*</div>*/}
                                        <div className="mt-[20px]">
                                            <h3>A propos de votre cours</h3>
                                            <p>{descAnnonce}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-plain hover:cursor-pointer" onClick={()=> sendAnnonce()}>
                                    Envoyer
                                </div>
                            </div>
                            )
                            :null}
                    </div>
                </div>
        </div>
    );
};


export default AddAnnonce;
