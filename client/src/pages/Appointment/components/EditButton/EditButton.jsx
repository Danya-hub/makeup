import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import { actions } from "@/service/redusers/userProcedures.js";

function EditButton({
	index,
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		setPopupName,
	} = useContext(GlobalContext);

	function handleClick() {
		dispatch(actions.switchCurrentProc(index));
		setPopupName("edit");
	}

	return (
		<button
			title={t("edit")}
			type="button"
			className="button"
			onClick={handleClick}
		>
			<i
				className="fa fa-pencil-square-o"
				aria-hidden="true"
			/>
		</button>
	);
}

EditButton.propTypes = {
	index: types.number.isRequired,
};

export default EditButton;