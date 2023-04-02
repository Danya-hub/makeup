import { useContext } from "react";
import types from "prop-types";

import LangContext from "@/context/lang.js";
import FormatDate from "@/utils/formatDate.js";

import EditSvg from "@/assets/image/edit.svg";
import TrashSvg from "@/assets/image/trash.svg";

import style from "./List.module.css";

function List({ procedures, onEdit, onDelete }) {
	const [{
		currentLang,
	}] = useContext(LangContext);
	const buttons = [
		{
			name: "edit",
			src: EditSvg,
			action: onEdit,
		},
		{
			name: "trash",
			src: TrashSvg,
			action: onDelete,
		},
	];

	return (
		<div>
			{procedures.map(([proc, , order], i) => {
				const stringStartTime = FormatDate.stringHourAndMin(proc.startProcTime, currentLang);
				const stringFinishTime = FormatDate.stringHourAndMin(proc.finishProcTime, currentLang);

				return (
					<div
						key={`${proc.type.name}/${order}`}
						className={style.proc}
					>
						<div className={style.column}>
							<h3>{proc.type.name}</h3>
							<span>{`${stringStartTime} - ${stringFinishTime}`}</span>
							<h3>{proc.type.price}</h3>
						</div>
						<div className={style.buttons}>
							{buttons.map((btn) => (
								<button
									title={btn.name}
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
					</div>
				);
			})}
		</div>
	);
}

List.propTypes = {
	procedures: types.instanceOf(Array).isRequired,
	onEdit: types.func.isRequired,
	onDelete: types.func.isRequired,
};

export default List;
