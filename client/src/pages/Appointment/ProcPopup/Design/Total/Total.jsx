import { useContext } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import LangContext from "@/context/lang.js";
import FormatDate from "@/utils/formatDate.js";

import style from "./Total.module.css";

function Total({
	procedures,
}) {
	const { t } = useTranslation();
	const [{
		currentLang,
	}] = useContext(LangContext);

	const sum = procedures
		.map(([proc]) => proc.type.price)
		.reduce((prev, curr) => prev + curr, 0);

	const hours = procedures.map(([proc]) => proc.type.duration)
		.reduce((prev, curr) => prev + curr, 0);
	const date = FormatDate.minutesToDate(hours * 60);
	const formatedStringDate = FormatDate.stringHourAndMin(date, currentLang);

	return (
		<div className={style.total}>
			<h3>{t("total")}</h3>
			<span>
				{t("sum")}
				:
				{' '}
				<b>{sum}</b>
			</span>
			<span>
				{t("duration")}
				:
				{' '}
				<b>{formatedStringDate}</b>
			</span>
		</div>
	);
}

Total.propTypes = {
	procedures: types.instanceOf(Array).isRequired,
};

export default Total;