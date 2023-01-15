import { memo } from "react";
import { Link } from "react-router-dom";

import style from "./EmptyProc.module.css";

function EmptyProc() {
	return (
		<div id={style.emptyProc}>
			<p>Вы не записывались на процедуры</p>
			<Link
				className="button border"
				to="/appointment"
				state={{
					isVisiblePopup: true,
				}}
			>
				Записаться
			</Link>
		</div>
	);
}

export default memo(EmptyProc);
