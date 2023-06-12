import types from "prop-types";
import { useSelector } from "react-redux";

import Card from "./Card/Card.jsx";

import style from "./Items.module.css";

function Items({
	reviews,
	procedure,
	hasActions,
}) {
	const { info: userInfo } = useSelector((state) => state.user);

	return (
		<div
			className={style.items}
		>
			{reviews.map((review) => (
				<Card
					key={review.id}
					procedure={procedure}
					content={review}
					isOwn={review.user.id === userInfo?.id && hasActions}
				/>
			))}
		</div>
	);
}

Items.defaultProps = {
	hasActions: false,
};

Items.propTypes = {
	procedure: types.instanceOf(Object).isRequired,
	reviews: types.instanceOf(Array).isRequired,
	hasActions: types.bool,
};

export default Items;