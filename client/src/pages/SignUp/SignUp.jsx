import { useRef, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { auth, database } from "../../services/firebase";

function SignUp() {
    const authRefs = {
        registerEmailInput: useRef(),
        registerPasswordInput: useRef(),
    };

    const [user, setUser] = useState({});
    const [authError, setAuthError] = useState("");

    onAuthStateChanged(auth, (user) => {
        setUser(auth.currentUser);
    });

    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                authRefs.registerEmailInput.current.value,
                authRefs.registerPasswordInput.current.value
            );
            console.log(user);
            setAuthError("")
        } catch (error) {
            // console.error(error.message);
            setAuthError(error.message)
        }
    };

    return (
        <div className="App">
            <div>
                <h3>Register User</h3>
                <input
                    type="email"
                    placeholder="Email…"
                    ref={authRefs.registerEmailInput}
                />
                <input
                    type="password"
                    placeholder="Password…"
                    ref={authRefs.registerPasswordInput}
                />

                <button className="bg-blue-200" onClick={register}>
                    Create User
                </button>
            </div>

            <br />

            <br /><p className="text-red-500">{authError}</p>
        </div>
    );
}

export default SignUp;
