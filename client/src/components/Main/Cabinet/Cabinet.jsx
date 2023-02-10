import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Aside from "@/components/Aside/Aside.jsx";
import Event from "@/components/Event/Event.jsx";
import Avatar from "./Avatar/Avatar.jsx";

import { logout, requestResetPassword } from "@/service/redusers/user.js";

import style from "./Cabinet.module.css";

Cabinet.propTypes = {
	openCabinetState: types.array,
};

function Cabinet({ openCabinetState }) {
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);
	const { t } = useTranslation();

	const [, setOpenCabinet] = openCabinetState;

	function handleLogout() {
		dispatch(logout());
	}

	function handleCloseCabinet() {
		setOpenCabinet(false);
	}

	function handleResetPassword() {
		dispatch(
			requestResetPassword({
				email: userInfo.email,
			})
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
					></Avatar>
					<div className={style.fields}>
						<span id={style.name}>{userInfo.fullname}</span>
						<span id="telephone">{userInfo.telephone}</span>
						<span id="telephone">{userInfo.email}</span>
						<button
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
							<Link to="/appointment">
								{
									t("book", {
										returnObjects: true,
									}).long
								}
							</Link>
						</Event>
					</li>
				</ul>
				<Event callback={handleCloseCabinet}>
					<button
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

export { Cabinet as default };
