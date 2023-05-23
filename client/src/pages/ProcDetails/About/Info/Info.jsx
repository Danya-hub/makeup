import { useCallback } from "react";
import types from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Image from "./Image/Image.jsx";
import Content from "./Content/Content.jsx";
import OptionButton from "@/pages/ProcDetails/components/OptionButton/OptionButton.jsx";
import { asyncActions } from "@/service/redusers/userProcedures.js";

import style from "./Info.module.css";

function Info({
	procedure,
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	async function handleFavourite() {
		await dispatch(asyncActions.updateProc([{
			...procedure,
			favourite: procedure.favourite ? 0 : 1,
		}, false]));
	}

	const optionsRender = useCallback(() => [
		<a href={procedure.contract}>{t("saveContract")}</a>,
	], []);

	return (
		<div id={style.info}>
			<Image />
			<div className={style.wrapper}>
				<Content
					procedure={procedure}
				/>
				<div className={style.buttons}>
					<button
						type="button"
						className={`button ${style.heart}`}
						title={t("toFavourites")}
						onClick={handleFavourite}
					>
						<i
							className={procedure.favourite ? "fa fa-heart" : "fa fa-heart-o"}
							aria-hidden="true"
						/>
					</button>
					<OptionButton
						render={optionsRender}
					/>
				</div>
			</div>
		</div>
	);
}

Info.defaultProps = {
	procedure: null,
};

Info.propTypes = {
	procedure: types.instanceOf(Object),
};

export default Info;