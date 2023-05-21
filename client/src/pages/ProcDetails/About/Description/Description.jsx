import types from "prop-types";
import { useTranslation } from "react-i18next";

import style from "./Description.module.css";

function Description({
	procedure,
}) {
	const { t } = useTranslation();

	return (
		<div id={style.description}>
			<h2>Описание</h2>
			{/* eslint-disable-next-line react/no-danger */}
			<div dangerouslySetInnerHTML={{
				__html: t(procedure.type.description),
			}}
			/>
		</div>
	);
}

Description.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
};

export default Description;