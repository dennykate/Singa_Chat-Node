import MessageModel from "../models/message.model.js";
import { findMessageService } from "./message.service.js";

export const addReactionService = async (data) => {
  const message = await findMessageService(data.messageId);

  const existingReactionIndex = message.reactions.findIndex(
    (reaction) =>
      reaction.user.toString() === data.userId.toString() &&
      reaction.type === data.reactionType
  );

  if (existingReactionIndex !== -1) {
    return false;
  }

  message.reactions.push({ user: data.userId, type: data.reactionType });

  await message.save();

  return message;
};

export const removeReactionService = async (data) => {
  const message = await findMessageService(data.messageId);

  const reactionIndex = message.reactions.findIndex(
    (reaction) =>
      reaction.user.toString() === data.userId.toString() &&
      reaction.type === data.reactionType
  );

  if (reactionIndex === -1) {
    return false;
  }

  message.reactions.splice(reactionIndex, 1);

  await message.save();

  return message;
};
