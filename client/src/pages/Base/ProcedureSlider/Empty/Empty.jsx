import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import style from "./Empty.module.css";

function Empty() {
	const { t } = useTranslation();

	return (
		<div
			className={style.empty}
		>
			<i
				className="fa fa-file-image-o"
				aria-hidden="true"
			/>
			<p>{t("bestWorksNotAdded")}</p>
			<Link
				to="/appointment"
				className="button border"
			>
				{t("book")}
			</Link>
		</div>
	);
}

export default Empty;