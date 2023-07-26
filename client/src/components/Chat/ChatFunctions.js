import { ref, update, push } from "firebase/database";
import { realtimeDatabase } from "../../services/firebase";



export const createConversation=(participant1, participant2, textToSend) =>{
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