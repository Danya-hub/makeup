import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";

import style from "./Card.module.css";

Card.propTypes = {
	id: types.string,
	procedure: types.object,
	styleAttr: types.object,
};

function Card({ id = "", procedure, styleAttr = {}, ...props }) {
	const { currLng } = useSelector((state) => state.langs);
	const { t } = useTranslation();

	const stringStartTime = FormatDate.stringHourAndMin(procedure.startProcTime, currLng),
		stringFinishTime = FormatDate.stringHourAndMin(procedure.finishProcTime, currLng);

	return (
		<div
			{...props}
			id={id}
			className={style.card}
			style={{
				...styleAttr,
				background: `rgb(var(--${procedure.state.color}))`,
			}}
		>
			<div className="time">
				<span>
					{stringStartTime}—{stringFinishTime}
				</span>
				<span>{procedure.fnClient}</span>
			</div>
			<span className="status">{t(procedure.state.name)}</span>
			<p className="procedureName">{procedure.type.name}</p>
		</div>
	);
}

export { Card as default };
