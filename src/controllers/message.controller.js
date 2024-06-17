import { findAllMessageService } from "../services/message.service.js"

export const findAllMessageController = async (req,res) => {
    const messages = await findAllMessageService(req);

    return res.success(messages)
}