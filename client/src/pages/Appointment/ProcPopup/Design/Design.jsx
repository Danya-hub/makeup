import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Table from "./Table/Table.jsx";
import Total from "./Total/Total.jsx";

import { actions, asyncActions } from "@/service/redusers/userProcedures.js";
import PropsContext from "@/pages/Appointment/context.js";
import ProcConfig from "@/config/procedures.js";

import style from "./Design.module.css";

function DesignProc() {
	const {
		visiblePopupState,
		changePopupNameState,
	} = useContext(PropsContext);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		newProcedures,
	} = useSelector((state) => state.userProcedures);

	const [isVisible, setVisible] = visiblePopupState;
	const [, changePopupName] = changePopupNameState;

	function handleSubmitForm(e) {
		e.preventDefault();

		dispatch(asyncActions.createNewProcedures(newProcedures));
	}

	function handleEdit(i) {
		dispatch(actions.switchCurrentProc(i));
		changePopupName("edit");
	}

	function handleDelete(i) {
		dispatch(actions.deleteProc(i));

		if (newProcedures.length - 1 === 0) {
			changePopupName("make");
		}
	}

	return (
		<Popup
			id={style.designProc}
			onClose={() => changePopupName("make")}
			isSimple={false}
			strictSwitch={[
				isVisible,
				(bln) => {
					setVisible(bln);
				},
			]}
		>
			<form onSubmit={handleSubmitForm}>
				<div className={style.top}>
					<p>
						<b>Макс. кол. записей: </b>
						{ProcConfig.MAX_COUNT_PROCEDURE}
					</p>
				</div>
				<Table
					procedures={newProcedures}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
				<Total
					procedures={newProcedures}
				/>
				<div className={style.buttons}>
					<button
						type="button"
						id={style.add}
						className="button border"
						onClick={() => changePopupName("make")}
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
