import React, { useEffect, useState } from 'react'
import { realtimeDatabase } from "../../services/firebase";
import { ref, child, push, update, orderByChild, onValue } from "firebase/database";
import { query } from 'firebase/firestore';
const ChatWindow = ({ activeChat, userId, setActiveChat}) => {
    const [newMessage, setNewMessage] = useState("")

    const [messages, setMessages] = useState([
        { text: "Hello", sender: "test", timestamp: 123456789 },
        { text: "Hzeegeello", sender: "test", timestamp: 123456800 },
        { text: "Helgeelo", sender: "test" , timestamp: 123457000 }]);

    useEffect(() => {
        if (activeChat) {
            const messagesRef = ref(realtimeDatabase, `conversations/${activeChat.conversationID}/messages`);
            const messagesQuery = query(messagesRef, orderByChild('timestamp'));
            onValue(messagesQuery, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setMessages(Object.values(data));
                } else {
                    setMessages([]);
                }
            });
        }
    }, [activeChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            text: newMessage,
            timestamp: Date.now(),
            sender: userId,
        };
        setNewMessage(message);

        const newMessageKey = push(child(ref(realtimeDatabase), `conversations/${activeChat.conversationID}/messages`)).key;
        const updates = {};
        updates[`/conversations/${activeChat.conversationID}/lastMessage`] = message;
        updates[`/conversations/${activeChat.conversationID}/messages/${newMessageKey}`] = message;

        return update(ref(realtimeDatabase), updates).then(() => {
            console.log("Message sent successfully!");
        })
            .catch((error) => {
                console.error("Error sending message: ", error);
            });
    };

    return (
        <div style={{ width: '50%', border: 'solid 1px blue' }}>
            <div className="flex flex-row">

            <img className='h-20 w-20 rounded-full m-auto' src='https://i.ibb.co/YZpLJ2y/Adil-Baltazare-Minimized.png'/>
            <button onClick={() => {setActiveChat()} }>
          <svg fill="none" viewBox="0 0 24 24" height="2em" width="2em" >
      <path
        fill="currentColor"
        d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
        />
    </svg>
          </button>
        </div>
            {
                activeChat ? (
                    <>
                        <div className="messages" style={{ width: '100%', height:'50%' }}>
                            {Object.keys(messages)
                            .map((messageID) => messages[messageID])
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((message) => {

                                return (
                                        
                                    <div key={message.id} className={`  mr-2 py-2 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white message ${message.sender === userId ? 'bg-gray' : 'bg-primary'}`}>
                                        <p className={`message mb-2 ${message.sender === userId ? 'text-primary' : 'text-gray'}`}>{message.text}</p>
                                        {/* <div className="message-time text-black">{new Date(message.timestamp).toLocaleTimeString()}</div> */}
                                    </div>
                               
                                );
                            })}
                        </div>
                        <form className="send-message" onSubmit={handleSubmit}>
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message here..." />
                            <button type="submit">Envoyer</button>
                        </form>

                        
                    </>
                ) : <p>Pas de message pour l'instant.</p>
            }
        </div>
    )
}

export default ChatWindow