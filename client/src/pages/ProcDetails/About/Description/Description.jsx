import types from "prop-types";
import { useTranslation } from "react-i18next";

import Items from "@/pages/ProcDetails/Reviews/Items/Items.jsx";

import style from "./Description.module.css";

function Description({
	procedure,
	reviews,
}) {
	const { t } = useTranslation();

	return (
		<div id={style.description}>
			<div
				className={style.paragraph}
			>
				<h2>{t("description")}</h2>
				{/* eslint-disable-next-line react/no-danger */}
				<div dangerouslySetInnerHTML={{
					__html: t(procedure.type.description),
				}}
				/>
			</div>
			<div>
				<h2>{t("reviews")}</h2>
				<Items
					reviews={reviews}
				/>
			</div>
		</div>
	);
}

Description.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
	reviews: types.instanceOf(Array).isRequired,
};

export default Description;