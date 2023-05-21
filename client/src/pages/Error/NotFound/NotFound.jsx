import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import style from "./NotFound.module.css";

function NotFound() {
	const { t } = useTranslation();

	return (
		<section id={style.notFound}>
			<Helmet>
				<title>{t("notFoundTitle")}</title>
			</Helmet>
			<h1>404</h1>
			<h3>{t("notFoundPageTitle")}</h3>
			<p>{t("notFoundPageText")}</p>
			<Link
				to="/"
				className="button border"
			>
				{t("toMain")}
			</Link>
		</section>
	);
}

export default NotFound;
