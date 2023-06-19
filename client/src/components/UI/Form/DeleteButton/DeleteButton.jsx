import { useTranslation } from "react-i18next";
import types from "prop-types";

function DeleteButton({
	id,
	className,
	index,
	onClick,
}) {
	const { t } = useTranslation();

	return (
		<button
			id={id}
			title={t("delete")}
			type="button"
			className={`button ${className}`}
			onClick={() => onClick(index)}
			data-target="procedureControl"
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
	onClick: types.func.isRequired,
};

export default DeleteButton;