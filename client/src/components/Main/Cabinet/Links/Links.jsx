import { useContext, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Event from "@/components/Event/Event.jsx";

import { asyncActions } from "@/service/redusers/user.js";
import GlobalContext from "@/context/global.js";

import style from "./Links.module.css";

function Links() {
	const dispatch = useDispatch();
	const { userProcedures } = useSelector((state) => state);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const {
		setVisiblePopup,
		setPopupName,
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
		setPopupName("design");
		setVisiblePopup(true);
		navigate("/appointment");
	}

	return (
		<div className={style.links}>
			<ul>
				<li>
					<Event callback={handleCloseCabinet}>
						<Link to="/myprocedures">{t("myProcedures")}</Link>
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
						<button
							id={style.design}
							type="button"
							className="button"
							onClick={handleDesign}
							disabled={!userProcedures.newProcedures.length}
						>
							{t("appointmentList")}
							<span id={style.countProcedures}>{userProcedures.newProcedures.length}</span>
						</button>
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