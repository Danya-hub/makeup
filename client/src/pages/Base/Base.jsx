import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function Base() {
	const { t } = useTranslation();

	return (
		<section>
			<Helmet>
				<title>{t("mainTitle")}</title>
			</Helmet>
			<span>Main</span>
		</section>
	);
}

export default Base;
