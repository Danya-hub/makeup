import React from "react";
import types from "prop-types";

import style from "./PlaceholderLoader.module.css";

function BackgroundLoader({ widthInPx = "0px" }) {
	return (
		<div
			className={style.background}
			style={{
				"--w": widthInPx,
			}}
		/>
	);
}

BackgroundLoader.propTypes = {
	widthInPx: types.string.isRequired,
};

export default BackgroundLoader;
