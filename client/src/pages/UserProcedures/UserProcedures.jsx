import { useLayoutEffect, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProcedureByUserId, getAllTypes, getAllStates } from "@/service/redusers/procedures.js";

import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isAuth = localStorage.getItem("isAuth");

	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);
	const [hasPlaceholderLoader, setPlaceholderLoaderState] = useState(true);

	async function init() {
		dispatch(getAllTypes());
		dispatch(getAllStates());

		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
			return;
		}

		const res = await dispatch(getProcedureByUserId());

		if (res.error) {
			navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
			return;
		}

		const paylaod = res.payload || [];

		setTempCard(paylaod);
		setInitialCards(paylaod);
	}

	useLayoutEffect(() => init, []);

	useEffect(() => {
		if (!hasPlaceholderLoader) {
			return;
		}

		setPlaceholderLoaderState(false);
	}, [initialCards, hasPlaceholderLoader]);

	return (
		<div id={style.userProcedures}>
			{hasPlaceholderLoader ? (
				<PlaceholderLoader widthInPx="300px" />
			) : (
				<Filters
					placeholderLoaderState={[hasPlaceholderLoader, setPlaceholderLoaderState]}
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
