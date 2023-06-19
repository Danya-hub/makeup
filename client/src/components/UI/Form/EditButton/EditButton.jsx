import { useTranslation } from "react-i18next";
import types from "prop-types";

function EditButton({
	index,
	onClick,
}) {
	const { t } = useTranslation();

	return (
		<button
			title={t("edit")}
			type="button"
			className="button"
			onClick={() => onClick(index)}
			data-target="procedureControl"
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
	onClick: types.func.isRequired,
};

export default EditButton;