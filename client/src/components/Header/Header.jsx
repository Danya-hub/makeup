import { useContext, memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Logo from "@/components/UI/Logo/Logo.jsx";
import Lang from "@/components/UI/Lang/Lang.jsx";
import CommMethods from "@/components/UI/CommMethods/CommMethods.jsx";
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
			<CommMethods />
			<nav>
				<ul>
					<li>
						<Link
							to="/bestWorks"
						>
							{t("bestWorks")}
						</Link>
					</li>
					<li>
						<Link
							to="/myServices"
						>
							{t("myServices")}
						</Link>
					</li>
				</ul>
			</nav>
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
					to="/appointment"
				>
					{t("calendar")}
				</Link>
			</nav>
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
		</header>
	);
}

export default memo(Header);
