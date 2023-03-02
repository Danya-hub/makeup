import { memo } from "react";
import { Link } from "react-router-dom";

import LogoSrc from "@/assets/image/logo.svg";

import style from "./Logo.module.css";

function Logo() {
	return (
		<Link to="/">
			<img
				className={style.logo}
				src={LogoSrc}
				alt="logo"
			/>
		</Link>
	);
}

export default memo(Logo);
