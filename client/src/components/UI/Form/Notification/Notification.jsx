import { memo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import style from "./Notification.module.css";

const notifStatus = {
	success: "check",
	warning: "exclamation-triangle",
	error: "exclamation-circle",
};

function Notification({ content, status }) {
	const { t } = useTranslation();

	const icon = notifStatus[status];

	return (
		<div className={`${style.notification} ${style[status]}`}>
			<i
				className={`fa fa-${icon}`}
				aria-hidden="true"
			/>
			<p>{t(content.key, content.args)}</p>
		</div>
	);
}

Notification.propTypes = {
	content: types.instanceOf(Object).isRequired,
	status: types.string.isRequired,
};

export default memo(Notification);
