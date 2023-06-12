import { useContext, memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
	const { favoriteProcedurs } = useSelector((state) => state.userProcedures);

	return (
		<header>
			<CommMethods />
			<nav>
				<ul>
					<li>
						<Link
							to="/"
							state={{
								section: "bestWorks",
							}}
						>
							{t("bestWorks")}
						</Link>
					</li>
					<li>
						<Link
							to="/"
							state={{
								section: "myServices",
							}}
						>
							{t("myServices")}
						</Link>
					</li>
				</ul>
			</nav>
			<Logo />
			<nav>
				<Lang />
				<ul>
					<li>
						{!isAuth && (
							<Link
								to="/signin"
							>
								{t("signIn")}
							</Link>
						)}
					</li>
					<li>
						<Link
							to="/appointment"
						>
							{t("calendar")}
						</Link>
					</li>
				</ul>
			</nav>
			{isAuth && (
				<nav>
					<Link
						to="/appointment/me"
						state={{
							path: "myFavorites",
						}}
						id={style.favorites}
						title={t("myFavorites")}
					>
						<i
							className="fa fa-heart-o"
							aria-hidden="true"
						>
							<span>{favoriteProcedurs.length}</span>
						</i>
					</Link>
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
				</nav>
			)}
		</header>
	);
}

export default memo(Header);
