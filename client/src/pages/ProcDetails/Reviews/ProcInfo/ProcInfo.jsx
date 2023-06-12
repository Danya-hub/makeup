import types from "prop-types";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import GlobalContext from "@/context/global.js";

import style from "./ProcInfo.module.css";

function ProcInfo({
	procedure,
}) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const finishDate = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		minute: "numeric",
		hour: "numeric",
	}).format(procedure.finishProcTime);

	return (
		<div
			className={style.topPanel}
		>
			<h2 className={style.procName}>{t(procedure.type.name)}</h2>
			<span>
				{t("finish")}
				:
				{' '}
				<b>{finishDate}</b>
			</span>
		</div>
	);
}

ProcInfo.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
};

export default ProcInfo;