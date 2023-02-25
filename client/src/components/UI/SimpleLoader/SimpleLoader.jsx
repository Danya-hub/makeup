import { default as LoaderSrc } from "@/assets/gif/loader.gif";

import style from "./SimpleLoader.module.css";

function Loader() {
	return (
		<img
			className={style.loader}
			src={LoaderSrc}
			alt="logo"
		/>
	);
}

export { Loader as default };
