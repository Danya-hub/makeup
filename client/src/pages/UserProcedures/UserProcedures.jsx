import { useLayoutEffect, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { asyncActions } from "@/service/redusers/allProcedures.js";

import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isAuth = localStorage.getItem("token");

	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);
	const [isLoading, setLoadState] = useState(true);

	async function init() {
		dispatch(asyncActions.getAllTypes());

		// if (!isAuth) {
		// 	navigate("/signin", {
		// 		state: {
		// 			purpose: "noAccessToPage",
		// 		},
		// 	});
		// 	return;
		// }

		// const res = await dispatch(asyncActions.getProcedureByUserId());

		// if (res.error) {
		// 	navigate("/signin", {
		// 		state: {
		// 			purpose: "noAccessToPage",
		// 		},
		// 	});
		// 	return;
		// }

		// const paylaod = res.payload || [];

		// setTempCard(paylaod);
		// setInitialCards(paylaod);
	}

	useLayoutEffect(() => init, []);

	useEffect(() => {
		if (!isLoading) {
			return;
		}

		setLoadState(false);
	}, [initialCards, isLoading]);

	return (
		<div id={style.userProcedures}>
			{isLoading ? (
				<PlaceholderLoader width="300px" />
			) : (
				<Filters
					placeholderLoaderState={[isLoading, setLoadState]}
					tempCardsState={[tempCards, setTempCard]}
					initialCards={initialCards}
				/>
			)}
			<Presentation
				tempCards={tempCards}
				initialCards={initialCards}
			/>
		</div>
	);
}

export default UserProcedures;
