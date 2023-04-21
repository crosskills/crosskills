import React, { createContext ,useContext, useState } from "react";
import './Navbar.scss'

import logo from "../../assets/images/logoBLeu.png";
import {useNavigate} from "react-router-dom";
import {RxMagnifyingGlass} from "react-icons/rx";

const Navbar = ({userType}) => {
    const history = useNavigate();


    return (
    <nav className="navbar flex items-center justify-between">
      <img src={logo} alt="" className="max-w-[200px]"/>
        <div>
            {
                userType === "student" ?
                    <div className=" flex justify-between rounded-[50px] bg-gray py-[5px] px-[5px] max-w-[400px] w-full">
                        <input type="text" placeholder="Que souhaite tu apprendres ?" className="focus:outline-none bg-gray w-auto py-[10px] px-[15px]"/>
                        <div className="p-[10px] rounded-[50px] bg-primary">
                            <RxMagnifyingGlass className="rounded-[50px] text-white"/>
                        </div>
                    </div>
                    : null}
        </div>
        <div>
            <div className="rounded-[50px] bg-gray py-[10px] px-[15px]" onClick={()=>history('/profile')}>
                profile
            </div>
        </div>
    </nav>
  )
}

export default Navbar