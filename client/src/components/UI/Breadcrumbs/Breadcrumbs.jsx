import types from "prop-types";
import { useTranslation } from "react-i18next";

import style from "./Breadcrumbs.module.css";

function Breadcrumbs({
	current,
	onClick,
	paths,
}) {
	const { t } = useTranslation();

	return (
		<div className={style.breadcrumbs}>
			{paths.map((item) => (
				<button
					id={item.path === current ? style.selected : ""}
					type="button"
					key={item.name}
					onClick={() => onClick(item)}
				>
					{t(item.name)}
				</button>
			))}
		</div>
	);
}

Breadcrumbs.propTypes = {
	onClick: types.func.isRequired,
	current: types.string.isRequired,
	paths: types.instanceOf(Array).isRequired,
};

export default Breadcrumbs;