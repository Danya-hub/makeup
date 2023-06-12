import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import GlobalContext from "@/context/global.js";
import { states } from "@/config/procedures.js";

import DeleteButton from "@/components/UI/Form/DeleteButton/DeleteButton.jsx";
import EditButton from "@/components/UI/Form/EditButton/EditButton.jsx";

import style from "./Card.module.css";

function Card({
	id,
	index,
	date,
	className,
	procedure,
	styleAttr,
	isOwn,
	isBook,
	isExists,
	isSelected,
	onMouseDown,
	onDelete,
	onEdit,
}) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const backColor = isExists ? states[procedure.state].color : "lightGray";
	const border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";
	const formatedTimeCurrProc = FormatDate.stringHourAndMinWithRange(
		date,
		procedure.type.duration,
		currentLang,
	);

	return (
		// event for card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			id={id}
			className={`${style.card} ${className}`}
			style={{
				background: `rgb(var(--${backColor}))`,
				boxShadow: border,
				"--ind": isSelected ? 2 : 1,
				...styleAttr,
			}}
			onMouseDown={onMouseDown}
		>
			<div
				className={style.wrapper}
			>
				<div className="time">
					<span>{formatedTimeCurrProc}</span>
				</div>
				<span className="status">{t(procedure.type.state)}</span>
				<p className="procedureName">{t(procedure.type.name)}</p>
			</div>
			{isOwn && (
				<div
					className={style.buttons}
				>
					<DeleteButton
						index={index}
						onClick={onDelete}
					/>
					<EditButton
						index={index}
						onClick={onEdit}
					/>
				</div>
			)}
			{isBook && (
				<Link
					to={`/details/${procedure.id}`}
					type="button"
					id={style.more}
					className="button border"
				>
					{t("more")}
				</Link>
			)}
		</div>
	);
}

Card.defaultProps = {
	id: "",
	className: "",
	styleAttr: {},
	isExists: true,
	isSelected: false,
	isOwn: false,
	isBook: false,
	onMouseDown: null,
	onDelete: null,
	onEdit: null,
	index: 0,
};

Card.propTypes = {
	id: types.string,
	className: types.string,
	date: types.instanceOf(Object).isRequired,
	procedure: types.instanceOf(Object).isRequired,
	styleAttr: types.instanceOf(Object),
	isExists: types.bool,
	isSelected: types.bool,
	isOwn: types.bool,
	isBook: types.bool,
	onMouseDown: types.func,
	index: types.number,
	onDelete: types.func,
	onEdit: types.func,
};

export default Card;
