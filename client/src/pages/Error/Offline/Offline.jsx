import { memo } from "react";
import { useTranslation } from "react-i18next";

function Offline() {
	const { t } = useTranslation();

	return <p>{t("noInternet")}</p>;
}

export default memo(Offline);
