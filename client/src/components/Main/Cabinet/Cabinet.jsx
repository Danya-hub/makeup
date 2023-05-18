import { useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Aside from "@/components/Aside/Aside.jsx";
import SocialMedia from "@/components/UI/SocialMedia/SocialMedia.jsx";
import Info from "./Info/Info.jsx";
import Links from "./Links/Links.jsx";

import GlobalContext from "@/context/global.js";

import style from "./Cabinet.module.css";

function Cabinet() {
	const { user } = useSelector((state) => state);
	const { t } = useTranslation();
	const {
		isOpenCabinet,
		setOpenCabinet,
	} = useContext(GlobalContext);
	const asideRender = useCallback(() => (
		<>
			<Info />
			<Links />
			<div className={style.bottom}>
				<h3>{t("inSocMedias")}</h3>
				<SocialMedia />
			</div>
		</>
	), []);

	return (
		user.info && (
			<Aside
				id={style.cabinet}
				className="lines fitContent"
				isPopup
				isOpen={isOpenCabinet}
				setOpen={setOpenCabinet}
				render={asideRender}
			/>
		)
	);
}

export default Cabinet;
