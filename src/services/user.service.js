import { NotFoundError } from "../helper/custom-errors.js";
import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";

export const findUserService = async (_id) => {
  const user = await UserModel.findOne({ _id });

  if (!user) throw new NotFoundError("User not found");

  return user;
};

export const findAllUserService = async (req) => {
  const users = await UserModel.find({ _id: { $ne: req?.user?.id } }).sort({
    created_at: 1,
  });

  const userWithMessages = await Promise.all(
    users.map(async (user) => {
      const message = await MessageModel.findOne({
        $or: [
          { sender: req?.user?._id, recipient: user?.id },
          { sender: user?.id, recipient: req?.user?.id },
        ],
      }).sort({
        createdAt: -1,
      });

      return {
        ...user.toObject(),
        lastMessage: message ? message.content : "",
      };
    })
  );

  return userWithMessages;
};
