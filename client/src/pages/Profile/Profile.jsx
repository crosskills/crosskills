import { useEffect, useContext, useState } from 'react';
import { CurrentUserContext } from '../../services/auth';
import {MdPhotoCamera} from 'react-icons/md'
import { storage } from '../../services/firebase';
import {
    signOut,
} from "firebase/auth";

import './Profile.scss'

import { Navbar } from '../../components'
import profileImage from '../../assets/images/profile_sample.jpg'
import {auth, database} from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";
import { useNavigate } from "react-router-dom";



const Profile = () => {
    const navigate = useNavigate();
    const userData  = useContext(CurrentUserContext);
    console.log(userData.userData)
    const docUser = doc(database, 'Users', userData.userData.uid);
    const [file, setFile] = useState("");
    const [percent, setPercent] = useState(0);



    const [user, setUser] = useState({
        prenom: "",
        nom: "",
        age: 99,
        bio: "",
        image: "",
    })
    const [isEditing, setIsEditing] = useState(false);
    const calculateAge =(birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    useEffect(() => {
        let age = calculateAge(userData.userData.age);
        setUser({
            prenom: userData.userData.prenom,
            nom: userData.userData.nom,
            age: age,
            bio: userData.userData.bio,
            image: userData.userData.image,
        })
        console.log(userData)
    },[userData])

    const updateProfile = async () => {
        await updateDoc(docUser,{
            prenom: user.prenom,
            nom: user.nom,
            image:user.image
        })
        setIsEditing(false);
    }

    function handleUpload(file) {
        if (!file) {
            alert("Please choose a file first!")
        }
        const storageRef = ref(storage,`/users/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log(url);
                    setUser({
                      ...user,
                        image: url,
                    })
                });
            }
        );
    }

    const handleChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
        }
        handleUpload(e.target.files[0])
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }
    }


    return (
      <div className="py-10 px-2 md:px-10 profile text-black flex flex-col justify-center">
        <Navbar
            user={userData}
        />
        <div className="flex flex-col md:grid grid-cols-4 gap-[60px] max-w-[1400px] mx-[20px] mt-[40px]">
            <section className='profile-datas col-span-1 flex'>
                <div className='w-full'>
                    <div className='flex justify-center md:block'>
                        {
                            isEditing ? (
                                <div className="relative cursor-pointer">
                                    <input type="file" onChange={handleChange} accept="/image/*" className="absolute h-full w-full z-30 opacity-0"/>
                                    <MdPhotoCamera color="white" size={82} className="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] z-20"/>
                                    <div className="absolute h-full w-full bg-black opacity-30 rounded-3xl"></div>
                                    <img src={user.image} className="w-3/4 md:w-full rounded-3xl" alt="photo de profil par défaut" />
                                </div>
                            ) : <img src={user.image} className="w-3/4 md:w-full rounded-3xl" alt="photo de profil par défaut" />
                        }
                    </div>
                    {
                        isEditing ? (
                                <div className='main-infos text-center md:text-left py-5'>
                                    <input
                                        className='text-3xl'
                                        type="text"
                                        value={user.prenom}
                                        onChange={(e) => setUser({...user, prenom: e.target.value})}
                                    />
                                    <input
                                        className='text-3xl'
                                        type="text"
                                        value={user.nom}
                                        onChange={(e) => setUser({...user, nom: e.target.value})}
                                    />
                                    <p>{user.age} ans</p>
                                    <p>{userData.userData.location}</p>
                                </div>
                        ):(   <div className='main-infos text-center md:text-left py-5'>
                                <h1 className='text-3xl'>{user.prenom}</h1>
                                <p>{user.age} ans</p>
                                <p>{userData.userData.location}</p>
                            </div>
                        )
                    }


                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Informations </h2>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Passions </h2>
                    {isEditing
                        ? <button className="btn-plain-small" onClick={()=>updateProfile()}>Enregister</button>
                        : <button className="btn-plain-small" onClick={()=>setIsEditing(true)}>Modifier le profil</button>
                            }
                  <button className="btn-plain-small" onClick={()=>handleLogout()}>Log Out</button>
                </div>
            </section>

            <section className='profile-datas-edito col-span-3'>
                <div className='welcome'>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Bonjour ! Je m'appelle {user.prenom} ! </h2>
                    <p>bio</p>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Marie propose : </h2>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Avis </h2>
                </div>
            </section>

        </div>
      </div>
  );
};

export default Profile