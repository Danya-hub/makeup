import { memo, useState } from "react";
import types from "prop-types";

import style from "./AnimButton.module.css";

AnimButton.propTypes = {
	id: types.string,
	value: types.string,
	timeout: types.number,
	children: types.object,
};

//?
function AnimButton({ id = "", timeout = 0, ...props }) {
	const [animationStyle, setAnimStyle] = useState({});
	let timer = null;

	function handleClick(e) {
		clearTimeout(timer);

		const dotSize = Math.max(e.target.offsetWidth, e.target.offsetHeight);
		const left = e.nativeEvent.offsetX,
			top = e.nativeEvent.offsetY;

		const styles = {
			animation: `${style.fadeAnimation} ${timeout / 1000}s linear`,
			left: `${left}px`,
			top: `${top}px`,
			width: `${dotSize}px`,
			height: `${dotSize}px`,
		};

		setAnimStyle(styles);

		timer = setTimeout(() => {
			setAnimStyle({});
		}, timeout);
	}

	return (
		<button
			{...props}
			id={id}
			className={style.button}
			onClick={handleClick}
		>
			{props.children}
			<span
				className={style.dot}
				style={animationStyle}
			></span>
		</button>
	);
}

export default memo(AnimButton);
