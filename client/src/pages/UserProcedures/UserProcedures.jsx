import { useLayoutEffect, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getProcedureByUserId } from "@/service/redusers/procedures.js";
import AuthContext from "@/context/auth.js";
import { getAllTypes, getAllStates } from "@/service/redusers/procedures.js";

import PlaceholderLoader from "@/components/PlaceholderLoader/PlaceholderLoader.jsx"
import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state);

	const { isAuth } = useContext(AuthContext);
	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);

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

		const res = await dispatch(getProcedureByUserId(user.info._id));

		setTempCard(res.payload || []);
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	useEffect(() => {
		if (initialCards.length) {
			return;
		}

		setInitialCards(tempCards);
	}, [tempCards]);

	return (
		<div id={style.userProcedures}>
			{tempCards.length ?
				<Filters
					tempCardsState={[tempCards, setTempCard]}
					initialCards={initialCards}
				></Filters> 
				: 
				<PlaceholderLoader widthInPx="300px"></PlaceholderLoader>}
			<Presentation
				tempCards={tempCards}
				initialCards={initialCards}
			></Presentation>
		</div>
	);
}

export { UserProcedures as default };
