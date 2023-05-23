import TypeService from "./type.js";
import UserService from "./user.js";
import Pdf from "../utils/pdf.js";
import {
    server
} from "../config/server.js";

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

    async urlToPdfBuffer(contract) {
        const [path, fields] = contract;
        const newPdfFile = new Pdf();

        await newPdfFile.readFile(server.origin + path);
        await newPdfFile.setFieldsText(fields);
        newPdfFile.form.flatten();

        return newPdfFile.getBuffer();
    }
}

export default new Procedure();