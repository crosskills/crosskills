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

  // a enlever ensuite
  const [newMessage, setNewMessage] = useState("")
  const [participant2, setParticipant2] = useState("")

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
      <Contactitem userData={userData} createConversation={createConversation} setActiveChat={setActiveChat} chat={chat} />
    ))

  }

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };


  function createConversation(participant1, participant2, textToSend) {
    //  if (verifyIfExist(participant1, participant2)) {
    //     return;
    //  }
    //  else {
    const newConversationKey = push(ref(realtimeDatabase, 'conversations')).key;

    const message = {
      sender: participant1,
      text: textToSend,
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
    //}
  }

  // const verifyIfExist = (participant1, participant2) => {
  //    //veryfieng if the conversation already exists
  //    const conversationRef = ref(realtimeDatabase, 'conversations/');
  //    const conversationQuery = query(conversationRef, orderByChild(`participants/${participant1}`), equalTo(true));
  //    onValue(conversationQuery, (snapshot) => {
  //      const data = snapshot.val()
  //      const conversation = Object.entries(data).map(([conversationID, conversation]) => {
  //        return {
  //          ...conversation,
  //          conversationID: conversationID
  //        }
  //      })
  //      console.log('conversation', conversation)
  //    })
  //   }
  //veryfieng if the conversation already exists

  const handleSubmit = (e) => {
    e.preventDefault();
    createConversation(userData.uid, participant2, newMessage)
  }

  return (
    <>
      <div className={`flex flex-row sidebar ${isOpen ? 'open' : ''}`}>


        {activeChat ?
          (
            <ChatWindow activeChat={activeChat} userId={userData.uid} setActiveChat={setActiveChat} />

          ) :
          <div style={{ border: 'solid 1px red', width: '50%' }}>
            <form className="send-message" onSubmit={handleSubmit} >
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ecrire un message" />
              <input type="text" value={participant2} onChange={(e) => setParticipant2(e.target.value)} placeholder="uid du destinataire" />
              <button type="submit">Envoyer</button>
            </form>


            <div >
              <h3 className='mx-8' disp>Vos messages</h3>
            </div>
            {displayContactList()}
          </div>
        }
      </div >

      <button className={` sidebar-toggle ${isOpen ? 'open bg-primary '  : 'bg-sky '}`} onClick={handleToggleSidebar}>

        <svg class={`h-8 w-8 ${isOpen ? 'text-white' : 'text-black'} `} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />  <line x1="12" y1="11" x2="12" y2="11.01" />  <line x1="8" y1="11" x2="8" y2="11.01" />  <line x1="16" y1="11" x2="16" y2="11.01" /></svg>
      </button>
    </>
  );
};

export default ChatSidebar;
