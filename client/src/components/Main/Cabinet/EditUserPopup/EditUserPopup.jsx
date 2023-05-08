import { useContext } from "react";
import { useSelector } from "react-redux";

import GlobalContext from "@/context/global.js";
import popups from "./constants/popups.jsx";

function EditUserPopup() {
	const {
		popupName,
	} = useContext(GlobalContext);
	const { info: userInfo } = useSelector((state) => state.user);

	function switchPopup(name) {
		const el = (popups[name] && userInfo) && popups[name]();

		return el;
	}

	return switchPopup(popupName);
}

export default EditUserPopup;
