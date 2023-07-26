import React, { useEffect, useState } from 'react'
import { realtimeDatabase } from "../../services/firebase";
import { ref, child, push, update, orderByChild, onValue } from "firebase/database";
import { query } from 'firebase/firestore';
const ChatWindow = ({ activeChat, userId, setActiveChat,userImage, userName }) => {
    const [newMessage, setNewMessage] = useState("")
console.log('activeChat.userInfo', activeChat.userInfo)
    const [messages, setMessages] = useState([
        { text: "Hello", sender: "test", timestamp: 123456789 },
        { text: "Hzeegeello", sender: "test", timestamp: 123456800 },
        { text: "Helgeelo", sender: "test", timestamp: 123457000 }]);

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
            setNewMessage("");
        }).catch((error) => {
                console.error("Error sending message: ", error);
            });
    };

    return (
        <div style={{ width: '50%', height:'100%',  overflowX:'hidden'}} className="bg-gray rounded">
            <div  style={{ height:100, position:'fixed', top:0, padding:8, width:'100%'}} className='bg-gray'>
                <img className='h-20 w-20 rounded-full m-auto' src={activeChat.userInfo.image ? activeChat.userInfo.image  : 'https://i.ibb.co/YZpLJ2y/Adil-Baltazare-Minimized.png'} style={{position:'fixed',right:'70%'}} />
                <p style={{textAlign:'start', margin:"auto"}}>{activeChat.userInfo.prenom}</p>
                <button onClick={() => { setActiveChat() }}>
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
                        <div className="messages" style={{ width: '100%', paddingTop:150, paddingBottom:150}}>
                            <div class="w-full px-5 flex flex-col justify-between" style={{}}>
                                {Object.keys(messages)
                                    .map((messageID) => messages[messageID])
                                    .sort((a, b) => a.timestamp - b.timestamp)
                                    .map((message) => {

                                        return (
                                            <>
                                                <div class="flex flex-col mt-5">
                                                    <div key={message.id} class={`flex mb-4 justify-end items-end ${message.sender === userId ? '' : 'flex-row-reverse  '} `}>
                                                    <p class="text-xs  ml-2 mr-2 self-end">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        <div
                                                            className={`${message.sender === userId ? 'bg-sky  mr-2 py-3 px-4 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-primary ' :
                                                                'ml-2 py-3 px-4  bg-primary rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white'} `}>
                                                            {message.text}
                                                        </div>
                                                        {/* <img
                                                            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                                                            class="object-cover h-8 w-8 rounded-full"
                                                            alt=""
                                                        /> */}
                                                        
                                                    </div>
                                                </div>

                                            </>

                                        );
                                    })}
                            </div>
                            
                        </div>
                        <div class="py-5 px-5" style={{position:'fixed', bottom:0, background:'white', width:'100%'}}>
                                <form className="send-message" onSubmit={handleSubmit}>
                                    <input
                                        class="w-full bg-sky py-5 px-3 rounded-xl"
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Ecrivez un message..."
                                    />
                                    <button type="submit">Envoyer</button>
                                </form>

                            </div>


                    </>
                ) : <p>Pas de message pour l'instant.</p>
            }
        </div>
    )
}

export default ChatWindow