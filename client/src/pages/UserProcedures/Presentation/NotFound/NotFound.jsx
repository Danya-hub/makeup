import { memo } from "react";

function NotFound() {
	return (
		<div id={"notFound"}>
			<p>Процедур не была найдено</p>
			<span>?</span>
		</div>
	);
}

export default memo(NotFound);
