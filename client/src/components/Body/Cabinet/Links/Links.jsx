import { useContext, memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Event from "@/components/Event/Event.jsx";

import GlobalContext from "@/context/global.js";

import style from "./Links.module.css";

function Links() {
	const { appointments, userProcedures } = useSelector((state) => state);
	const { t } = useTranslation();
	const {
		setVisiblePopup,
		setPopup,
		setOpenCabinet,
	} = useContext(GlobalContext);

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
				<li>
					<Event callback={handleCloseCabinet}>
						<Link
							to="/appointment/me"
							state={{
								path: "myFavorites",
							}}
							id={style.design}
						>
							{t("myFavorites")}
							<span id={style.countProcedures}>{userProcedures.favoriteProcedurs.length}</span>
						</Link>
					</Event>
				</li>
			</ul>
			<ul>
				<li>
					<Event callback={handleCloseCabinet}>
						<Link to="/appointment">{t("calendar")}</Link>
					</Event>
				</li>
			</ul>
		</div>
	);
}

export default memo(Links);