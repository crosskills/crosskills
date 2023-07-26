import React from 'react'

let dummyProfilePic = "https://firebasestorage.googleapis.com/v0/b/crosskills-638ae.appspot.com/o/PngItem_5813504.png?alt=media&token=fedcb930-814e-4fa4-8301-502b5cc60674"


function Contactitem({userData, setActiveChat,chat}) {
  console.log('userData', chat)

 const truncate = (input) =>
      input?.length > 10 ? `${input.substring(0, 20)}...` : input;

  return (
    <div style={{ width: '100%', marginTop:10 }} onClick={() => {
      setActiveChat(chat)}}
        key={chat.conversationID}>
        <div className="contacts-item rounded-full" style={{ width: '90%' }} >
        <div className="flex flex-row" >
        <img src={chat.userInfo.photo ? chat.userInfo.photo :dummyProfilePic} />
              <div className='pl-2'>
                 <p className="text-sm ">{chat.userInfo.userType}</p>
              <p className="message text-secondary">{chat.userInfo.prenom} </p>
              {/* truncate text of last message */}
    
          <div className="last-message"
          > {truncate(chat.lastMessage.text)}</div>
                </div>
            </div>
        </div>
      </div>


  )
}

export default Contactitem