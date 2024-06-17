import { Server } from "socket.io";
import { decode } from "../libs/jwt.js";
import {
  createMessageService,
  deleteMessageService,
  findLastMessageService,
  updateMessageService,
} from "../services/message.service.js";
import {
  addReactionService,
  removeReactionService,
} from "../services/reactions.service.js";
import { findUserService } from "../services/user.service.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  global.onlineUsers = new Map();

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });

    socket.on("new-user", async (data) => {
      const { user } = await decode(data.accessToken);
      io.emit("new-user", { user: { ...user, lastMessage: "" } });
    });

    // Initialize chat
    socket.on("init-chat", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    });

    // Send Message
    socket.on("send-message", async (data) => {
      console.log("socket id => ", socket.id);
      const message = await createMessageService(data);

      if (message) {
        const recipientId = message.recipient._id.toString();
        const senderId = message.sender._id.toString();

        const recipientSocket = onlineUsers.get(recipientId);
        const senderSocket = onlineUsers.get(senderId);

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive-message", {
            ...message,
            isSender: false,
          });
        }

        if (senderSocket) {
          io.to(senderSocket).emit("receive-message", {
            ...message,
            isSender: true,
          });
        }
      }
    });

    // Delete Message
    socket.on("delete-message", async (messageId) => {
      try {
        const deleteMessage = await deleteMessageService(messageId);

        if (!deleteMessage) {
          console.error("Message not found for deletion:", messageId);
          return;
        }

        const recipientSocket = onlineUsers.get(
          deleteMessage.recipient.toString()
        );

        const senderSocket = onlineUsers.get(deleteMessage.sender.toString());

        const lastMessage = await findLastMessageService(
          deleteMessage.sender.toString(),
          deleteMessage.recipient.toString()
        );

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive-delete-message", {
            messageId: deleteMessage._id,
            lastMessage,
          });
        }

        if (senderSocket) {
          io.to(senderSocket).emit("receive-delete-message", {
            messageId: deleteMessage._id,
            lastMessage,
          });
        }
      } catch (error) {
        console.error("Error handling delete-message event:", error);
      }
    });

    // Update Message
    socket.on("update-message", async (data) => {
      const updateMessage = await updateMessageService(data);

      if (updateMessage) {
        const recipientSocket = onlineUsers.get(
          updateMessage.recipient.toString()
        );

        const senderSocket = onlineUsers.get(updateMessage.sender.toString());

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive-update-message", updateMessage);
        }

        if (senderSocket) {
          io.to(senderSocket).emit("receive-update-message", updateMessage);
        }
      }
    });

    // Read all messages
    socket.on("read-all-messages", (data) => {
      const recipientSocket = onlineUsers.get(data.recipient.toString());

      const senderSocket = onlineUsers.get(data.sender.toString());

      if (recipientSocket) {
        io.to(recipientSocket).emit("receive-read-all-messages", true);
      }

      if (senderSocket) {
        io.to(senderSocket).emit("receive-read-all-messages", true);
      }
    });

    // Typing
    socket.on("is-typing", (data) => {
      const recipientSocket = onlineUsers.get(data.recipient.toString());

      if (recipientSocket) {
        io.to(recipientSocket).emit("receive-is-typing", data);
      }
    });

    // Not Typing
    socket.on("is-not-typing", (data) => {
      const recipientSocket = onlineUsers.get(data.recipient.toString());

      if (recipientSocket) {
        io.to(recipientSocket).emit("receive-is-not-typing", data);
      }
    });

    // Add Reaction
    socket.on("add-reaction", async (data) => {
      const message = await addReactionService(data);

      if (message) {
        const recipientSocket = onlineUsers.get(message.recipient.toString());
        const senderSocket = onlineUsers.get(message.sender._id.toString());

        const reactionUser = await findUserService(data.userId);

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive-add-reaction", {
            messageId: message._id,
            reactionUserId: data.userId,
            reactionType: data.reactionType,
            reactionUser,
          });
        }

        if (senderSocket) {
          io.to(senderSocket).emit("receive-add-reaction", {
            messageId: message._id,
            reactionUserId: data.userId,
            reactionType: data.reactionType,
            reactionUser,
          });
        }
      }
    });

    // Remove Reaction
    socket.on("remove-reaction", async (data) => {
      const message = await removeReactionService(data);

      if (message) {
        const recipientSocket = onlineUsers.get(message.recipient.toString());
        const senderSocket = onlineUsers.get(message.sender.toString());

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive-remove-reaction", {
            messageId: message._id,
            reactionUserId: data.userId,
            reactionType: data.reactionType,
          });
        }

        if (senderSocket) {
          io.to(senderSocket).emit("receive-remove-reaction", {
            messageId: message._id,
            reactionUserId: data.userId,
            reactionType: data.reactionType,
          });
        }
      }
    });
  });

  return io;
};

export default initializeSocket;
