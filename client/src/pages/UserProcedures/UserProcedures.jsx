import { useLayoutEffect, useState, useEffect, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { asyncActions as userProcedureAsyncActions } from "@/service/actions/userProcedures.js";
import GlobalContext from "@/context/global.js";
import UserProceduresContext from "./context/userProcedures.js";
import routes from "./Presentation/Output/TopNavigation/constants/routes.js";
import UserProceduresHelpers from "./helpers/procedure.js";

import PlaceholderLoader from "@/components/UI/PlaceholderLoader/PlaceholderLoader.jsx";
import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state: locationState } = useLocation();
	const { user, userProcedures } = useSelector((state) => state);
	const {
		isAuth,
	} = useContext(GlobalContext);
	const { t } = useTranslation();

	const [initialCards, setInitialCards] = useState([]);
	const [tempCards, setTempCard] = useState([]);
	const [isLoading, setLoadState] = useState(true);
	const [currentPath, setCurrentPath] = useState(locationState?.path || routes[0]);

	async function init() {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "noAccessToPage",
				},
			});
			return;
		}

		await dispatch(
			userProcedureAsyncActions.getProceduresByUserId(user.info.id),
		);
		setLoadState(true);
	}

	function handleChangeFilter(value) {
		const sortedProcedures = UserProceduresHelpers.sortByState(value);

		setTempCard(sortedProcedures);
	}

	useLayoutEffect(() => {
		init();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			return;
		}

		setLoadState(false);
	}, [isLoading]);

	useEffect(() => {
		const proceduresByPath = {
			allServices: userProcedures.proceduresByUser,
			myFavorites: userProcedures.favoriteProcedurs,
		};

		const sortedProcedures = UserProceduresHelpers.sortByState(proceduresByPath[currentPath]);

		setTempCard(sortedProcedures);
		setInitialCards(sortedProcedures);
	}, [currentPath, isLoading]);

	const contextValue = useMemo(() => ({
		currentPath,
		setCurrentPath,
	}), [currentPath]);

	return (
		<UserProceduresContext.Provider
			value={contextValue}
		>
			<section id={style.appointments}>
				<Helmet>
					<title>{t(isLoading ? "loading" : "appointmentHistory")}</title>
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
							onChange={handleChangeFilter}
							initialCards={initialCards}
						/>
						<Presentation
							tempCards={tempCards}
							initialCards={initialCards}
						/>
					</>
				)}
			</section>
		</UserProceduresContext.Provider>
	);
}

export default UserProcedures;
