import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";

import style from "./Card.module.css";
import { useNavigate } from "react-router-dom";

Card.propTypes = {
	id: types.number,
	className: types.string,
	procedure: types.object,
	styleAttr: types.object,
};

function Card({ id = "", className = "", procedure, ...props }) {
	const { currLng } = useSelector((state) => state.langs);
	const { t } = useTranslation();
	const navigate = useNavigate();

	const shortDate = FormatDate.dateStyle(procedure.startProcTime, currLng);
	const stringStartTime = FormatDate.stringHourAndMin(procedure.startProcTime, currLng),
		stringFinishTime = FormatDate.stringHourAndMin(procedure.finishProcTime, currLng);

	function handleClick() {
		navigate("/details", {
			state: {
				procedure,
			},
		});
	}

	return (
		<div
			{...props}
			id={id}
			className={`${style.card} ${className}`}
			onClick={handleClick}
		>
			<img
				src=""
				alt="procedure"
				className={style.procImage}
			/>
			<div className={style.content}>
				<div className={style.topPanel}>
					<div>
						<p className={style.name}>{procedure.type.name}</p>
						<div className={style.state}>
							<i
								className="fa fa-bookmark color"
								aria-hidden="true"
								style={{
									WebkitTextStroke:
										procedure.state.color === "white" ? "1px rgb(var(--black))" : "",
									color: `rgb(var(--${procedure.state.color}))`,
								}}
							></i>
							<span>{t(procedure.state.name)}</span>
						</div>
					</div>
					<button className={style.favourite}>
						<i
							className="fa fa-heart-o"
							aria-hidden="true"
						></i>
					</button>
				</div>
				<div className={style.bottomPanel}>
					<span className={style.price}>
						{procedure.type.price}
						{procedure.type.currency}
					</span>
					<span>
						{shortDate},{" "}
						<b>
							{stringStartTime}—{stringFinishTime}
						</b>
					</span>
				</div>
			</div>
		</div>
	);
}

export default memo(Card);
