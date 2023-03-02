import { memo } from "react";
import types from "prop-types";

import style from "./Notification.module.css";

const notifStatus = {
	success: "check",
	warning: "exclamation-triangle",
	error: "exclamation-circle",
};

function Notification({ text, status }) {
	const icon = notifStatus[status];

	return (
		<div className={`${style.notification} ${style[status]}`}>
			<i
				className={`fa fa-${icon}`}
				aria-hidden="true"
			/>
			<p>{text}</p>
		</div>
	);
}

Notification.propTypes = {
	text: types.string.isRequired,
	status: types.string.isRequired,
};

export default memo(Notification);
