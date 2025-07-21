const ChatModel = require("./chat.model");

class ChatController {
  static async getChatHistory(req, res) {
  const { senderId, receiverId } = req.query;

  try {
    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "senderId and receiverId are required."
      });
    }

    let chatHistory = await ChatModel.getChatHistory(senderId, receiverId);

    return res.status(200).json({
      success: true,
      message: "Chat history retrieved successfully.",
      data: chatHistory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


  static async sendMessage(req, res) {
    const { senderId, receiverId, message } = req.body;

    try {
      const newMessage = await ChatModel.sendMessage(senderId, receiverId, message);
      return res.status(200).json({
        success: true,
        message: "Message sent successfully.",
        data: newMessage
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

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

          conversations.push({
            chatId,
            messages
          });
        }
      });

      return conversations;
    } catch (error) {
      throw new Error("Error fetching all conversations: " + error.message);
    }
  }
}

module.exports = ChatController;
