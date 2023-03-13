import { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "./services/firebase";

function App() {
  const authRefs = {
    registerEmailInput: useRef(),
    registerPasswordInput: useRef(),
    loginEmailInput: useRef(),
    loginPasswordInput: useRef(),
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

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        authRefs.loginEmailInput.current.value,
        authRefs.loginPasswordInput.current.value
      );
      console.log(user);
      setAuthError("")
    } catch (error) {
      // console.error(error.message);
      setAuthError(error.message)
    }
  };

  const logout = async () => {
    await signOut(auth);
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

      <br />
      <div>
        <h4>User Logged In :</h4>
        {user?.email}
        <button className="bg-blue-200 ml-1" onClick={logout}>
          Sign Out
        </button>
      </div>

      <br /><p className="text-red-500">{authError}</p>
    </div>
  );
}

export default App;
