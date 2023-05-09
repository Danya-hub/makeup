import { useLayoutEffect, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import Offline from "./pages/Error/Offline/Offline.jsx";

import useLang from "./hooks/useLang.js";
import { asyncActions } from "./service/redusers/user.js";
import routes from "./routes/index.jsx";
import GlobalContext from "./context/global.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	const location = useLocation();
	const { t } = useTranslation();
	const [{
		currentLang,
		langs,
	}, changeLanguage] = useLang();

	const [isAuth, setAuthState] = useState(false);
	const [isOpenCabinet, setOpenCabinet] = useState(false);
	const [isVisiblePopup, setVisiblePopup] = useState(false);
	const [popupName, setPopupName] = useState("");

	const onLine = true || window.navigator.onLine;
	const path = routes.find((route) => route.state.pathname === location.pathname || route.state.pathname === "*");

	async function init() {
		const refresh = await dispatch(asyncActions.refresh());

		if (refresh.error) {
			return;
		}

		setAuthState(true);
	}

	useEffect(() => {
		document.title = t(path.state.title);
	}, [path, currentLang]);

	useEffect(() => {
		document.body.style.overflowY = isVisiblePopup ? "hidden" : "scroll";
	}, [isVisiblePopup]);

	useLayoutEffect(() => {
		init();
	}, []);

	const contextValue = useMemo(() => ({
		isAuth,
		setAuthState,
		currentLang,
		langs,
		changeLanguage,
		isVisiblePopup,
		setVisiblePopup,
		popupName,
		setPopupName,
		isOpenCabinet,
		setOpenCabinet,
	}), [
		isAuth,
		currentLang,
		isVisiblePopup,
		popupName,
		isOpenCabinet,
	]);

	return (
		<GlobalContext.Provider value={contextValue}>
			{onLine ? (
				<>
					{path.state.header && <Header />}
					<Main />
				</>
			) : <Offline />}
		</GlobalContext.Provider>
	);
}

export default App;
