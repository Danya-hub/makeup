import { useContext } from "react";

import PropsContext from "@/pages/AllProcedures/context.js";

import { POPUP_COMPONENTS } from "@/pages/AllProcedures/constants.js";

function ProcPopup() {
	const { changePopupNameState } = useContext(PropsContext);

	const [popupName] = changePopupNameState;

	function switchPopup(name) {
		const el = POPUP_COMPONENTS[name]();

		return el;
	}

	return switchPopup(popupName);
}

export { ProcPopup as default };
