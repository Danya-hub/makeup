import { useLayoutEffect, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProcedureByUserId } from "@/service/redusers/procedures.js";
import AuthContext from "@/context/auth.js";

import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./UserProcedures.module.css";
import { useNavigate } from "react-router-dom";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state);

	const { isAuth } = useContext(AuthContext);
	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);

	async function __init__() {
		if (!isAuth) {
			return navigate("/signin", {
				replace: true,
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
	}, [user.info]);

	useEffect(() => {
		if (initialCards.length) {
			return;
		}

		setInitialCards(tempCards);
	}, [tempCards]);

	return (
		<div id={style.userProcedures}>
			<Filters
				tempCardsState={[tempCards, setTempCard]}
				initialCards={initialCards}
			></Filters>
			<Presentation
				cards={tempCards}
				initialCards={initialCards}
			></Presentation>
		</div>
	);
}

export { UserProcedures as default };
