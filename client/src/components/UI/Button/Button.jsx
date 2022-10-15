import { memo, useState } from "react";
import types from "prop-types";

import style from "./Button.module.css";

Button.propTypes = {
	id: types.string,
	value: types.string,
	timeout: types.number,
};

function Button({ id = "", value, timeout = 0, ...props }) {
	let timer = null;
	const [dotStyle, setDotStyle] = useState({});

	function handleClick(e) {
		if (!timeout) {
			return;
		}

		clearTimeout(timer);

		const dotSize = Math.max(e.target.offsetWidth, e.target.offsetHeight);
		const left = e.nativeEvent.offsetX,
			top = e.nativeEvent.offsetY;

		setDotStyle({
			animation: `${style.fadeAnimation} ${timeout}s linear`,
			left: `${left}px`,
			top: `${top}px`,
			width: `${dotSize}px`,
			height: `${dotSize}px`,
		});

		timer = setTimeout(() => {
			setDotStyle((prev) => ({
				...prev,
				animation: "",
			}));
		}, timeout * 1000);
	}

	return (
		<button
			{...props}
			id={id}
			className={style.button}
			onClick={handleClick}
		>
			{value}
			<span
				className={style.dot}
				style={dotStyle}
			></span>
		</button>
	);
}

export default memo(Button);
