import React, { useEffect, useState } from 'react'
import { realtimeDatabase } from "../../services/firebase";
import { ref, child, push, update, orderByChild, onValue } from "firebase/database";
import { query } from 'firebase/firestore';
const ChatWindow = ({ activeChat, userId }) => {
    const [newMessage, setNewMessage] = useState("")

    const [messages, setMessages] = useState([]);

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
        setNewMessage('');

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
        <div style={{ width: '70%', border: 'solid 1px blue' }}>
            {
                activeChat ? (
                    <>
                        <div className="messages" style={{ width: '100%', border: 'solid 1px black' }}>
                            {Object.keys(messages).map((messageID) => {
                                const message = messages[messageID];
                                return (
                                    <div key={messageID} className={`message ${message.sender === userId ? 'bg-gray' : 'bg-primary'}`}>
                                        <p className={`message ${message.sender === userId ? 'text-primary' : 'text-gray'}`}>{message.text}</p>
                                        <div className="message-time text-black">{new Date(message.timestamp).toLocaleTimeString()}</div>
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