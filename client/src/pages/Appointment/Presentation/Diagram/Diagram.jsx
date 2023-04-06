import { useSelector } from "react-redux";
import types from "prop-types";

import style from "./Diagram.module.css";

function Diagram({
	hourHeightInPx,
	formatedTimes,
	widthCharTime,
}) {
	const { userProcedures } = useSelector((state) => state);

	return (
		<div className={style.hours}>
			{formatedTimes.map((hour, i, arr) => (
				<div
					key={hour}
					className={style.cell}
					style={{
						height: hourHeightInPx,
						width: widthCharTime,
					}}
				>
					<div
						className={style.line}
						style={{
							top: `${userProcedures.hourHeightInPx * i}px`,
						}}
					>
						<span
							style={{
								visibility: i === 0 || i === arr.length ? "hidden" : "",
							}}
						>
							{hour}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

Diagram.propTypes = {
	hourHeightInPx: types.number.isRequired,
	formatedTimes: types.instanceOf(Array).isRequired,
	widthCharTime: types.number.isRequired,
};

export default Diagram;
