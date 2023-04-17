import TypeService from "./type.js";
import UserService from "./user.js";

class Procedure {
    async populate(procedure) {
        const type = await TypeService.findById(procedure.type)
            .then((value) => value[0]);
        const user = await UserService.findById(procedure.user)
            .then((value) => value[0]);

        return {
            ...procedure,
            type,
            user,
        };
    }
}

export default new Procedure();