import MessageModel from "../models/message.js";

class Message {
  async send(doc) {
    const newMessage = await MessageModel.create(doc);
    await newMessage.save();

    return newMessage._doc;
  }

  async get(filter) {
    const foundMessage = await MessageModel.findOne(filter);

    return foundMessage;
  }

  async remove(filter) {
    const removedMessage = await MessageModel.deleteOne(filter);

    return removedMessage;
  }
}

export default new Message();
