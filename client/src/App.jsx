import { useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import Body from "./components/Body/Body.jsx";

import LogoSrc from "@/assets/image/logo.svg";
import useLang from "./hooks/useLang.js";
import { asyncActions as userAsyncActions } from "./service/redusers/user.js";
import { asyncActions as userProceduresAsyncActions } from "./service/redusers/userProcedures.js";
import GlobalContext from "./context/global.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);

	const [{
		currentLang,
		langs,
	}, changeLanguage] = useLang();

	const [isAuth, setAuthState] = useState(false);
	const [isOpenCabinet, setOpenCabinet] = useState(false);
	const [isVisiblePopup, setVisiblePopup] = useState(false);
	const [popup, setPopup] = useState([]);

	function init() {
		if (isAuth) {
			dispatch(userProceduresAsyncActions.getFavorites(userInfo.id));
		} else {
			dispatch(userAsyncActions.refresh())
				.then(async (res) => {
					await dispatch(userProceduresAsyncActions.getFavorites(res.payload.id));
					setAuthState(true);
				});
		}
	}

	useEffect(() => {
		document.body.style.overflowY = isVisiblePopup ? "hidden" : "scroll";
	}, [isVisiblePopup]);

	useLayoutEffect(() => {
		init();
	}, [isAuth]);

	const contextValue = useMemo(() => ({
		isAuth,
		setAuthState,
		currentLang,
		langs,
		changeLanguage,
		isVisiblePopup,
		setVisiblePopup,
		popup,
		setPopup,
		isOpenCabinet,
		setOpenCabinet,
	}), [
		isAuth,
		currentLang,
		isVisiblePopup,
		popup,
		isOpenCabinet,
	]);

	return (
		<GlobalContext.Provider
			value={contextValue}
		>
			<Helmet>
				<link
					rel="icon"
					type="image/x-icon"
					href={LogoSrc}
				/>
			</Helmet>
			<Body />
		</GlobalContext.Provider>
	);
}

export default App;
