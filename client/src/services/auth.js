import React, { useEffect, useState } from "react";
import firebaseConfig from "./firebase";
import { auth } from "./firebase";

import { Loader } from "../components";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            // console.log(user)
            setCurrentUser(user)
            setPending(false)
        });
    }, []);

    if(pending){
        return <Loader />
    }
    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};