import { useContext, memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";

import DeleteButton from "@/pages/Appointment/components/DeleteButton/DeleteButton.jsx";
import EditButton from "@/pages/Appointment/components/EditButton/EditButton.jsx";

import style from "./Table.module.css";

function Table() {
	const {
		newProcedures,
	} = useSelector((state) => state.userProcedures);
	const {
		currentLang,
	} = useContext(GlobalContext);
	const { t } = useTranslation();

	return (
		<table className={style.table}>
			<tbody>
				<tr>
					<th>
						<span>{t("serviceName")}</span>
					</th>
					<th>
						<span>{t("time")}</span>
					</th>
					<th>
						<span>{t("price")}</span>
					</th>
					<th>
						<span />
					</th>
				</tr>
				{newProcedures.map(([proc, , order], i) => {
					const stringStartTime = FormatDate.stringHourAndMin(proc.startProcTime, currentLang);
					const stringFinishTime = FormatDate.stringHourAndMin(proc.finishProcTime, currentLang);

					return (
						<tr
							key={`${proc.type.name}/${order}`}
						>
							<td className={style.name}>
								<span>{t(proc.type.name)}</span>
							</td>
							<td className={style.time}>
								<span>{`${stringStartTime} - ${stringFinishTime}`}</span>
							</td>
							<td className={style.price}>
								<span>{proc.type.price + proc.type.currency}</span>
							</td>
							<td className={style.buttons}>
								<div>
									<DeleteButton index={i} />
									<EditButton index={i} />
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default memo(Table);
