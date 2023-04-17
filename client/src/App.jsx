import { useLayoutEffect, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import Offline from "./pages/Error/Offline/Offline.jsx";

import useLang from "./hooks/useLang.js";
import { asyncActions } from "./service/redusers/user.js";
import routes from "./routes/index.jsx";
import LangContext from "./context/lang.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	const location = useLocation();
	const lang = useLang();

	const openCabinetState = useState(false);

	const onLine = true || window.navigator.onLine;
	const path = routes.find((route) => route.path === location.pathname || route.path === "*");

	function init() {
		dispatch(asyncActions.refresh());
	}

	useEffect(() => {
		document.title = path.state.title;
	}, [path]);

	useLayoutEffect(() => init, []);

	return (
		<LangContext.Provider value={lang}>
			{onLine ? (
				<>
					{path.state.header && <Header openCabinetState={openCabinetState} />}
					<Main openCabinetState={openCabinetState} />
				</>
			) : <Offline />}
		</LangContext.Provider>
	);
}

export default App;
