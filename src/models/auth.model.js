import { Schema, model, modelNames } from "mongoose";

export const AuthSchema = new Schema({
  google_id: {
    type: String,
    required: false,
  },
  facebook_id: {
    type: String,
    required: false,
  },
});

const AuthModel = modelNames.Auth || model("Auth", AuthSchema);

export default AuthModel;
