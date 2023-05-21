import { useLayoutEffect, useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";

import Body from "./components/Body/Body.jsx";

import LogoSrc from "@/assets/image/logo.svg";
import useLang from "./hooks/useLang.js";
import { asyncActions } from "./service/redusers/user.js";
import GlobalContext from "./context/global.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();

	const [{
		currentLang,
		langs,
	}, changeLanguage] = useLang();

	const [isAuth, setAuthState] = useState(false);
	const [isOpenCabinet, setOpenCabinet] = useState(false);
	const [isVisiblePopup, setVisiblePopup] = useState(false);
	const [popup, setPopup] = useState([]);

	async function init() {
		const refresh = await dispatch(asyncActions.refresh());

		if (refresh.error) {
			return;
		}

		setAuthState(true);
	}

	// useEffect(() => {
	// 	document.title = t(path.state.title);
	// }, [path, currentLang]);

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
		<GlobalContext.Provider value={contextValue}>
			<Helmet>
				<link rel="icon" type="image/x-icon" href={LogoSrc} />
			</Helmet>
			<Body />
		</GlobalContext.Provider>
	);
}

export default App;
