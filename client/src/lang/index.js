import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.js";
import ru from "./ru.js";
import uk from "./uk.js";

const langs = {
	en,
	ru,
	uk,
};

i18next.use(initReactI18next).init({
	resources: langs,
	lng: localStorage.getItem("lng") || window.navigator.language,
	fallbackLng: "en",
	interpolation: {
		escapeValue: true,
	},
});

export { i18next as default, langs };
