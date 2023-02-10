import { useLayoutEffect, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "@/components/Header/Header.jsx";
import Main from "@/components/Main/Main.jsx";
import Offline from "@/pages/Error/Offline/Offline.jsx";

import AuthContext from "@/context/auth.js";
import { refresh } from "@/service/redusers/user.js";
import routes from "./routes/index.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	const location = useLocation();
	const { info } = useSelector((state) => state.user);

	const openCabinetState = useState(false);

	const onLine = true || window.navigator.onLine;
	const path = routes.find((route) => route.path === location.pathname || route.path === "*");

	function __init__() {
		dispatch(refresh());
	}

	useEffect(() => {
		document.title = path.state.title;
	}, [path]);

	useLayoutEffect(() => {
		return __init__;
	}, []);

	return onLine ? (
		<AuthContext.Provider
			value={{
				isAuth: info !== null,
			}}
		>
			{path.state.header && <Header openCabinetState={openCabinetState}></Header>}
			<Main openCabinetState={openCabinetState}></Main>
		</AuthContext.Provider>
	) : (
		<Offline></Offline>
	);
}

export { App as default };
