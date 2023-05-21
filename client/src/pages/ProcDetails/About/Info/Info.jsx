import types from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Image from "./Image/Image.jsx";
import Content from "./Content/Content.jsx";
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

	return (
		<div id={style.info}>
			<Image />
			<div className={style.wrapper}>
				<Content
					procedure={procedure}
				/>
				<div>
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