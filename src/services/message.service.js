import { BadRequestError, NotFoundError } from "../helper/custom-errors.js";
import MessageModel from "../models/message.model.js";
import tryCatch from "../helper/try-catch.js";

export const findMessageService = async (messageId) => {
  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new NotFoundError("Message not found");
  }

  return message;
};

export const createMessageService = async ({ sender, recipient, content }) => {
  const message = new MessageModel({
    sender,
    recipient,
    content,
  });

  await message.save();

  const newMessage = await MessageModel.findById(message._id)
    .populate({
      path: "sender",
      select: "username email profile",
    })
    .populate({
      path: "recipient",
      select: "username email profile",
    });

  const userId = sender;

  newMessage.isRead = false;

  const messageDetails = {
    ...newMessage.toObject(),
    totalReactions: 0,
    isSender: newMessage.sender._id.toString() === userId ? true : false,
  };

  return messageDetails;
};

export const deleteMessageService = async (messageId) => {
  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new NotFoundError("Message not found");
  }

  const deleteMessage = message;

  await message.deleteOne();

  return deleteMessage;
};

export const updateMessageService = async (data) => {
  const message = await MessageModel.findById(data.messageId);

  if (!message) {
    return;
  }

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  if (message.createdAt < fiveMinutesAgo) {
    console.log("Message can't be above within 5 minutes of creation");

    return;
  }

  message.content = data.content;
  message.updatedAt = new Date();

  await message.save();

  return message;
};

export const findAllMessageService = async (req) => {
  const { page = 1, sender, recipient } = req.query;
  const userId = req.user._id;
  const limit = 50;

  const query = {
    $or: [
      { sender: sender, recipient: recipient },
      { sender: recipient, recipient: sender },
    ],
  };

  // Count the total number of messages that match the query
  const totalMessagesCount = await MessageModel.countDocuments(query);

  const messages = await MessageModel.find(query)
    .populate({
      path: "sender",
      select: "username email profile",
    })
    .populate({
      path: "recipient",
      select: "username email profile",
    })
    .populate({
      path: "reactions.user",
      select: "username email profile",
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const messageDetails = await Promise.all(
    messages.map(async (message) => {
      const totalReactions = message.reactions.length;

      if (
        message.recipient._id.toString() === userId.toString() &&
        !message.isRead
      ) {
        message.isRead = true;
        await message.save();
      }

      return {
        ...message.toObject(),
        totalReactions,
        isSender:
          message.sender._id.toString() === userId.toString() ? true : false,
      };
    })
  );

  // Calculate the last page
  const lastPage = Math.ceil(totalMessagesCount / limit);

  return {
    page,
    limit,
    totalMessages: totalMessagesCount,
    lastPage,
    messages: messageDetails,
  };
};

export const findLastMessageService = async (senderId, recipientId) => {
  const lastMessage = await MessageModel.findOne({
    $or: [
      { sender: senderId, recipient: recipientId },
      { sender: recipientId, recipient: senderId },
    ],
  })
    .populate({
      path: "sender",
      select: "username email profile",
    })
    .populate({
      path: "recipient",
      select: "username email profile",
    })
    .sort({ createdAt: -1 });

  if (!lastMessage) {
    throw new NotFoundError("No messages found between users");
  }

  return lastMessage;
};
