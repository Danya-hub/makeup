import { memo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import types from "prop-types";

import { asyncActions } from "@/service/redusers/userProcedures.js";
import GlobalContext from "@/context/global.js";
import { states } from "@/config/procedures.js";

import style from "./Card.module.css";

function Card({ key, id, className, procedure }) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);
	const dispatch = useDispatch();

	const shortDate = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
	}).format(procedure.startProcTime);
	const stringStartTime = Intl.DateTimeFormat(currentLang, {
		minute: "numeric",
		hour: "numeric",
	}).format(procedure.startProcTime);
	const stringFinishTime = Intl.DateTimeFormat(currentLang, {
		minute: "numeric",
		hour: "numeric",
	}).format(procedure.startProcTime);

	async function handleFavourite() {
		await dispatch(asyncActions.updateProc([{
			...procedure,
			favourite: procedure.favourite ? 0 : 1,
		}, false]));
	}

	return (
		// event for card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			key={key}
			id={id}
			className={`${style.card} ${className}`}
		>
			<img
				src=""
				alt={t("noPhotos")}
				className={style.procImage}
			/>
			<div className={style.content}>
				<div className={style.topPanel}>
					<div>
						<h2 className={style.name}>{t(procedure.type.name)}</h2>
						<div className={style.state}>
							<i
								className="fa fa-bookmark color"
								aria-hidden="true"
								style={{
									color: `rgb(var(--${states[procedure.state].color}))`,
								}}
							/>
							<span>{t(procedure.state)}</span>
						</div>
					</div>
					<button
						type="button"
						className="favourite"
						onClick={handleFavourite}
					>
						<i
							className={procedure.favourite ? "fa fa-heart" : "fa fa-heart-o"}
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
				<Link
					id={style.more}
					className="button border"
					to={`/details/${procedure.id}`}
				>
					{t("more")}
				</Link>
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
