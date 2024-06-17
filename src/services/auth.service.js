import { BadRequestError } from "../helper/custom-errors.js";
import getGoogleUserInfo from "../libs/get-google-userinfo.js";

import { decode, generate } from "../libs/jwt.js";
import UserModel from "../models/user.model.js";

export const googleAuthService = async (req) => {
  const userInfo = await getGoogleUserInfo(req.body["access_token"]);

  if (userInfo?.error) throw new BadRequestError("Invalid Credentials");

  const { email, name, picture } = userInfo;

  const existUser = await UserModel.findOne({ email });

  if (existUser) {
    const access_payload = {
      id: existUser._id,
      user: existUser,
    };

    const refresh_payload = {
      id: existUser._id,
    };

    const access_token = generate(access_payload, "access");
    const refresh_token = generate(refresh_payload, "refresh");

    return { access_token, refresh_token, is_new: false, user: existUser };
  } else {
    const newUser = await UserModel.create({
      username: name,
      email,
      profile: picture,
      isTyping: false,
    });

    const access_payload = {
      id: newUser._id,
      user: newUser,
    };

    const refresh_payload = {
      id: newUser._id,
    };

    const access_token = generate(access_payload, "access");
    const refresh_token = generate(refresh_payload, "refresh");

    return { access_token, refresh_token, is_new: true, user: newUser };
  }
};
