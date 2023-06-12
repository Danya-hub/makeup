import { useContext } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import routes from "./constants/routes.js";
import cardStyles from "./constants/cardStyles.js";
import UserProceduresContext from "@/pages/UserProcedures/context/userProcedures.js";

import style from "./TopNavigation.module.css";

function TopNavigation({
	position,
	setPosition,
}) {
	const { t } = useTranslation();
	const {
		currentPath,
		setCurrentPath,
	} = useContext(UserProceduresContext);

	function handleSwitchStyle(i) {
		setPosition(cardStyles[i]);
	}

	return (
		<div
			className={style.navigation}
		>
			<ul className={style.list}>
				{routes.map((path) => (
					<li
						key={path}
					>
						<button
							type="button"
							className={`${path === currentPath ? style.active : ""} button`}
							onClick={() => {
								setCurrentPath(path);
							}}
						>
							{t(path)}
						</button>
					</li>
				))}
			</ul>
			<div className={style.visualStyle}>
				{cardStyles.map(([dir, src], i) => (
					<button
						type="button"
						key={dir}
						id={dir}
						title={dir}
						className={dir === position ? style.selectDir : ""}
						onClick={() => handleSwitchStyle(i)}
					>
						<img
							src={src}
							alt={dir}
						/>
					</button>
				))}
			</div>
		</div>
	);
}

TopNavigation.propTypes = {
	position: types.string.isRequired,
	setPosition: types.func.isRequired,
};

export default TopNavigation;