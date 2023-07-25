import {React, useState, useEffect, useRef, useContext} from "react";
import {collection, getDocs, addDoc, setDoc, doc, updateDoc} from "firebase/firestore";
import { auth, database} from "../../services/firebase";

import specifySkill from "../../assets/copines_ski.png"
import logo from "../../assets/images/logoBLeu.png";
import onBoardingStudent from "../../assets/images/onboarding_learning.png";
import onBoardingTeacher from "../../assets/images/onboarding_teacher.png";
import arrow from "../../assets/icons/arrow.svg";
import {createUserWithEmailAndPassword, onAuthStateChanged,updateProfile} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "./Onboarding.scss";
import {AuthContext} from "../../services/auth";
import "../../styles/main.scss";
import Dropdown from "../../components/Dropdown/dropdown";



const Onboarding = () => {
    const [onboardingStudentPannel, setOnboardingStudentPannel] = useState(0);
    const [onboardingTeacherPannel, setOnboardingTeacherPannel] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [catTeacher, setCatTeacher] = useState("");
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [userType, setUserType] = useState('student');
    const [titreAnnonce, setTitreAnnonce] = useState("");
    const [descAnnonce, setDescAnnonce] = useState("");
    const [categories, setCategories] = useState([]);
    const [userCat, setUserCat] = useState([]);
    const authRefs = {
        registerEmailInput: useRef(),
        registerPasswordInput: useRef(),
        registerNameInput: useRef(),
        registerAgeInput: useRef(),
    };
    const [categoriesList, setCategoriesList] = useState([]);
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [authError, setAuthError] = useState("");


    const register = async () => {
        let annonce = [];
        if (userType === "student") {
            annonce= [];
        }else if(userType === "teacher"){
            addDoc(collection(database, "Annonces"), {
                Titre: titreAnnonce,
                Description: descAnnonce,
            }).then((docRef) => {
                annonce.push(docRef.id);
            })
        }
            createUserWithEmailAndPassword(
                auth,
                authRefs.registerEmailInput.current.value,
                authRefs.registerPasswordInput.current.value
            ).then((userCredential) => {
                updateProfile(auth.currentUser, {
                    displayName: authRefs.registerNameInput.current.value,
                });
                setAuthError("")
                const user = userCredential.user;
                console.log(user.uid);
                setDoc(doc(database, "Users", user.uid), {
                    email: user.email,
                    userType: userType,
                    categories: userCat,
                    prenom: authRefs.registerNameInput.current.value,
                    age: authRefs.registerAgeInput.current.value,
                    annonces: annonce,
                    bio: "",
                    image: "",
                    nom: "",
                    uid: user.uid,
                    participateTo: [],
                    lookingFor: [],
                }).then((docRef) => {
                    if(userType === "teacher"){
                        updateDoc(doc(database, "Annonces", annonce[0]), {
                            Prof:docRef.id,
                        })
                    }

                });
                history("/");
            })
            .catch((error) => {
                console.log(error.message)
                if (error.code === "auth/email-already-in-use") {
                    setAuthError("Un compte existe déjà avec cette adresse email.")
                }else if(error.code === "auth/weak-password"){
                    setAuthError("Le mot de passe doit être de plus de 6 caractères.")
                }else{
                    setAuthError(error.message)
                }
            })
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
        onAuthStateChanged(auth, (user) => {
            setUser(auth.currentUser);
        });
    }, []);


    function nextPannelStudent(index){
        setOnboardingStudentPannel(index);
        if (index == 0){
            setOnboardingTeacherPannel(0)
            setOnboardingTeacherPannel(0)
        }
    }
    function nextPannelTeacher(index){
        setOnboardingTeacherPannel(index);
        if (index == 0){
            setOnboardingTeacherPannel(0)
            setOnboardingTeacherPannel(0)
        }
    }

    function selectUserType(type){
        setSelectedCategories(false)
        setUserType(type);
        if (type == 'student'){
            setOnboardingStudentPannel(onboardingStudentPannel+1)
        }else if (type == 'teacher'){
            setOnboardingTeacherPannel(onboardingTeacherPannel+1)
        }
    }

    function selectCat(cat){
        if (userCat.includes(cat)){
            setUserCat(userCat.filter(item => item !== cat))
        }else{
            setUserCat([...userCat, cat])
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

    return (
        <div className="flex flex-col items-center w-full h-full onboarding p-[60px]">
            <img src={logo} alt="" className="max-w-[300px]"/>
            {selectedCategories ? (
                <div className="flex my-[40px] gap-[40px]">
                    <button className="max-w-[500px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('student')}>
                        <img className="" src={onBoardingStudent} alt=""/>
                        <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                            <p className="p-role">Je souhaite apprendre des connaissances</p>
                        </div>
                    </button>
                    <button className="max-w-[500px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('teacher')}>
                        <img className="" src={onBoardingTeacher} alt=""/>
                        <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                            <p className="p-role">Je souhaite partager mes connaissances</p>
                        </div>
                    </button>
                </div>
            ) : (
                <div>
                    {
                        userType == 'student' ? (
                            <div className="flex flex-col items-center">
                                <div className="flex gap-[20px] mt-[20px]">
                                    <button className={onboardingStudentPannel == 1 ? 'btn-tab':onboardingStudentPannel < 1 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingStudentPannel > 1 ? ()=>nextPannelStudent(1): null}>1. Centres d'intérêt</button>
                                    <button className={onboardingStudentPannel == 2 ? 'btn-tab':onboardingStudentPannel < 2 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingStudentPannel > 2 ? ()=>nextPannelStudent(2): null}>2. Dernières informations</button>
                                </div>
                                {onboardingStudentPannel == 1 ? (
                                        <div className="my-[40px] flex flex-col items-center w-2/3">
                                            <div className="flex gap-x-[40px]">
                                                <div className="w-1/3">
                                                    <div className="w-full bg-sky rounded-[50px] p-10">
                                                        <h3 className="mb-[30px]">Bon à savoir</h3>
                                                        <p>CROSSKILLS te propose d’enseigner et de partager tes connaissances dans plus de 50 disciplines. Utilise le moteur de recherche ou bien sélectionne directement ta matière principale dans le menu et laisse-toi guider pour que l’aventure commence</p>
                                                    </div>
                                                </div>
                                                <div className=" ml-[40px] w-2/3">
                                                    <h1 >Dans quel domaine souhaites tu apprendre de nouvelles connaissances ?</h1>
                                                    <h4 className="mt-10 mb-6">LES TOP CATÉGORIES...</h4>
                                                            {categories.map(category => (
                                                                <Dropdown
                                                                    key={category.id}
                                                                    label={category.Nom}
                                                                    options={category["sous-cat"]}
                                                                    onChange={selectCat}
                                                                        >
                                                                </Dropdown>
                                                            ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-x-4">
                                                <button className="btn-plain-return bg-white" onClick={()=>{
                                                    nextPannelStudent(0)
                                                    setUserCat([]);
                                                    setSelectedCategories(true)
                                                }}>
                                                    Retour
                                                </button>
                                                <button className="btn-plain" onClick={()=> {
                                                    console.log(userCat)
                                                    nextPannelStudent(2)
                                                }}>
                                                    Suivant
                                                </button>
                                            </div>
                                        </div>
                                    )
                                    :null}
                                {onboardingStudentPannel == 2 ? (
                                        <div className="my-[40px] flex flex-col items-center w-2/3">
                                            <div className="flex gap-x-[40px]">
                                                <div className="w-1/3">
                                                    <div className="w-full bg-sky rounded-[50px] p-10">
                                                        <h3 className="mb-[30px]">Bon à savoir</h3>
                                                        <p>CROSSKILLS te propose d’enseigner et de partager tes connaissances dans plus de 50 disciplines. Utilise le moteur de recherche ou bien sélectionne directement ta matière principale dans le menu et laisse-toi guider pour que l’aventure commence</p>
                                                    </div>
                                                </div>
                                                <div className=" ml-[40px] w-2/3">
                                                    <h1>Encore quelques informations pour completer ton profil</h1>
                                                    <div className="flex flex-wrap items-center gap-x-[40px] my-[40px] gap-y-[30px]">
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Prénom :</p>
                                                            <input
                                                                className="input"
                                                                type="text"
                                                                placeholder="Nom"
                                                                ref={authRefs.registerNameInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Date de naissance :</p>
                                                            <input
                                                                className="input"
                                                                type="date"
                                                                placeholder="Date de naissance"
                                                                ref={authRefs.registerAgeInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Email :</p>
                                                            <input
                                                                className="input"
                                                                type="email"
                                                                placeholder="Email"
                                                                ref={authRefs.registerEmailInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Mot de passe :</p>
                                                            <input
                                                                className="input"
                                                                type="password"
                                                                placeholder="Mot de passe"
                                                                ref={authRefs.registerPasswordInput}
                                                            />
                                                        </div>




                                                        <div className="flex gap-x-4">
                                                            <button className="btn-plain-return bg-white" onClick={()=> {
                                                                setUserCat([]);
                                                                nextPannelStudent(1)
                                                            }}>
                                                                Retour
                                                            </button>
                                                            <button className="btn-plain" onClick={register}>
                                                                Créer mon compte
                                                            </button>
                                                        </div>

                                                        <br /><p className="text-red">{authError}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :null}
                            </div>
                        ): null
                    }
                    {
                        userType == 'teacher' ? (
                            <div className="flex flex-col items-center">
                                <div className="flex gap-[20px] mt-[20px]">
                                    <button className={onboardingTeacherPannel == 1 ? 'btn-tab':onboardingTeacherPannel < 1 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 1 ? ()=>nextPannelTeacher(1): null}>1. Centres d'intérêt</button>
                                    <button className={onboardingTeacherPannel == 2 ? 'btn-tab':onboardingTeacherPannel < 2 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 2 ? ()=>nextPannelTeacher(2): null}>2. Descriptif</button>
                                    {/*<button className={onboardingTeacherPannel == 3 ? 'btn-tab':onboardingTeacherPannel < 3 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 3 ? ()=>nextPannelTeacher(3): null}>3. Descriptif</button>*/}
                                    <button className={onboardingTeacherPannel == 3 ? 'btn-tab':onboardingTeacherPannel < 3 ? 'btn-empty-hidden': 'btn-tab_empty'} onClick={onboardingTeacherPannel > 3 ? ()=>nextPannelTeacher(3): null}>3. Compte</button>
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
                                                        className="w-full relative z-[1]"
                                                        type="text"
                                                        placeholder="Essaye piano"
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
                                                <button className="btn-plain-return bg-white" onClick={()=> {
                                                    nextPannelTeacher(0)
                                                    setUserCat([]);
                                                    setSelectedCategories(true)
                                                }}>
                                                    Retour
                                                </button>
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
                                {/*{onboardingTeacherPannel == 3 ? (*/}
                                {/*    <div>*/}
                                {/*        <h1>Plus que quelques détails...</h1>*/}
                                {/*        <p>{titreAnnonce}</p>*/}
                                {/*        <p>{descAnnonce}</p>*/}
                                {/*    </div>*/}
                                {/*    )*/}
                                {/*    :null}*/}
                                {onboardingTeacherPannel == 3 ? (
                                        <div className="my-[40px] flex flex-col items-center w-2/3">
                                            <div className="flex gap-x-[40px]">
                                                <div className="w-1/3">
                                                    <div className="w-full bg-sky rounded-[50px] p-10">
                                                        <h3 className="mb-[30px]">Bon à savoir</h3>
                                                        <p>CROSSKILLS te propose d’enseigner et de partager tes connaissances dans plus de 50 disciplines. Utilise le moteur de recherche ou bien sélectionne directement ta matière principale dans le menu et laisse-toi guider pour que l’aventure commence</p>
                                                    </div>
                                                </div>
                                                <div className=" ml-[40px] w-2/3">
                                                    <h1>Encore quelques informations pour completer ton profil</h1>
                                                    <div className="flex flex-wrap items-center gap-x-[40px] my-[40px] gap-y-[30px]">
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Prénom :</p>
                                                            <input
                                                                className="input"
                                                                type="text"
                                                                placeholder="Nom"
                                                                ref={authRefs.registerNameInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Date de naissance :</p>
                                                            <input
                                                                className="input"
                                                                type="date"
                                                                placeholder="Date de naissance"
                                                                ref={authRefs.registerAgeInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Email :</p>
                                                            <input
                                                                className="input"
                                                                type="email"
                                                                placeholder="Email"
                                                                ref={authRefs.registerEmailInput}
                                                            />
                                                        </div>
                                                        <div className="w-[45%]">
                                                            <p className="text-primary">Mot de passe :</p>
                                                            <input
                                                                className="input"
                                                                type="password"
                                                                placeholder="Mot de passe"
                                                                ref={authRefs.registerPasswordInput}
                                                            />
                                                        </div>

                                                        <div className="flex gap-x-4">
                                                            <button className="btn-plain-return bg-white" onClick={()=> {
                                                                setUserCat([]);
                                                                nextPannelTeacher(2)
                                                            }}>
                                                                Retour
                                                            </button>
                                                            <button className="btn-plain" onClick={register}>
                                                                Créer mon compte
                                                            </button>
                                                        </div>

                                                        <br /><p className="text-red">{authError}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :null}
                            </div>
                        ):null
                    }
                </div>
            )
            }



        </div>
    );
};


export default Onboarding;
