import { memo } from "react";

function Offline() {
	return <p>Нет подключения к Интернету</p>;
}

export default memo(Offline);
