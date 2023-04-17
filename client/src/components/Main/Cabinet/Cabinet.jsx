import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Aside from "@/components/Aside/Aside.jsx";
import Event from "@/components/Event/Event.jsx";
import Avatar from "./Avatar/Avatar.jsx";

import { asyncActions } from "@/service/redusers/user.js";

import style from "./Cabinet.module.css";

function Cabinet({ openCabinetState }) {
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);
	const { t } = useTranslation();

	const [, setOpenCabinet] = openCabinetState;

	function handleLogout() {
		dispatch(asyncActions.logout());
	}

	function handleCloseCabinet() {
		setOpenCabinet(false);
	}

	function handleResetPassword() {
		dispatch(
			asyncActions.sendLinkForResetingPassword({
				email: userInfo.email,
			}),
		);
	}

	return (
		userInfo && (
			<Aside
				id={style.cabinet}
				className="lines fitContent"
				openState={openCabinetState}
			>
				<div id={style.info}>
					<Avatar
						id={style.userAvatar}
						userName={userInfo.fullname}
					/>
					<div className={style.fields}>
						<span id={style.name}>{userInfo.fullname}</span>
						<span id="telephone">{userInfo.telephone}</span>
						<span id="telephone">{userInfo.email}</span>
						<button
							type="button"
							id={style.resetPassword}
							onClick={handleResetPassword}
						>
							{t("changePassword")}
						</button>
					</div>
				</div>
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
			</Aside>
		)
	);
}

Cabinet.propTypes = {
	openCabinetState: types.instanceOf(Array).isRequired,
};

export default Cabinet;
