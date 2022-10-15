import { memo } from "react";
import { Link } from "react-router-dom";

import { default as LogoSrc } from "@/assets/image/logo.svg";

import style from "./Logo.module.css";

export default memo(function Logo() {
	return (
		<Link to="/">
			<img
				className={style.logo}
				src={LogoSrc}
				alt="logo"
			/>
		</Link>
	);
});
