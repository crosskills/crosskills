import React, { createContext, useContext, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/auth";
import logo from "../../assets/images/logoBLeu.png";
import herofull from "../../assets/images/hero-full.png";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    const history = useNavigate();
    const onboarding = () => history("/onboarding"); 
    const login = () => history("/login"); 
    
    return (
    currentUser ? (
                    <Outlet />
                ) : (
                    <div className="flex flex-col-reverse w-full h-full justify-center  onboarding p-[20px] gap-[40px] relative md:flex-row md:p-[60px] md:justify-start">
                        <img src={logo} alt="" className="max-w-[150px] md:max-w-[300px] absolute top-[20px] "/>
                        <div className="flex flex-col relative justify-center items-center md:items-start rounded-[50px] w-full p-[0px] md:w-1/2 md:p-[40px]">
                            <div className="flex flex-col items-center md:items-start">
                                <h1 className="title-hero">Trouve ton partenaire d'apprentissage idéal</h1>
                                <p className="subtitle my-[20px] md:my-[40px]">Connecte toi avec des personnes passionnantes et passionnés grâce à <span className="text-primary">Crosskills</span></p>
                                <button className="btn-plain" onClick={onboarding}>Prêt à partager</button>
                            </div>
                            <button className="relative md:absolute mt-[20px] bottom-0" onClick={login}>Déja Inscrit ?</button>
                        </div>
                        <div className="flex items-center justify-end w-full p-[0px] md:w-1/2 md:p-[40px]">
                            <div className="flex flex-col gap-[50px] max-w-[850px]">
                                <img src={herofull} alt=""/>
                            </div>
                        </div>
                    </div>
                )
    );
};


export default PrivateRoute