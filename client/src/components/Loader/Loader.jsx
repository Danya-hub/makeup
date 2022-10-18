import { default as LoaderSrc } from "@/assets/gif/loader.gif";

import style from "./Loader.module.css";

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
