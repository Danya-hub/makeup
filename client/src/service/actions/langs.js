import i18next, { langs } from "@/lang/index.js";

const langNames = Object.keys(langs);

const actions = {
	changeLanguage(state, action) {
		const indexNewLang = action.payload;
		const objState = state;

		objState.currLng = langNames[indexNewLang];
		localStorage.setItem("lng", objState.currLng);
		i18next.changeLanguage(objState.currLng);
	},
};

export default actions;
