import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Logo from "@/components/UI/Logo/Logo.jsx";
import Lang from "@/components/UI/Lang/Lang.jsx";
import UserSrc from "@/assets/image/user.svg";

import GlobalContext from "@/context/global.js";

import style from "./Header.module.css";

function Header() {
	const { t } = useTranslation();
	const {
		isAuth,
		setOpenCabinet,
	} = useContext(GlobalContext);

	return (
		<header>
			<Logo />
			<nav>
				<Lang />
				{!isAuth && (
					<Link
						className="button"
						to="/signin"
					>
						{t("signIn")}
					</Link>
				)}
				<Link
					className="button uppercase"
					to="/appointment"
				>
					{t("calendar")}
				</Link>
				{isAuth && (
					<button
						type="button"
						id={style.userInfo}
						className="button"
						onClick={() => {
							setOpenCabinet(true);
						}}
					>
						<img
							src={UserSrc}
							alt="user"
						/>
					</button>
				)}
			</nav>
		</header>
	);
}

export default Header;
