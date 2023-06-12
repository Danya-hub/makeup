import { Link } from "react-router-dom";
import types from "prop-types";
import { useTranslation } from "react-i18next";

import routes from "./constants/routes.js";

import style from "./TopNavigation.module.css";

function TopNavigation({
	procedure,
}) {
	const { t } = useTranslation();

	return (
		<nav className={style.navigation}>
			<ul className={style.list}>
				{routes.map((route) => {
					const path = route.path(procedure);

					return (
						<li
							key={path}
						>
							<Link
								to={path}
								className={`${path === window.location.pathname ? style.active : ""} button`}
							>
								{t(route.text)}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

TopNavigation.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
};

export default TopNavigation;