import { useLayoutEffect, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { asyncActions } from "@/service/redusers/userProcedures.js";
import GlobalContext from "@/context/global.js";

import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { info: userInfo } = useSelector((state) => state.user);
	const {
		isAuth,
	} = useContext(GlobalContext);
	const { t } = useTranslation();

	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);
	const [isLoading, setLoadState] = useState(true);

	async function init() {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
			return;
		}

		const proceduresByUserId = await dispatch(asyncActions.getProceduresByUserId(userInfo.id));

		if (proceduresByUserId.error) {
			navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
			return;
		}

		const paylaod = proceduresByUserId.payload || [];

		setTempCard(paylaod);
		setInitialCards(paylaod);
	}

	useLayoutEffect(() => {
		init();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			return;
		}

		setLoadState(false);
	}, [initialCards, isLoading]);

	return (
		<section id={style.userProcedures}>
			<Helmet>
				<title>{t(isLoading ? "loading" : "myProceduresTitle")}</title>
			</Helmet>
			{isLoading ? (
				<>
					<PlaceholderLoader width="300px" />
					<SimpleLoader />
				</>
			) : (
				<>
					<Filters
						setPlaceholderLoaderState={setLoadState}
						tempCards={tempCards}
						setTempCard={setTempCard}
						initialCards={initialCards}
					/>
					<Presentation
						tempCards={tempCards}
						initialCards={initialCards}
					/>
				</>
			)}
		</section>
	);
}

export default UserProcedures;
