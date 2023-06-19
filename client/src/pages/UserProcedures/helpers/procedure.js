import {
	states,
} from "@/config/procedures.js";

const userProceduresHelpers = {
	sortByState(value) {
		return value.slice().sort((a, b) => states[a.state].position - states[b.state].position);
	},
};

export default userProceduresHelpers;