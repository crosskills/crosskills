import {React, useState, useEffect, useRef, useContext} from "react";
import {collection, getDocs, addDoc, setDoc, doc} from "firebase/firestore";
import { auth, database } from "../../services/firebase";
import logo from "../../assets/images/logoBLeu.png";
import onBoardingStudent from "../../assets/images/onboarding_learning.png";
import onBoardingTeacher from "../../assets/images/onboarding_teacher.png";
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "./Onboarding.scss";
import {AuthContext} from "../../services/auth";


const Onboarding = () => {
    const [onboardingStudentPannel, setOnboardingStudentPannel] = useState(0);
    const [onboardingTeacherPannel, setOnboardingTeacherPannel] = useState(0);
    const [userType, setUserType] = useState('student');
    const [categories, setCategories] = useState([]);
    const [userCat, setUserCat] = useState([]);
    const authRefs = {
        registerEmailInput: useRef(),
        registerPasswordInput: useRef(),
        registerNameInput: useRef(),
        registerAgeInput: useRef(),
    };
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [authError, setAuthError] = useState("");


    const register = async () => {
            createUserWithEmailAndPassword(
                auth,
                authRefs.registerEmailInput.current.value,
                authRefs.registerPasswordInput.current.value
            ).then((userCredential) => {
                setAuthError("")
                console.log(userCredential)
                const user = userCredential.user;
                setDoc(doc(database, "Users", user.uid), {
                    email: user.email,
                    userType: userType,
                    categories: userCat,
                    prenom: authRefs.registerNameInput.current.value,
                    age: authRefs.registerAgeInput.current.value,
                    annonces: [],
                    bio: "",
                    image: "",
                    nom: "",
                    lookingFor: [],
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
            const categoriesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesList);
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

    return (
        <div className="flex flex-col items-center w-full h-full onboarding p-[60px]">
            <img src={logo} alt="" className="max-w-[300px]"/>
            {
                userType == 'student' ? (
                    <div className="flex flex-col items-center">
                        <div className="flex gap-[20px] mt-[20px]">
                            <button className={onboardingStudentPannel == 0 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelStudent(0)}>1. Type de profil</button>
                            <button className={onboardingStudentPannel == 1 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelStudent(1)}>2. Centres d'intérêt</button>
                            <button className={onboardingStudentPannel == 2 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelStudent(2)}>3. Dernières informations</button>
                        </div>
                        {onboardingStudentPannel == 0 ? (
                                <div className="flex flex-col items-center mt-[60px]">
                                    <h1>Que recherches-tu dans notre application ?</h1>
                                    <div className="flex mt-[60px] gap-[40px]">
                                        <button className="max-w-[400px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('student')}>
                                            <img className="" src={onBoardingStudent} alt=""/>
                                            <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                                                <p className="p-role">Je souhaite apprendre des connaissances</p>
                                            </div>
                                        </button>
                                        <button className="max-w-[400px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('teacher')}>
                                            <img className="" src={onBoardingTeacher} alt=""/>
                                            <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                                                <p className="p-role">Je souhaite partager mes connaissances</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )
                            :null}
                        {onboardingStudentPannel == 1 ? (
                                <div className="mt-[60px] flex flex-col items-center w-2/3">
                                    <h1 className="text-center">Dans quel domaine souhaites tu apprendre de nouvelles connaissances ?</h1>
                                    <ul className="flex flex-wrap gap-x-[40px] w-1/2 justify-center gap-y-[10px] my-[40px]">
                                        {categories.map(category => (
                                            <li key={category.id} className="btn-tab_empty cursor-pointer mb-[20px]" data-active={userCat.includes(category.Nom) ?'true':'false'} onClick={()=>selectCat(category.Nom,category.id)}>{category.Nom}</li>
                                        ))}
                                    </ul>
                                    <button className="btn-plain" onClick={()=>nextPannelStudent(2)}>
                                        Suivant
                                    </button>
                                </div>
                            )
                            :null}
                        {onboardingStudentPannel == 2 ? (
                                <div className="mt-[60px] flex flex-col items-center w-2/3">
                                    <h1 className="text-center">Encore quelques informations pour completer ton profil</h1>
                                    <div className="flex flex-col items-center gap-[20px] mt-[40px]">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            ref={authRefs.registerEmailInput}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            ref={authRefs.registerNameInput}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date de naissance"
                                            ref={authRefs.registerAgeInput}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            ref={authRefs.registerPasswordInput}
                                        />

                                        <button className="btn-plain mt-[40px]" onClick={register}>
                                            Créer mon compte
                                        </button>
                                        <br /><p className="text-red">{authError}</p>
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
                            <button className={onboardingTeacherPannel == 0 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelTeacher(0)}>1. Type de profil</button>
                            <button className={onboardingTeacherPannel == 1 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelTeacher(1)}>2. Centres d'intérêt</button>
                            <button className={onboardingTeacherPannel == 2 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelTeacher(2)}>3. Descriptif</button>
                            <button className={onboardingTeacherPannel == 3 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelTeacher(3)}>4. Descriptif</button>
                            <button className={onboardingTeacherPannel == 4 ? 'btn-tab':'btn-tab_empty'} onClick={()=>nextPannelTeacher(4)}>5. Compte</button>
                        </div>
                        {onboardingTeacherPannel == 0 ? (
                                <div className="flex flex-col items-center">
                                    <h1>Que recherches-tu dans notre application ?</h1>
                                    <div className="flex mt-[60px] gap-[40px]">
                                        <button className="max-w-[400px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('student')}>
                                            <img className="" src={onBoardingStudent} alt=""/>
                                            <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                                                <p className="p-role">Je souhaite apprendre des connaissances</p>
                                            </div>
                                        </button>
                                        <button className="max-w-[400px] w-full rounded-[50px] relative filter grayscale duration-300 border-4 border-white overflow-hidden hover:grayscale-0 hover:border-primary" onClick={()=> selectUserType('teacher')}>
                                            <img className="" src={onBoardingTeacher} alt=""/>
                                            <div className="absolute bottom-0 w-full p-[20px] bg-black bg-opacity-30 rounded-bl-[50px] rounded-br-[50px]">
                                                <p className="p-role">Je souhaite partager mes connaissances</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )
                            :null}
                        {onboardingTeacherPannel == 1 ? (
                                <h1>Choix</h1>
                            )
                            :null}
                        {onboardingTeacherPannel == 2 ? (
                                <h1>Description</h1>
                            )
                            :null}
                        {onboardingTeacherPannel == 3 ? (
                                <h1>Distance</h1>
                            )
                            :null}
                        {onboardingTeacherPannel == 4 ? (
                                <div className="mt-[60px] flex flex-col items-center w-2/3">
                                    <h1 className="text-center">Encore quelques informations pour completer ton profil</h1>
                                    <div className="flex flex-col items-center gap-[20px] mt-[40px]">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            ref={authRefs.registerEmailInput}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            ref={authRefs.registerNameInput}
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date de naissance"
                                            ref={authRefs.registerAgeInput}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            ref={authRefs.registerPasswordInput}
                                        />

                                        <button className="btn-plain mt-[40px]" onClick={register}>
                                            Créer mon compte
                                        </button>
                                        <br /><p className="text-red-500">{authError}</p>
                                    </div>
                                </div>
                            )
                            :null}
                    </div>
                ):null
            }

        </div>
    );
};


export default Onboarding;
