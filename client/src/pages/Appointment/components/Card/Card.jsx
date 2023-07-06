import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import types from "prop-types";

import DateFormatter from "@/utils/dateFormatter.js";
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

	const border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";
	const formatedTimeCurrProc = DateFormatter.stringHourRange(
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
				boxShadow: border,
				"--ind": isSelected ? 2 : 1,
				...styleAttr,
			}}
			onMouseDown={onMouseDown}
		>
			<div
				className={style.wrapper}
			>
				<div>
					<div className="time">
						<span>{formatedTimeCurrProc}</span>
					</div>
					<div className={style.state}>
						{isExists && (
							<span>
								<i
									className="fa fa-bookmark color"
									aria-hidden="true"
									style={{
										color: `rgb(var(--${states[procedure.state].color}))`,
									}}
								/>
								{t(procedure.state)}
							</span>
						)}
					</div>
					<p className="procedureName">{t(procedure.type.name)}</p>
				</div>
				{
					isBook && (
						<Link
							id={style.more}
							to={`/details/${procedure.id}`}
							className="button border"
							data-target="procedureControl"
						>
							{t("more")}
						</Link>
					)
				}
			</div>
			<div
				className={style.buttons}
			>
				{isOwn && (
					<div>
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
			</div>
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
