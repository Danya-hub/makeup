import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import EditSvg from "@/assets/image/edit.svg";
import TrashSvg from "@/assets/image/trash.svg";

import style from "./List.module.css";

List.propTypes = {
	procedures: types.array,
	onEdit: types.func,
	onDelete: types.func,
};

function List({ procedures, onEdit, onDelete }) {
	const { currLng } = useSelector((state) => state.langs);

	const buttons = [
		{
			name: "edit",
			src: EditSvg,
			action() {
				onEdit(...arguments);
			},
		},
		{
			name: "trash",
			src: TrashSvg,
			action() {
				onDelete(...arguments);
			},
		},
	];

	return (
		<div>
			{procedures.map(([proc], i) => {
				const stringStartTime = FormatDate.stringHourAndMin(proc.startProcTime, currLng),
					stringFinishTime = FormatDate.stringHourAndMin(proc.finishProcTime, currLng);

				return (
					<div
						key={`${i}/proc`}
						className={style.proc}
					>
						<div className={style.column}>
							<h3>{proc.type.name}</h3>
							<span>
								{stringStartTime} - {stringFinishTime}
							</span>
							<h3>{proc.type.price}</h3>
						</div>
						<div className={style.buttons}>
							{buttons.map((btn, j) => (
								<button
									key={`${j}/btn`}
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

export { List as default };
