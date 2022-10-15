import i18next, { langs } from "@/lang/index.js";

const langNames = Object.keys(langs);

function changeLanguage(state, action) {
	const indexNewLang = action.payload;

	state.currLng = langNames[indexNewLang];
	localStorage.setItem("lng", state.currLng);
	i18next.changeLanguage(state.currLng);
}

export { changeLanguage };
