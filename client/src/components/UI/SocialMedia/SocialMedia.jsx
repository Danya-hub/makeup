import { memo } from "react";

import WorkerConfig from "@/config/worker.js";

import style from "./SocialMedia.module.css";

function SocialMedia() {
	return (
		<ul className={style.socialMedia}>
			{WorkerConfig.socialMedia.map(([mediaName, url, workerName]) => (
				<li key={mediaName}>
					<a href={url}>
						<i className={`fa fa-${mediaName} ${style.icon}`} aria-hidden="true" />
						<span className={style.workerName}>{workerName}</span>
					</a>
				</li>
			))}
		</ul>
	);
}

export default memo(SocialMedia);