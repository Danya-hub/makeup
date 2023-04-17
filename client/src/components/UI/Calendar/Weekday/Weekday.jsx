import { memo } from "react";
import { useTranslation } from "react-i18next";

import style from "./Weekday.module.css";

function Weekday() {
	const { t } = useTranslation();

	return (
		<tr className={style.weekdays}>
			{t("weekdayNames", {
				returnObjects: true,
			}).map((name) => (
				<th key={name}>
					<span>{name}</span>
				</th>
			))}
		</tr>
	);
}

export default memo(Weekday);
