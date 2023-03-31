import './Profile.scss'

import { Navbar } from '../../components'
import profileImage from '../../assets/images/profile_sample.jpg'

const Profile = () => {

    // console.log(currentUser)

  return (
      <div className="py-10 px-2 md:px-10 profile text-black">
        <Navbar />
        
        <div className="flex flex-col md:grid grid-cols-5">

            <section className='profile-datas col-span-2 flex justify-center'>
                <div className='w-full md:w-2/3'>
                    <div className='flex justify-center md:block'>
                        <img src={profileImage} className="w-3/4 md:w-full rounded-3xl shadow-xl shadow-primary/50" alt="photo de profil par défaut" />
                    </div>

                    <div className='main-infos text-center md:text-left py-5'>
                        <h1 className='text-3xl'> Marie Lupin </h1>
                        <span className='text-xl md:text-lg lg:text-xl'> 
                            22 ans <br/> 
                            Paris, France
                        </span>
                    </div>

                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Formations </h2>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Passions </h2>

                </div>
            </section>

            <section className='profile-datas-edito col-span-3'>
                <div className='welcome'>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Bonjour ! Je m'appelle Marie ! </h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Marie propose : </h2>
                    <h2 className='text-2xl md:text-3xl font-bold my-2 md:my-5'> Avis </h2>
                </div>
            </section>

        </div>
      </div>
  );
};

export default Profile