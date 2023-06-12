import { useContext, memo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Event from "@/components/Event/Event.jsx";

import { asyncActions } from "@/service/redusers/user.js";
import GlobalContext from "@/context/global.js";

import style from "./Links.module.css";

function Links() {
	const dispatch = useDispatch();
	const { appointments } = useSelector((state) => state);
	const { t } = useTranslation();
	const {
		setVisiblePopup,
		setPopup,
		setOpenCabinet,
		setAuthState,
	} = useContext(GlobalContext);

	function handleLogout() {
		dispatch(asyncActions.logout());
		setAuthState(false);
	}

	function handleCloseCabinet() {
		setOpenCabinet(false);
	}

	function handleDesign() {
		setPopup(["design", null]);
		setVisiblePopup(true);
	}

	return (
		<div className={style.links}>
			<ul>
				<li>
					<Event callback={handleCloseCabinet}>
						<Link to="/appointment/me">{t("appointmentHistory")}</Link>
					</Event>
				</li>
				<li>
					<Event callback={handleCloseCabinet}>
						<Link to="/appointment">{t("calendar")}</Link>
					</Event>
				</li>
			</ul>
			<hr />
			<ul>
				<li>
					<Event callback={handleCloseCabinet}>
						<Link
							to="/appointment"
							id={style.design}
							onClick={handleDesign}
						>
							{t("myCurrentServices")}
							<span id={style.countProcedures}>{appointments.newProcedures.length}</span>
						</Link>
					</Event>
				</li>
			</ul>
			<hr />
			<Event callback={handleCloseCabinet}>
				<button
					type="button"
					id={style.logout}
					className="button"
					onClick={handleLogout}
				>
					{t("logout")}
				</button>
			</Event>
		</div>
	);
}

export default memo(Links);