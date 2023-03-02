import types from "prop-types";

import style from "./SideHours.module.css";

function SideHours({ numericHoursFromDay, hourHeightInPx, widthCharTime }) {
	return (
		<div className={style.hours}>
			{numericHoursFromDay.map((hour, i, arr) => (
				<div
					className={style.cell}
					key={hour}
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

SideHours.propTypes = {
	numericHoursFromDay: types.instanceOf(Array).isRequired,
	hourHeightInPx: types.number.isRequired,
	widthCharTime: types.number.isRequired,
};

export default SideHours;
