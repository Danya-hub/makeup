import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import { actions as langActions } from "@/service/redusers/langs.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";

import Select from "@/components/UI/Form/Select/Select.jsx";
import Logo from "@/components/UI/Logo/Logo.jsx";
import { default as UserSrc } from "@/assets/image/user.svg";

import style from "./Header.module.css";

Header.propTypes = {
	openCabinetState: types.array,
	isDisplay: types.bool,
};

function Header({ openCabinetState, isDisplay }) {
	const dispatch = useDispatch();
	const { langs, user } = useSelector((state) => state);
	const { t } = useTranslation();
	const ref = useOutsideEvent(handleCloseSelect);

	const allLangNames = Object.keys(langs.arrayLangs);
	const [isOpenSelect, setOpenSelect] = useState(false);
	const [, setBoolOpenCabinet] = openCabinetState;

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	return (
		<header
			style={{
				display: !isDisplay ? "none" : "flex",
			}}
		>
			<Logo></Logo>
			<div>
				<Select
					ref={ref}
					defaultValue={langs.currLng}
					values={allLangNames}
					strictSwitch={[isOpenSelect, setOpenSelect]}
					onChange={(ind) => dispatch(langActions.changeLanguage(ind))}
					id={style.langs}
				></Select>
				{!user.info && (
					<Link
						className="button"
						to="/signin"
						state={{
							purpose: "adviceForAuth",
						}}
					>
						{t("signIn")}
					</Link>
				)}
				<Link
					className="button border"
					to="/appointment"
				>
					{
						t("book", {
							returnObjects: true,
						}).long
					}
				</Link>
				{user.info && (
					<button
						id={style.userInfo}
						className="button"
						onClick={() => {
							setBoolOpenCabinet(true);
						}}
					>
						<img
							src={UserSrc}
							alt="user"
						/>
					</button>
				)}
			</div>
		</header>
	);
}

export { Header as default };
