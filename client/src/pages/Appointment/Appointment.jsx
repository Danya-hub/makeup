import { useState, useLayoutEffect, useMemo, useContext } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import {
	asyncActions as appointmentsActions,
} from "@/service/redusers/appointments.js";
import PropsContext from "./context/context.js";
import GlobalContext from "@/context/global.js";
import popups from "@/pages/Appointment/constants/popups.jsx";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "./Appointment.module.css";

function Appointment() {
	const dispatch = useDispatch();
	const {
		appointments,
	} = useSelector((state) => state);
	const { t } = useTranslation();
	const {
		setVisiblePopup,
		setPopup,
	} = useContext(GlobalContext);
	const [searchParams] = useSearchParams();

	const [fadeAnimation, setFadeAnimation] = useState(false);
	const [isMouseDown, setMouseDownState] = useState(false);
	const [visibledGroups, setVisibledGroup] = useState({});

	async function init() {
		const body = {};
		const searchParamType = Number.parseInt(searchParams.get("type"), 10);
		const popupName = searchParams.get("action");

		const allTypes = await dispatch(appointmentsActions.getAllTypes())
			.then((res) => res.payload.data);

		const foundType = allTypes.find((type) => searchParamType === type.id);

		if (foundType) {
			body.type = foundType;
		}

		await dispatch(appointmentsActions.getDefaultProcValue(body));
		await dispatch(appointmentsActions.getProcedureByDay(appointments.locale));

		if (popups[popupName]) {
			setPopup([popupName]);
			setVisiblePopup(true);
		}
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
		fadeAnimation,
		setFadeAnimation,
	}), [
		isMouseDown,
		visibledGroups,
		fadeAnimation,
	]);

	return (
		<section id={style.allProcedures}>
			<Helmet>
				<title>{t(appointments.currentProcedure ? "appointmentTitle" : "loading")}</title>
			</Helmet>
			<PropsContext.Provider value={contextValue}>
				{appointments.currentProcedure ? (
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
