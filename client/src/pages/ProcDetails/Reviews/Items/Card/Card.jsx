import { useContext } from "react";
import types from "prop-types";
import { useDispatch } from "react-redux";

import DeleteButton from "@/components/UI/Form/DeleteButton/DeleteButton.jsx";
import EditButton from "@/components/UI/Form/EditButton/EditButton.jsx";

import GlobalContext from "@/context/global.js";
import ReviewContext from "@/pages/ProcDetails/context/reviews.js";
import { asyncActions } from "@/service/actions/appointments.js";

import style from "./Card.module.css";

const COUNT_STARS = 5;

function Card({
	procedure,
	content,
	isOwn,
}) {
	const {
		currentLang,
	} = useContext(GlobalContext);
	const reviewContextState = useContext(ReviewContext);
	const dispatch = useDispatch();

	const createdAt = Intl.DateTimeFormat(currentLang, {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		minute: "numeric",
		hour: "numeric",
	}).format(content.createdAt);

	function onDelete(id) {
		dispatch(asyncActions.deleteReview(id));
		dispatch(asyncActions.updateProc([{
			...procedure,
			stars: 0,
		}, false]));
	}

	function onEdit() {
		// eslint-disable-next-line react/destructuring-assignment
		reviewContextState.setReviewFormValue([content, "edit"]);
	}

	return (
		<div
			id={content.id}
			className={style.card}
		>
			{isOwn && (
				<div
					className={style.buttons}
				>
					<DeleteButton
						index={content.id}
						onClick={onDelete}
					/>
					<EditButton
						index={content.id}
						onClick={onEdit}
					/>
				</div>
			)}
			<div
				className={style.avatar}
			>
				<img
					src={content.user.avatar}
					alt="avatar"
				/>
			</div>
			<div
				className={style.content}
			>
				<div className={style.topPanel}>
					<b>{content.user.username}</b>
					<span
						className={style.createdAt}
					>
						{createdAt}
					</span>
				</div>
				<div
					title={content.stars}
				>
					{[...Array(COUNT_STARS)].map((_, i) => (
						<i
							id={i}
							// eslint-disable-next-line react/no-array-index-key
							key={`${i}/star`}
							className={i >= content.stars ? "fa fa-star-o" : "fa fa-star"}
							aria-hidden="true"
						/>
					))}
				</div>
				<p
					className={style.text}
				>
					{content.text}
				</p>
			</div>
		</div>
	);
}

Card.defaultProps = {
	isOwn: false,
};

Card.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
	content: types.instanceOf(Object).isRequired,
	isOwn: types.bool,
};

export default Card;