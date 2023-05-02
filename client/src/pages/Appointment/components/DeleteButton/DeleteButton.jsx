import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import { actions } from "@/service/redusers/userProcedures.js";

function DeleteButton({
	id,
	className,
	index,
}) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		newProcedures,
	} = useSelector((state) => state.userProcedures);
	const {
		setPopupName,
	} = useContext(GlobalContext);

	function handleClick() {
		dispatch(actions.deleteProc(index));

		if (newProcedures.length - 1 === 0) {
			setPopupName("make");
		}
	}

	return (
		<button
			id={id}
			title={t("delete")}
			type="button"
			className={`button ${className}`}
			onClick={handleClick}
		>
			<i
				className="fa fa-trash-o"
				aria-hidden="true"
			/>
		</button>
	);
}

DeleteButton.defaultProps = {
	id: "",
	className: "",
};

DeleteButton.propTypes = {
	id: types.string,
	className: types.string,
	index: types.number.isRequired,
};

export default DeleteButton;