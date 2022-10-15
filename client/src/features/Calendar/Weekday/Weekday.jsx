import { memo } from "react";
import { useTranslation } from "react-i18next";

import style from "./Weekday.module.css";

export default memo(function Weekday() {
	const { t } = useTranslation();

	return (
		<tr className={style.weekdays}>
			{t("weekdayNames", {
				returnObjects: true,
			}).map((name, i) => (
				<th key={name + "/" + i}>
					<span>{name}</span>
				</th>
			))}
		</tr>
	);
});
