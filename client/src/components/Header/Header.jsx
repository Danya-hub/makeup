import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { actions as langActions } from "@/service/redusers/langs.js";
import onOutside from "@/hooks/outside.js";

import Select from "@/components/Form/Select/Select.jsx";
import Logo from "@/features/Logo/Logo.jsx";

import style from "./Header.module.css";

function Header() {
	const dispatch = useDispatch();
	const { arrayLangs, currLng } = useSelector((state) => state.langs);
	const { t } = useTranslation();

	const allLangNames = Object.keys(arrayLangs);
	const [isOpenSelect, setOpenSelect] = useState(false);

	return (
		<header
			{...onOutside({
				onClick: {
					[style.langs]: isOpenSelect
						? () => {
								setOpenSelect(false);
						  }
						: null,
				},
			})}
		>
			<Logo></Logo>
			<div>
				<Select
					defaultValue={currLng}
					values={allLangNames}
					strictSwitch={[isOpenSelect, setOpenSelect]}
					onChange={(ind) => dispatch(langActions.changeLanguage(ind))}
					id={style.langs}
				></Select>
				<Link
					className="button"
					to="/signup"
					state={{
						purpose: t("makeAppointment"),
					}}
				>
					{t("signUp")}
				</Link>
			</div>
		</header>
	);
}

export { Header as default };
