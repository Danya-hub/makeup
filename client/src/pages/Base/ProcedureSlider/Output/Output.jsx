import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";

import style from "./Output.module.css";

function Output({
	procedures,
}) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const [procIndex, setProcIndex] = useState(0);

	const finishDate = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		minute: "numeric",
		hour: "numeric",
	}).format(procedures[procIndex].finishProcTime);

	function handlePrev() {
		setProcIndex((i) => (i - 1 < 0 ? procedures.length - 1 : i - 1));
	}

	function handleNext() {
		setProcIndex((i) => (i + 1 > procedures.length - 1 ? 0 : i + 1));
	}

	return (
		<div>
			<div
				key={procedures[procIndex].id}
				id={procedures[procIndex].id}
				className={style.card}
			>
				<div
					className={style.content}
				>
					<button
						type="button"
						className="button"
						id={style.left}
						onClick={handlePrev}
					>
						<img
							src={LeftArrowSrc}
							alt="leftArrow"
						/>
					</button>
					<div className={style.wrapper}>
						<h2>{t(procedures[procIndex].type.name)}</h2>
						<div
							className={style.description}
							/* eslint-disable-next-line react/no-danger */
							dangerouslySetInnerHTML={{
								__html: t(procedures[procIndex].type.description),
							}}
						/>
						<div className={style.row}>
							<span className={style.price}>
								{procedures[procIndex].type.price}
								{procedures[procIndex].type.currency}
							</span>
							<span>
								{t("dateCompletion")}
								:
								{' '}
								<b className={style.finishDate}>{finishDate}</b>
							</span>
						</div>
						<div
							className={style.buttons}
						>
							<Link
								className={`${style.book} button border`}
								to={`/appointment?type=${procedures[procIndex].type.id}&action=make`}
							>
								{t("book")}
							</Link>
							<Link
								id={style.more}
								className="button border"
								to={`/details/${procedures[procIndex].id}`}
							>
								{t("more")}
							</Link>
						</div>
					</div>
					<button
						type="button"
						id={style.right}
						className="button"
						onClick={handleNext}
					>
						<img
							src={RightArrowSrc}
							alt="rightArrow"
						/>
					</button>
				</div>
				<div className={style.procImage}>
					<img
						src=""
						alt={t("noPhotos")}
					/>
				</div>
			</div>
		</div>
	);
}

Output.propTypes = {
	procedures: types.instanceOf(Array).isRequired,
};

export default Output;