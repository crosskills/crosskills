import React, {createContext, useEffect, useState} from "react";
import {database} from "./firebase";
import { auth } from "./firebase";

import { Loader } from "../components";
import {doc, getDoc} from "firebase/firestore";

export const AuthContext = React.createContext();
export const CurrentUserContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            // console.log(user)
            if (user) {
                getDoc(doc(database, "Users", user.uid)).then((doc) => {
                    setCurrentUser(user)
                    setUserData(doc.data());
                    setPending(false)
                })
            } else {
                setPending(true)
                setUserData(null);
            }
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
            <CurrentUserContext.Provider value={{ userData, setUserData }}>
                {children}
            </CurrentUserContext.Provider>
        </AuthContext.Provider>
    );
};