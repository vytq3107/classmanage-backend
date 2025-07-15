const { db } = require("../../config/firebase");

class ChatModel {
  static async getAllConversations(userId) {
    try {
      const chatRef = db.ref("chat");
      const snapshot = await chatRef.once("value");
      const conversations = [];

      snapshot.forEach((chatSnapshot) => {
        const chatId = chatSnapshot.key;

        if (chatId.includes(userId)) {
          const messages = [];
          chatSnapshot.forEach((msgSnap) => {
            messages.push(msgSnap.val());
          });

          conversations.push({ chatId, messages });
        }
      });

      return conversations;
    } catch (error) {
      throw new Error("Error fetching all conversations: " + error.message);
    }
  }

  static async getChatHistory(senderId, receiverId) {
    try {
      if (!senderId || !receiverId) {
        throw new Error("Sender ID and Receiver ID are required.");
      }

      const chatRef = db.ref("chat");
      const snapshot = await chatRef.orderByChild("timestamp").startAt(0).once("value");

      const chatHistory = [];

      snapshot.forEach((chat) => {
        const chatData = chat.val();
        if (
          (chatData.sender === senderId && chatData.receiver === receiverId) ||
          (chatData.sender === receiverId && chatData.receiver === senderId)
        ) {
          chatHistory.push(chatData);
        }
      });

      return chatHistory;
    } catch (error) {
      throw new Error("Error fetching chat history: " + error.message);
    }
  }

  static async checkChatExists(senderId, receiverId) {
    const chatId = createChatId(senderId, receiverId);
    const chatRef = db.ref("chat").child(chatId);
    const snapshot = await chatRef.once("value");
    return snapshot.exists();
  }

  static async sendMessage(senderId, receiverId, message) {
    try {
      if (!senderId || !receiverId || !message) {
        throw new Error("Sender ID, Receiver ID, and message are required.");
      }

      const chatId = createChatId(senderId, receiverId);
      const chatExists = await ChatModel.checkChatExists(senderId, receiverId);

      if (!chatExists) {
        await db.ref("chat").child(chatId).set({});
      }

      const chatRef = db.ref("chat").child(chatId);
      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        content: message,
        timestamp: Date.now()
      };

      const newMessageRef = chatRef.push();
      await newMessageRef.set(newMessage);

      return newMessage;
    } catch (error) {
      throw new Error("Error sending message: " + error.message);
    }
  }
}

function createChatId(senderId, receiverId) {
  const ids = [senderId, receiverId].sort();
  return ids.join("_");
}

module.exports = ChatModel;
