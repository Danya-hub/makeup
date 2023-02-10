"use strict";

import MessageModel from "../models/message.js";

class Message {
    constructor() {

    }

    async send(doc) {
        try {    
            const newMessage = await MessageModel.create(doc);
            await newMessage.save();
    
            return newMessage._doc;
        } catch (error) {
            throw error;
        }
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