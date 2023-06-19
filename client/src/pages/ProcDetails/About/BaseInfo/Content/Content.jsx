import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import { states } from "@/config/procedures.js";

import style from "./Content.module.css";

const COUNT_STARS = 5;

function Content({
	procedure,
}) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const startDate = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		minute: "numeric",
		hour: "numeric",
	}).format(procedure.startProcTime);
	const finishDate = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		minute: "numeric",
		hour: "numeric",
	}).format(procedure.finishProcTime);

	return (
		<div className={style.content}>
			<h2>{t(procedure.type.name)}</h2>
			<div
				title={procedure.stars}
			>
				{[...Array(COUNT_STARS)].map((_, i) => (
					<i
						// eslint-disable-next-line react/no-array-index-key
						key={`${i}/star`}
						className={i >= procedure.stars ? "fa fa-star-o" : "fa fa-star"}
						aria-hidden="true"
					/>
				))}
			</div>
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
			<b className={style.price}>
				{procedure.type.price}
				{procedure.type.currency}
			</b>
			<div className={style.time}>
				<span>
					{t("start")}
					:
					{' '}
					<b>{startDate}</b>
				</span>
				<span>
					{t("finish")}
					:
					{' '}
					<b>{finishDate}</b>
				</span>
			</div>
			{procedure.instagram !== "null" && (
				<p id={style.instagram}>
					Instagram:
					{' '}
					<a href={procedure.instagram}>{procedure.instagram}</a>
				</p>
			)}
			<Link
				to={`/details/reviews/${procedure.id}`}
				className={`${style.buttons} button border`}
			>
				{t("writeReviewButton")}
			</Link>
		</div>
	);
}

Content.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
};

export default Content;