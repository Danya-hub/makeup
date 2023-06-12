import { useTranslation } from "react-i18next";

import style from "./Empty.module.css";

function Empty() {
	const { t } = useTranslation();

	return (
		<div
			className={style.empty}
		>
			<i className="fa fa-comment-o" aria-hidden="true" />
			<p>{t("noReviewsYet")}</p>
		</div>
	);
}

export default Empty;