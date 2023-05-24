import { useContext } from "react";

import GlobalContext from "@/context/global.js";
import popups from "@/pages/Appointment/constants/popups.jsx";

function ProcPopup() {
	const {
		popup: [popupName],
	} = useContext(GlobalContext);

	function switchPopup(name) {
		const el = popups[name] && popups[name]();

		return el;
	}

	return switchPopup(popupName);
}

export default ProcPopup;
