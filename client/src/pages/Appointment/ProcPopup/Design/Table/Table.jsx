import { useContext, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";
import { actions } from "@/service/redusers/appointments.js";

import DeleteButton from "@/components/UI/Form/DeleteButton/DeleteButton.jsx";
import EditButton from "@/components/UI/Form/EditButton/EditButton.jsx";

import style from "./Table.module.css";

function Table() {
	const dispatch = useDispatch();
	const {
		newProcedures,
	} = useSelector((state) => state.appointments);
	const {
		setVisiblePopup,
		currentLang,
		setPopup,
	} = useContext(GlobalContext);
	const { t } = useTranslation();

	return (
		<div className={style.table}>
			<table>
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
										<DeleteButton
											index={i}
											onClick={(index) => {
												dispatch(actions.deleteProc(index));

												if (newProcedures.length - 1 === 0) {
													setPopup(["make", null]);
												}
											}}
										/>
										<EditButton
											index={i}
											onClick={(index) => {
												dispatch(actions.switchCurrentProc(index));
												setVisiblePopup(true);
												setPopup(["edit", null]);
											}}
										/>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default memo(Table);
