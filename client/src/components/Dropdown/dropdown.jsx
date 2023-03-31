import React, { useState } from "react";
import "./Dropdown.scss";
import arrow from "../../assets/icons/arrow.svg"


const Dropdown = ({ options, label, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOption] = useState([]);

    const handleOptionClick = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOption(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOption([...selectedOptions, option]);
        }
        console.log(selectedOptions)
        onChange(option);
    };

    return (
        <div className="dropdown">
            <div className={isOpen ? "dropdown-btn dropdown-btn--selected" :"dropdown-btn"} >
                <button className={isOpen ? "flex w-full justify-between mb-[20px]" : "flex w-full justify-between"} onClick={() => setIsOpen(!isOpen)}>
                    {label}
                    <span>
                        <img src={arrow} alt=""/>
                    </span>
                </button>
                {isOpen && (
                    <ul>
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleOptionClick(option)}
                                className={selectedOptions.includes(option)? "bg-primary text-white " : "bg-sky text-black"}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
};

export default Dropdown;