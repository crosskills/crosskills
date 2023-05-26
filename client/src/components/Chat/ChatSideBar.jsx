import React, { useEffect, useState } from 'react';
import { realtimeDatabase, database, } from "../../services/firebase";
import { ref, orderByChild, query, equalTo, onValue, update, push } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
 
import ChatWindow from './ChatWindow';
import Contactitem from './Contactitem';

const ChatSidebar = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState()
  const [chats, setChats] = useState([])
  const [contacts, setContacts] = useState([])
  const [conversations, setConversations] = useState([])

  useEffect(() => {
    if (userData) {
      const conversationsRef = ref(realtimeDatabase, 'conversations/')
      //querying only the conversations where the current user is participating
      const userConversationsRef = query(conversationsRef, orderByChild(`participants/${userData.uid}`), equalTo(true));
      onValue(userConversationsRef, (snapshot) => {
        const data = snapshot.val()
        const conversations = Object.entries(data).map(([conversationID, conversation]) => {
          return {
            ...conversation,
            conversationID: conversationID
          }
        })
        setConversations(conversations)
        console.log('conversations', conversations)
      })

    }
  }, [userData])

  useEffect(() => {
    const enhancingChatsWithContactInfo = async () => {
      const chats = []
      if (conversations.length > 0) {
        const chatPromises = conversations.map(async (conv) => {
          const contactId = Object.keys(conv.participants).filter((userId) => userId !== userData.uid)[0]
          const documentRef = doc(database, 'Users', contactId);
          const docSnapshot = await getDoc(documentRef);
          if (docSnapshot.exists()) {
            const { prenom, image, userType } = docSnapshot.data()
            const chatWithUserInfo = { ...conv, userInfo: { prenom, image, userType } };
            chats.push(chatWithUserInfo)
          } else {
            console.log('No such document!');
          }
        })
        await Promise.all(chatPromises);
        setChats(chats)
        console.log('chats', chats)
      }
    }

    enhancingChatsWithContactInfo();
  }, [conversations])


  const displayContactList = () => {
    return chats.map((chat) => (
      <div
        style={{ width: '90%' }}
        onClick={() => {
          setActiveChat(chat)
        }}
        key={chat.conversationID}
      >
        <div className="contacts-item rounded-full" style={{ width: '90%' }} >
        <div className="flex flex-row" >
        <img src={chat.userInfo.photo} />
              <div className='pl-2'>
                 <p className="text-sm ">{chat.userInfo.prenom}</p>
              <p className="message text-secondary">{chat.userInfo.userType} </p>
          <div className="last-message">{chat.lastMessage.text}</div>
                </div>
            </div>
          
           
          
        </div>
      </div>
    ))

  }


  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  //fonction test, a retirer par la suite
  function createConversation(participant1, participant2) {
    const newConversationKey = push(ref(realtimeDatabase, 'conversations')).key;

    const message = {
      sender: participant2,
      text: 'Salut!',
      timestamp: Date.now()
    }
    const conversationData = {
      conversationID: newConversationKey,
      participants: {
        [participant1]: true,
        [participant2]: true
      },
      lastMessage: message,
      messages: {
        message1: message
      }
    };

    const updates = {};
    updates[`/conversations/${newConversationKey}`] = conversationData;

    return update(ref(realtimeDatabase), updates);
  }
  //fonction test, a retirer par la suite

  return (
    <>
      <div className={`flex flex-row sidebar ${isOpen ? 'open' : ''}`}>
        
         
        {activeChat ?
          (
            <ChatWindow activeChat={activeChat} userId={userData.uid}setActiveChat={setActiveChat}/>

          ) : 
          <div style={{ border: 'solid 1px red', width: '50%' }}>
          <div  className='flex flex-row space-x-10'>
          <h3 className='ml-12'>Vos messages</h3>
          <button onClick={() => {handleToggleSidebar()} }>
          <svg fill="none" viewBox="0 0 24 24" height="2em" width="2em" >
      <path
        fill="currentColor"
        d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
      />
    </svg>
          </button>
          </div>
          {displayContactList()}
        {/* <Contactitem userData={userData} createConversation={createConversation} setActiveChat={setActiveChat}/> */}
        </div>
        }
      </div >
      <button className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={handleToggleSidebar}>
      <svg class="h-8 w-8 text-black"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />  <line x1="12" y1="11" x2="12" y2="11.01" />  <line x1="8" y1="11" x2="8" y2="11.01" />  <line x1="16" y1="11" x2="16" y2="11.01" /></svg>
      </button>
    </>
  );
};

export default ChatSidebar;
