import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import types from "prop-types";

import LangContext from "@/context/lang.js";
import FormatDate from "@/utils/formatDate.js";

import style from "./Card.module.css";

function Card({ key, id, className, procedure }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [{
		currentLang,
	}] = useContext(LangContext);

	const shortDate = FormatDate.dateStyle(procedure.startProcTime, currentLang);
	const stringStartTime = FormatDate.stringHourAndMin(procedure.startProcTime, currentLang);
	const stringFinishTime = FormatDate.stringHourAndMin(procedure.finishProcTime, currentLang);

	function handleClick() {
		navigate("/details", {
			state: {
				procedure,
			},
		});
	}

	return (
		// event for card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			key={key}
			id={id}
			className={`${style.card} ${className}`}
			onMouseDown={handleClick}
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
							/>
							<span>{t(procedure.state.name)}</span>
						</div>
					</div>
					<button
						type="button"
						className={style.favourite}
					>
						<i
							className="fa fa-heart-o"
							aria-hidden="true"
						/>
					</button>
				</div>
				<div className={style.bottomPanel}>
					<span className={style.price}>
						{procedure.type.price}
						{procedure.type.currency}
					</span>
					<span>
						{shortDate}
						,
						{" "}
						<b>
							{stringStartTime}
							—
							{stringFinishTime}
						</b>
					</span>
				</div>
			</div>
		</div>
	);
}

Card.defaultProps = {
	key: "",
	id: "",
	className: "",
};

Card.propTypes = {
	key: types.string,
	id: types.number,
	className: types.string,
	procedure: types.instanceOf(Object).isRequired,
};

export default memo(Card);
