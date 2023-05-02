import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Table from "./Table/Table.jsx";
import Total from "./Total/Total.jsx";

import { asyncActions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import GlobalContext from "@/context/global.js";

import style from "./Design.module.css";

function DesignProc() {
	const {
		isVisiblePopup,
		setVisiblePopup,
		setPopupName,
	} = useContext(GlobalContext);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		newProcedures,
	} = useSelector((state) => state.userProcedures);

	function handleSubmitForm(e) {
		e.preventDefault();

		dispatch(asyncActions.createNewProcedures(newProcedures));
	}

	return (
		<Popup
			id={style.designProc}
			onClose={() => setPopupName("make")}
			isSimple={false}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<form onSubmit={handleSubmitForm}>
				<div className={style.top}>
					<p>
						<b>
							{t("availableCountAppointments")}
							:
						</b>
						{ProcConfig.MAX_COUNT_PROCEDURE}
					</p>
				</div>
				<Table />
				<Total />
				<div className={style.buttons}>
					<button
						type="button"
						id={style.add}
						className="button border"
						onClick={() => setPopupName("make")}
					>
						{t("addMore")}
					</button>
					<button
						type="submit"
						id={style.design}
						className="button border"
					>
						{t("continue")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default DesignProc;
