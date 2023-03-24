import React, { useContext } from "react";
import {Route, Navigate, Outlet, useNavigate} from "react-router-dom";
import { AuthContext } from "../../services/auth";
import logo from "../../assets/images/logoBLeu.png";
import handshake from "../../assets/images/handshake.png";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    const history = useNavigate();
    // console.log(currentUser);
    const onboarding = () => {
        history("/onboarding");
    }
    const login = () => {
        history("/login");
    }
    return (
    currentUser ? (
                    <Outlet />
                ) : (
                    <div className="flex w-full h-full onboarding p-[60px] gap-[40px]">
                        <div className="flex flex-col justify-between items-center rounded-[50px] w-2/3 p-[40px] shadow-[0_0px_15px_0px_rgba(0,0,0,0.05)]">
                            <img src={logo} alt="" className="max-w-[300px]"/>
                            <div className="flex flex-col items-center">
                                <h1 className="text-4xl font-bold">Welcome to Crosskills</h1>
                                <button className="btn-plain mt-8" onClick={onboarding}>Crée ton compte</button>
                            </div>
                            <button onClick={login}>Déja Inscrit ?</button>
                        </div>
                        <div className="onboarding-image w-1/3">
                            <img src={handshake} alt="" className="object-cover h-full w-full rounded-tl-[150px] rounded-tr-[50px] rounded-br-[150px] rounded-bl-[50px] shadow-[0_0px_15px_0px_rgba(0,0,0,0.05)]"/>
                        </div>
                    </div>
                )
    );
};


export default PrivateRoute