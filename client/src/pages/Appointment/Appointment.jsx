import { useState, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	asyncActions as userProcAsyncActions,
} from "@/service/redusers/userProcedures.js";
import {
	asyncActions as allProcAsyncActions,
} from "@/service/redusers/allProcedures.js";
import PropsContext from "./context/context.js";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "./Appointment.module.css";

function Appointment() {
	const dispatch = useDispatch();
	const {
		userProcedures,
	} = useSelector((state) => state);

	const [isMouseDown, setMouseDownState] = useState(false);
	const [visibledGroups, setVisibledGroup] = useState({});

	async function init() {
		await dispatch(allProcAsyncActions.getProcedureByDay(userProcedures.locale));
		await dispatch(userProcAsyncActions.getAllTypes());
		await dispatch(userProcAsyncActions.getDefaultProcValue());
	}

	useLayoutEffect(() => init, []);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValue = useMemo(() => ({
		isMouseDown,
		setMouseDownState,
		visibledGroups,
		setVisibledGroup,
	}), [isMouseDown, visibledGroups]);

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
