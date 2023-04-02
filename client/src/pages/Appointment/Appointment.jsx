import { useLocation } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	asyncActions as userProcAsyncActions,
} from "@/service/redusers/userProcedures.js";
import {
	asyncActions as allProcAsyncActions,
} from "@/service/redusers/allProcedures.js";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import PlaceholderLoader from "../../components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import PropsContext from "./context.js";
import { DEFAULT_POPUP_NAME } from "@/pages/Appointment/constants.js";

import style from "./Appointment.module.css";

function Appointment() {
	const dispatch = useDispatch();
	const {
		userProcedures,
	} = useSelector((state) => state);
	const { state: locationState } = useLocation();

	const [isVisibleProcedurePopup, setVisibleProcedurePopup] = useState(
		Boolean(locationState?.isVisiblePopup),
	);
	const [popupName, changePopupName] = useState(DEFAULT_POPUP_NAME);

	async function init() {
		dispatch(allProcAsyncActions.getProcedureByDay(userProcedures.locale));
		dispatch(allProcAsyncActions.getAllTypes());
		dispatch(userProcAsyncActions.getDefaultProcValue());
	}

	useLayoutEffect(() => init, []);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValue = {
		changePopupNameState: [popupName, changePopupName],
		visiblePopupState: [isVisibleProcedurePopup, setVisibleProcedurePopup],
	};

	return (
		<div id={style.allProcedures}>
			<PropsContext.Provider value={contextValue}>
				{userProcedures.isLoading ? <PlaceholderLoader width="250px" />
					: <ControlPanel />}
				{!userProcedures.currentProcedure ? (
					<SimpleLoader />
				) : (
					<>
						<Presentation />
						<ProcPopup />
					</>
				)}
			</PropsContext.Provider>
		</div>
	);
}

export default Appointment;
