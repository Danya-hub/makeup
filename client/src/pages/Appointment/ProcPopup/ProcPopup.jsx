import { useContext } from "react";

import MakeProc from "./Make/Make.jsx";
import DesignProc from "./Design/Design.jsx";
import EditProc from "./Edit/Edit.jsx";

import PropsContext from "@/pages/Appointment/context.js";

export const POPUP_COMPONENTS = {
	design: () => <DesignProc />,
	make: () => <MakeProc />,
	edit: () => <EditProc />,
};

function ProcPopup() {
	const { changePopupNameState } = useContext(PropsContext);

	const [popupName] = changePopupNameState;

	function switchPopup(name) {
		const el = POPUP_COMPONENTS[name]();

		return el;
	}

	return switchPopup(popupName); // switchPopup(popupName)
}

export default ProcPopup;
