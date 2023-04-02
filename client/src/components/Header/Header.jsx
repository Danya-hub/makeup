import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import Logo from "@/components/UI/Logo/Logo.jsx";
import Lang from "@/components/UI/Lang/Lang.jsx";
import UserSrc from "@/assets/image/user.svg";

import style from "./Header.module.css";

function Header({ openCabinetState }) {
	const { t } = useTranslation();

	const [, setOpenCabinet] = openCabinetState;
	const isAuth = localStorage.getItem("token");

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

Header.propTypes = {
	openCabinetState: types.instanceOf(Array).isRequired,
};

export default Header;
