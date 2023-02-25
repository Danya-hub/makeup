import { useLayoutEffect, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProcedureByUserId } from "@/service/redusers/procedures.js";
import { getAllTypes, getAllStates } from "@/service/redusers/procedures.js";

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

	async function __init__() {
		dispatch(getAllTypes());
		dispatch(getAllStates());

		if (!isAuth) {
			return navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
		}

		const res = await dispatch(getProcedureByUserId());

		if (res.error) {
			return navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
		}

		const paylaod = res.payload || [];

		setTempCard(paylaod);
		setInitialCards(paylaod);
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	useEffect(() => {
		if (!hasPlaceholderLoader) {
			return;
		}

		setPlaceholderLoaderState(false);
	}, [initialCards, hasPlaceholderLoader]);

	return (
		<div id={style.userProcedures}>
			{hasPlaceholderLoader ? (
				<PlaceholderLoader widthInPx="300px"></PlaceholderLoader>
			) : (
				<Filters
					placeholderLoaderState={[hasPlaceholderLoader, setPlaceholderLoaderState]}
					tempCardsState={[tempCards, setTempCard]}
					initialCards={initialCards}
				></Filters>
			)}
			<Presentation
				tempCards={tempCards}
				initialCards={initialCards}
			></Presentation>
		</div>
	);
}

export { UserProcedures as default };
