import { useContext } from "react";
import { useTranslation } from "react-i18next";

import Popup from "@/components/UI/Popup/Popup.jsx";
// import Select from "@/components/UI/Form/Select/Select.jsx";
import List from "./List/List.jsx";

import PropsContext from "@/pages/AllProcedures/context.js";
import { MAX_COUNT_PROCEDURE } from "@/pages/AllProcedures/constants.js";

import style from "./Design.module.css";

function DesignProc() {
	const {
		visiblePopupState,
		newProceduresState,
		changePopupNameState,
		edit: editProcedureByIndex,
		delete: deleteProcedureByIndex,
	} = useContext(PropsContext);
	const { t } = useTranslation();

	const [newProcedures] = newProceduresState;
	const [isVisible, setVisible] = visiblePopupState;
	const [, changePopupName] = changePopupNameState;

	function handleSubmitForm() {}

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
						{MAX_COUNT_PROCEDURE}
					</p>
				</div>
				<List
					procedures={newProcedures}
					onEdit={editProcedureByIndex}
					onDelete={deleteProcedureByIndex}
				></List>
				<div className={style.buttons}>
					<button
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

export { DesignProc as default };
