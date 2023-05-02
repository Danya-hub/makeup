import { useContext } from "react";

import GlobalContext from "@/context/global.js";
import popups from "./constants.jsx";

function ProcPopup() {
	const {
		popupName,
	} = useContext(GlobalContext);

	function switchPopup(name) {
		const el = popups[name] && popups[name]();

		return el;
	}

	return switchPopup(popupName);
}

export default ProcPopup;
