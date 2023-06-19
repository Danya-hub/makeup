import { useCallback } from "react";
import types from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Image from "./Image/Image.jsx";
import Content from "./Content/Content.jsx";
import OptionButton from "@/pages/ProcDetails/components/OptionButton/OptionButton.jsx";
import { asyncActions } from "@/service/redusers/appointments.js";

import style from "./BaseInfo.module.css";

function BaseInfo({
	procedure,
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);

	async function handleFavorite() {
		await dispatch(asyncActions.updateProc([{
			...procedure,
			favorite: procedure.favorite ? 0 : 1,
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
						title={t("toFavorites")}
						onClick={handleFavorite}
					>
						<i
							className={procedure.favorite ? "fa fa-heart" : "fa fa-heart-o"}
							aria-hidden="true"
						/>
					</button>
					{userInfo.id === procedure.user.id && (
						<OptionButton
							render={optionsRender}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

BaseInfo.defaultProps = {
	procedure: null,
};

BaseInfo.propTypes = {
	procedure: types.instanceOf(Object),
};

export default BaseInfo;