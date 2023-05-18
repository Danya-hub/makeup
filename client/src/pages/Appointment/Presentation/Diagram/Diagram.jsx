import { memo } from "react";
import types from "prop-types";

import style from "./Diagram.module.css";

function Diagram({
	formatedTimes,
	widthCharTime,
}) {
	return (
		<div className={style.hours}>
			{formatedTimes.map((hour, i, arr) => (
				<div
					key={hour}
					className={style.cell}
					style={{
						height: 60,
						width: widthCharTime,
					}}
				>
					<div
						className={style.line}
						style={{
							top: `${60 * i}px`,
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
	formatedTimes: types.instanceOf(Array).isRequired,
	widthCharTime: types.number.isRequired,
};

export default memo(Diagram);
