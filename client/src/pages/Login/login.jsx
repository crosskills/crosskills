import { useRef, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../services/firebase";

function Login() {
    const authRefs = {
        loginEmailInput: useRef(),
        loginPasswordInput: useRef(),
    };
    const [authError, setAuthError] = useState("");
    const history = useNavigate();


    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                authRefs.loginEmailInput.current.value,
                authRefs.loginPasswordInput.current.value
            );
            setAuthError("")
            history("/");
        } catch (error) {
            // console.error(error.message);
            setAuthError(error.message)
        }
    };
    return (
        <div className="App">
            <div>
                <h3>Login</h3>
                <input
                    type="email"
                    placeholder="Email…"
                    ref={authRefs.loginEmailInput}
                />
                <input
                    type="password"
                    placeholder="Password…"
                    ref={authRefs.loginPasswordInput}
                />
                <button className="bg-blue-200" onClick={login}>
                    Login
                </button>
            </div>
            <br /><p className="text-red-500">{authError}</p>
        </div>
    );
}

export default Login;
