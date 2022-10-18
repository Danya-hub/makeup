import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Aside from "@/components/Aside/Aside.jsx";
import Avatar from "./Avatar/Avatar.jsx";

import { logout } from "../../../service/redusers/user.js";

import style from "./Cabinet.module.css";

Cabinet.propTypes = {
	openCabinetState: types.array,
};

function Cabinet({ openCabinetState }) {
	const { info: userInfo } = useSelector((state) => state.user);
	const { t } = useTranslation();
	const dispatch = useDispatch();

	function handleLogout() {
		dispatch(logout());
	}

	return (
		userInfo && (
			<Aside
				id={style.cabinet}
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
						<Link
							id={style.changePassword}
							to="/"
						>
							{t("changePassword")}
						</Link>
					</div>
				</div>
				<ul>
					<li>
						<Link to="/myProcedures">Мои записи процедур</Link>
					</li>
				</ul>
				<button
					id={style.logout}
					className="button"
					onClick={handleLogout}
				>
					Выйти
				</button>
			</Aside>
		)
	);
}

export { Cabinet as default };
