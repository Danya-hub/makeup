import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import EditSvg from "@/assets/image/edit.svg";
import TrashSvg from "@/assets/image/trash.svg";

import style from "./List.module.css";

function List({ procedures, onEdit, onDelete }) {
	const { currLng } = useSelector((state) => state.langs);

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
			{procedures.map(([proc], i) => {
				const stringStartTime = FormatDate.stringHourAndMin(proc.startProcTime, currLng);
				const stringFinishTime = FormatDate.stringHourAndMin(proc.finishProcTime, currLng);

				return (
					<div
						key={proc.type.name}
						className={style.proc}
					>
						<div className={style.column}>
							<h3>{proc.type.name}</h3>
							<span>
								{stringStartTime}
								{" "}
								-
								{" "}
								{stringFinishTime}
							</span>
							<h3>{proc.type.price}</h3>
						</div>
						<div className={style.buttons}>
							{buttons.map((btn) => (
								<button
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
