import React from 'react'

function Contactitem({userData, createConversation, setActiveChat,chat}) {
  console.log('userData', userData)
  return (
    <div className="contacts-item rounded-full"
            style={{ width: '90%' }}
            onClick={() => {
              setActiveChat("test")
              //createConversation(userData.uid, "V1SDCpXUQgguyOg2Jjfk8hy79G63")
            }}>
            <div className="flex flex-row" >
            <img src={"https://i.ibb.co/YZpLJ2y/Adil-Baltazare-Minimized.png"} />
              <div className='pl-2'>
                 <p className="text-sm ">{userData.userType}</p>
              <p className="message text-secondary">{userData.prenom} </p> 
                </div>
            </div>
          </div>


  )
}

export default Contactitem