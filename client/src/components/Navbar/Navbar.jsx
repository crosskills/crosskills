import React from 'react'
import './Navbar.scss'

import logo from "../../assets/images/logoBLeu.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="" className="max-w-[300px]"/>
      
      <div className="navbar__right">
        <div className="search-partner"></div>

        <div className="publish-announcement"></div>

        <div className="profile"></div>
      </div>
    </nav>
  )
}

export default Navbar