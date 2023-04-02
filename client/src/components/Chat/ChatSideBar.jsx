import React, { useEffect, useState } from 'react';
import { realtimeDatabase, database, } from "../../services/firebase";
import { ref, orderByChild, query, equalTo, onValue, update, push } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";

import ChatWindow from './ChatWindow';

const ChatSidebar = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState()
  const [chats, setChats] = useState([])
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
        className={`smallannouncement`}
        style={{ width: '100%' }}
        onClick={() => {
          setActiveChat(chat)
        }}
      >
        <div className="smallannouncement_content-infos-profile" >
          {/* <img src={chat.userInfo.photo} alt={contact.name} />*/}
          <div className="name">{chat.userInfo.prenom}</div>
          <div className="name">{chat.userInfo.userType}</div>
          <div className="last-message">{chat.lastMessage.text}</div>
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
        <div style={{ border: 'solid 1px red', width: '30%' }}>
          {displayContactList()}

          {/* pour test, a retirer par la suite */}
          <div
            className={`smallannouncement`}
            style={{ width: '100%' }}
            onClick={() => {
              createConversation(userData.uid, "ZJ9c0jh0mRZ2jnaSOP8OYhfQv1k1")
            }}
          >
            <div className="smallannouncement_content-infos-profile" >
              <div className="name text-primary">Commencer la discussion avec Abde2</div>
            </div>
          </div>
          {/* pour test, a retirer par la suite */}
        </div>
        {userData ?
          (
            <ChatWindow activeChat={activeChat} userId={userData.uid} />

          ) : null
        }
      </div >
      <button className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={handleToggleSidebar}>
        Toggle Sidebar
      </button>
    </>
  );
};

export default ChatSidebar;
