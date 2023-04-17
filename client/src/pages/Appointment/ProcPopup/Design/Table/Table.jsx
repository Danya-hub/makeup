import { useContext } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import LangContext from "@/context/lang.js";
import FormatDate from "@/utils/formatDate.js";

import EditSvg from "@/assets/image/edit.svg";
import TrashSvg from "@/assets/image/trash.svg";

import style from "./Table.module.css";

function Table({ procedures, onEdit, onDelete }) {
	const [{
		currentLang,
	}] = useContext(LangContext);
	const { t } = useTranslation();

	const buttons = [
		{
			name: "edit",
			src: EditSvg,
			action: onEdit,
		},
		{
			name: "delete",
			src: TrashSvg,
			action: onDelete,
		},
	];

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
				{procedures.map(([proc, , order], i) => {
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
									{buttons.map((btn) => (
										<button
											title={t(btn.name)}
											key={btn.name}
											type="button"
											className="button"
											onClick={() => btn.action(i, proc)}
										>
											<img
												src={btn.src}
												alt={btn.name}
											/>
										</button>
									))}
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

Table.propTypes = {
	procedures: types.instanceOf(Array).isRequired,
	onEdit: types.func.isRequired,
	onDelete: types.func.isRequired,
};

export default Table;
