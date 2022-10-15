import UserModel from "../models/user.js";

class UserService {
    constructor() {

    }

    async createUser(payload) {
        const password = UserModel.generatePassword(10);
        const newUser = await UserModel.create({
            ...payload,
            password,
        });
        
        await newUser.save();

        const {
            password: _,
            ...newUserWithoutPassword
        } = newUser._doc;

        return newUserWithoutPassword;
    }
}

export default new UserService();
