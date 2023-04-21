import { useRef, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../services/firebase";
import logo from "../../assets/images/logoBLeu.png";
import handshake from "../../assets/images/handshake.png";

import { Link } from "react-router-dom";
import { RiAlertFill } from "react-icons/ri";

function Login() {
    const authRefs = {
        loginEmailInput: useRef(),
        loginPasswordInput: useRef(),
    };
    const [authError, setAuthError] = useState("");
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();

        try {
            const user = await signInWithEmailAndPassword(
                auth,
                authRefs.loginEmailInput.current.value,
                authRefs.loginPasswordInput.current.value
            );
            setAuthError("")
            navigate("/");
        } catch (error) {
            setAuthError(error.message.replace('Firebase: ', ''))
        }
    };
    return (
        <div className="flex flex-col md:flex-row w-full h-full py-10 px-2 md:p-[60px] md:gap-[40px] onboarding">

            <div className="flex flex-col justify-between items-center w-full md:w-2/3 p-0 md:p-[40px] rounded-none md:rounded-[50px] shadow-none md:shadow-[0_0px_15px_0px_rgba(0,0,0,0.05)]">
                <img src={logo} alt="" className="w-5/6 max-w-[300px] my-5 md:my-10"/>

                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-center md:text-3xl font-bold">Trouve ton partenaire d'apprentissage idéal</h1>

                    <form className="flex flex-col items-center mt-10 gap-3">
                        <input
                            className="input-white"
                            type="email"
                            placeholder="Adresse email"
                            ref={authRefs.loginEmailInput}
                        />

                        <input
                            className="input-white"
                            type="password"
                            placeholder="Mot de passe"
                            ref={authRefs.loginPasswordInput}
                        />
                        <button className="btn-plain mt-3 w-100" onClick={login} >Se connecter</button>
                    </form>

                    <p className="text-red mt-5 text-sm">{authError && <RiAlertFill className="inline-block" />} {authError}</p>
                </div>

                <Link to="/onboarding" className="my-5 md:m-0 text-center">Pas de compte ? Crée ton propre profil !</Link>
            </div>

            <div className="onboarding-image w-full md:w-1/3 h-40 md:h-full">
                <img src={handshake} alt="" className="object-cover h-full w-full rounded-tl-lg rounded-tr-md rounded-br-lg rounded-bl-md md:rounded-tl-[150px] md:rounded-tr-[50px] md:rounded-br-[150px] md:rounded-bl-[50px] shadow-[0_0px_15px_0px_rgba(0,0,0,0.05)]"/>
            </div>

        </div>
    );
}

export default Login;
