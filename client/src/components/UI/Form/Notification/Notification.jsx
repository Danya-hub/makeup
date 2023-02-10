import { memo } from "react";
import types from "prop-types";

import style from "./Notification.module.css";

const notifStatus = {
	success: "check",
	warning: "exclamation-triangle",
	error: "exclamation-circle",
};

Notification.propTypes = {
	text: types.string,
	status: types.string,
};
// WebkitTextStroke: obj.color === "white" ? "1px rgb(var(--black))" : "",
function Notification({ text, status }) {
	const icon = notifStatus[status];

	return (
		<div className={`${style.notification} ${style[status]}`}>
			<i
				className={`fa fa-${icon}`}
				aria-hidden="true"
			></i>
			<p>{text}</p>
		</div>
	);
}

export default memo(Notification);
