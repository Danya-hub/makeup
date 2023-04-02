import {
	useState,
} from "react";

import i18next, {
	langs,
} from "@/lang/index.js";

function useLang() {
	const [currentLang, setLng] = useState(localStorage.getItem("lng") || i18next.language);

	const langNames = Object.keys(langs);

	function changeLanguage(index) {
		i18next.language = langNames[index];
		i18next.changeLanguage(i18next.language);

		localStorage.setItem("lng", i18next.language);
		setLng(i18next.language);
	}

	return [{
		currentLang,
		langs,
	}, changeLanguage];
}

export default useLang;