import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import GlobalContext from "@/context/global.js";
import DateFormatter from "@/utils/dateFormatter.js";

import style from "./Total.module.css";

function Total() {
	const {
		newProcedures,
	} = useSelector((state) => state.appointments);
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const sum = newProcedures
		.map(([proc]) => proc.type.price)
		.reduce((prev, curr) => prev + curr, 0);

	const hours = newProcedures.map(([proc]) => proc.type.duration)
		.reduce((prev, curr) => prev + curr, 0);
	const date = DateFormatter.minutesToDate(hours * 60);
	const formatedStringDate = DateFormatter.stringHourAndMin(date, currentLang);

	return (
		<div className={style.total}>
			<h3>{t("total")}</h3>
			<span>
				{t("sum")}
				:
				{' '}
				<b>
					{sum}
					{newProcedures[0][0].type.currency}
				</b>
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

export default Total;