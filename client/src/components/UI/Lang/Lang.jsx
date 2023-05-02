import { useContext } from "react";

import GlobalContext from "@/context/global.js";

import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./Lang.module.css";

function Lang() {
	const {
		currentLang,
		langs,
		changeLanguage,
	} = useContext(GlobalContext);

	const langNames = Object.keys(langs);

	return (
		<Select
			id={style.langs}
			defaultValue={currentLang}
			values={langNames}
			onChange={changeLanguage}
		/>
	);
}

export default Lang;