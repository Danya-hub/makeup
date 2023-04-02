import { useState, useContext } from "react";

import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import LangContext from "@/context/lang.js";

import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./Lang.module.css";

function Lang() {
	const [isOpenSelect, setOpenSelect] = useState(false);
	const [{
		currentLang,
		langs,
	}, setLang] = useContext(LangContext);

	const langNames = Object.keys(langs);

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	const ref = useOutsideEvent(handleCloseSelect);

	return (
		<Select
			id={style.langs}
			ref={ref}
			defaultValue={currentLang}
			values={langNames}
			openState={[isOpenSelect, setOpenSelect]}
			onChange={(ind) => setLang(ind)}
		/>
	);
}

export default Lang;