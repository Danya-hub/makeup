import React from "react";
import types from "prop-types";

import style from "./PlaceholderLoader.module.css";

function PlaceholderLoader({ width = "0px" }) {
	return (
		<div
			className={style.background}
			style={{
				"--w": width,
			}}
		/>
	);
}

PlaceholderLoader.propTypes = {
	width: types.string.isRequired,
};

export default PlaceholderLoader;
