import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../services/auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser);
    return (
    currentUser ? (
                    <Outlet />
                ) : (
                    <Navigate to="/login" />
                )
    );
};


export default PrivateRoute