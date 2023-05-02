import { useLayoutEffect, useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

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
	const [{
		currentLang,
		langs,
	}, changeLanguage] = useLang();

	const [isOpenCabinet, setOpenCabinet] = useState(false);
	const [isVisiblePopup, setVisiblePopup] = useState(false);
	const [popupName, setPopupName] = useState("");

	const onLine = true || window.navigator.onLine;
	const path = routes.find((route) => route.path === location.pathname || route.path === "*");

	function init() {
		dispatch(asyncActions.refresh());
	}

	useEffect(() => {
		document.title = path.state.title;
	}, [path]);

	useLayoutEffect(() => init, []);

	const contextValue = useMemo(() => ({
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
