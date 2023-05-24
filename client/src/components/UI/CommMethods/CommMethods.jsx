import { memo } from "react";

import WorkerConfig from "@/config/worker.js";

import style from "./CommMethods.module.css";

function CommMethods() {
	return (
		<div id={style.commMethods}>
			<ul className={style.telephones}>
				{WorkerConfig.communicationMethods.map(([icon, url, text]) => (
					<li key={text}>
						<a href={url}>
							<i className={`fa fa-${icon} ${style.icon}`} aria-hidden="true" />
							<span className={style.workerName}>{text}</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default memo(CommMethods);