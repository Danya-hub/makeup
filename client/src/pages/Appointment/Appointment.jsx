import { useState, useLayoutEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
	asyncActions as userProcAsyncActions,
} from "@/service/redusers/userProcedures.js";
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
	const { t } = useTranslation();

	const [isMouseDown, setMouseDownState] = useState(false);
	const [visibledGroups, setVisibledGroup] = useState({});

	async function init() {
		await dispatch(userProcAsyncActions.getProcedureByDay(userProcedures.locale));
		await dispatch(userProcAsyncActions.getAllTypes());
		await dispatch(userProcAsyncActions.getDefaultProcValue());
	}

	useLayoutEffect(() => {
		init();
	}, []);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValue = useMemo(() => ({
		isMouseDown,
		setMouseDownState,
		visibledGroups,
		setVisibledGroup,
	}), [isMouseDown, visibledGroups]);

	return (
		<section id={style.allProcedures}>
			<Helmet>
				<title>{t(userProcedures.currentProcedure ? "appointmentTitle" : "loading")}</title>
			</Helmet>
			<PropsContext.Provider value={contextValue}>
				{userProcedures.currentProcedure ? (
					<>
						<ControlPanel />
						<Presentation />
						<ProcPopup />
					</>
				) : (
					<>
						<PlaceholderLoader width="250px" />
						<SimpleLoader />
					</>
				)}
			</PropsContext.Provider>
		</section>
	);
}

export default Appointment;
