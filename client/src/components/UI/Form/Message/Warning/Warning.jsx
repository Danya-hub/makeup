import { memo } from "react";
import types from "prop-types";

import style from "./Warning.module.css";

Warning.propTypes = {
	text: types.string,
};

function Warning({ text }) {
	return (
		<div className={style.warning}>
			<i
				className="fa fa-exclamation-circle"
				aria-hidden="true"
			></i>
			<p>{text}</p>
		</div>
	);
}

export default memo(Warning);
