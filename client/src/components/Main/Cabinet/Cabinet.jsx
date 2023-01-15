import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Aside from "@/components/Aside/Aside.jsx";
import Event from "@/components/Event/Event.jsx";
import Avatar from "./Avatar/Avatar.jsx";

import { logout } from "@/service/redusers/user.js";

import style from "./Cabinet.module.css";

Cabinet.propTypes = {
	openCabinetState: types.array,
};

function Cabinet({ openCabinetState }) {
	const { info: userInfo } = useSelector((state) => state.user);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [, setOpenCabinet] = openCabinetState;

	function handleLogout() {
		dispatch(logout());
	}

	function handleCloseCabinet() {
		setOpenCabinet(false);
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
						<Event callback={handleCloseCabinet}>
							<Link
								id={style.changePassword}
								to="/"
							>
								{t("changePassword")}
							</Link>
						</Event>
					</div>
				</div>
				<ul>
					<li>
						<Event callback={handleCloseCabinet}>
							<Link to="/myprocedures">Мои записи процедуры</Link>
						</Event>
					</li>
					<li>
						<Event callback={handleCloseCabinet}>
							<Link to="/appointment">Записаться</Link>
						</Event>
					</li>
				</ul>
				<Event callback={handleCloseCabinet}>
					<button
						id={style.logout}
						className="button"
						onClick={handleLogout}
					>
						Выйти
					</button>
				</Event>
			</Aside>
		)
	);
}

export { Cabinet as default };
