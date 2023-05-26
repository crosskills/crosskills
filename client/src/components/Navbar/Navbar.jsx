import React, {createContext, useContext, useEffect, useState} from "react";
import './Navbar.scss'

import logo from "../../assets/images/logoBLeu.png";
import {useNavigate} from "react-router-dom";
import {RxMagnifyingGlass} from "react-icons/rx";
import {collection, getDocs} from "firebase/firestore";
import {auth, database} from "../../services/firebase";
import profil from "../../assets/images/profile_sample.jpg";
import {onAuthStateChanged} from "firebase/auth";
import {CurrentUserContext} from "../../components/CurrentUser/CurrentUserContext";


const Navbar = ({user}) => {
    const history = useNavigate();
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectCat, setSelectCat] = useState("");
    const [categories,setCategories] = useState([]);

    const filteredItems = categoriesList.filter((item) =>
        item.toLowerCase().includes(searchText.toLowerCase())
    );
    const maxResults = 5;
    const displayedItems = filteredItems.slice(0, maxResults);


    useEffect(() => {
        getDocs(collection(database, "Categories")).then((querySnapshot) => {
            const categoriesListFetch = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesListFetch);
            let subCatList = [];
            categoriesListFetch.map((cat) => {
                cat["sous-cat"].map((subCat) => {
                    subCatList.push(subCat);
                });
            })
            setCategoriesList(subCatList);
        });
    }, [user]);

    function searchCat(event){
        setSearchText(event.target.value);
        setSearchIsOpen(true);
    }


    return (
    <nav className="navbar flex items-center justify-between w-full">
      <img src={logo} alt="" onClick={()=>history('/')} className="max-w-[200px]"/>
        <div>
            {
                user.userData.userType === "student" ?
                    <div className="w-[400px]">
                    <div className="relative flex justify-between rounded-[50px] bg-gray py-[5px] px-[5px]  w-full">
                        <input type="text"
                               placeholder="Que souhaite tu apprendres ?"
                               className="focus:outline-none bg-gray w-[70%] py-[10px] px-[15px] rounded-[50px]"
                               value={searchText}
                               onChange={searchCat}
                        />
                        {searchIsOpen && searchText !== "" ? (
                        <ul className="dropdown-list--serach-home z-0">
                            {displayedItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item--search"
                                    onClick={() => selectCat(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        ) : null}
                        <div className="p-[10px] rounded-[50px] bg-primary">
                            <RxMagnifyingGlass className="rounded-[50px] text-white"/>
                        </div>
                    </div>
                    </div>
                    : null}
        </div>
        <div>
            <div className="flex rounded-[100px] bg-gray py-[10px] px-[20px]" onClick={()=>history('/profile')}>
                <p className="text-primary mr-[10px]">{user.userData.prenom[0].toUpperCase()}</p>
                <img src={user.userData.image} className="rounded-[50px] w-[32px] h-[32px]" alt=""/>
            </div>
        </div>
    </nav>
  )
}

export default Navbar