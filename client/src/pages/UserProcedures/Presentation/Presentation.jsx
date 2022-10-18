import types from "prop-types";

import Loader from "@/components/Loader/Loader.jsx";

Presentation.propTypes = {
	carts: types.array,
	isLoadingContent: types.bool,
};

function Presentation({ carts, isLoadingContent }) {
	return isLoadingContent ? (
		<Loader></Loader>
	) : (
		carts.map((cart) => (
			<div key={cart._id}>
				<h3 id="procName">{cart.type.name}</h3>
				<span id="procPrice">
					{cart.type.price}
					{cart.type.currency}
				</span>
				<p id="procTime">
					{cart.startProcTime} - {cart.finishProcTime}
				</p>
				<span id="procState">{cart.state.name}</span>
			</div>
		))
	);
}

export { Presentation as default };
