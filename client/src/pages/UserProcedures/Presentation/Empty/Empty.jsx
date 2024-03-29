import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import style from "./Empty.module.css";

function Empty() {
	const { t } = useTranslation();

	return (
		<div id={style.emptyProc}>
			<p>{t("procEmpty")}</p>
			<Link
				className="button border"
				to="/appointment"
				state={{
					isVisiblePopup: true,
				}}
			>
				{
					t("book", {
						returnObjects: true,
					})
				}
			</Link>
		</div>
	);
}

export default memo(Empty);
