import types from "prop-types";

import style from "./SideHours.module.css";

SideHours.propTypes = {
	numericHoursFromDay: types.array,
	hourHeightInPx: types.number,
	widthCharTime: types.number,
};

function SideHours({ numericHoursFromDay, hourHeightInPx, widthCharTime }) {
	return (
		<div className={style.hours}>
			{numericHoursFromDay.map((hour, i, arr) => (
				<div
					className={style.cell}
					key={hour + "/" + i}
					style={{
						height: hourHeightInPx,
						width: `${widthCharTime}px`,
					}}
				>
					<span
						style={{
							visibility: i === 0 || i === arr.length - 1 ? "hidden" : "",
						}}
					>
						{hour}
					</span>
				</div>
			))}
		</div>
	);
}

export { SideHours as default };
