import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import { actions as langActions } from "@/service/redusers/langs.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";

import Select from "@/components/UI/Form/Select/Select.jsx";
import Logo from "@/components/UI/Logo/Logo.jsx";
import UserSrc from "@/assets/image/user.svg";

import style from "./Header.module.css";

Header.propTypes = {
	openCabinetState: types.array,
	isDisplay: types.bool,
};

function Header({ openCabinetState }) {
	const dispatch = useDispatch();
	const { langs } = useSelector((state) => state);
	const { t } = useTranslation();
	const ref = useOutsideEvent(handleCloseSelect);

	const [isOpenSelect, setOpenSelect] = useState(false);

	const allLangNames = Object.keys(langs.arrayLangs);
	const [, setOpenCabinet] = openCabinetState;
	const isAuth = localStorage.getItem("isAuth");

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	return (
		<header>
			<Logo></Logo>
			<nav>
				<Select
					id={style.langs}
					ref={ref}
					defaultValue={langs.currLng}
					values={allLangNames}
					strictSwitch={[isOpenSelect, setOpenSelect]}
					onChange={(ind) => dispatch(langActions.changeLanguage(ind))}
				></Select>
				{!isAuth && (
					<Link
						className="button"
						to="/signin"
					>
						{t("signIn")}
					</Link>
				)}
				<Link
					className="button uppercase"
					to="/appointment"
				>
					{t("calendar")}
				</Link>
				{isAuth && (
					<button
						id={style.userInfo}
						className="button"
						onClick={() => {
							setOpenCabinet(true);
						}}
					>
						<img
							src={UserSrc}
							alt="user"
						/>
					</button>
				)}
			</nav>
		</header>
	);
}

export { Header as default };
