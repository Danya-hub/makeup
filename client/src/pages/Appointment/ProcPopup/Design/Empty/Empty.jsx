import { useContext } from "react";
import { useTranslation } from "react-i18next";

import GlobalContext from "@/context/global.js";

import style from "./Empty.module.css";

function Empty() {
	const {
		setPopup,
	} = useContext(GlobalContext);
	const { t } = useTranslation();

	function handleMake() {
		setPopup(["make", null]);
	}

	return (
		<div
			id={style.empty}
		>
			<i className="fa fa-times" aria-hidden="true" />
			<div>
				<h2>{t("noServicesTitle")}</h2>
				<p>{t("noServicesText")}</p>
			</div>
			<button
				type="button"
				className="button border"
				onClick={handleMake}
			>
				{t("book")}
			</button>
		</div>
	);
}

export default Empty;