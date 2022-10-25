import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment, useLayoutEffect, useEffect, useState } from "react";

import Header from "@/components/Header/Header.jsx";
import Main from "@/components/Main/Main.jsx";

import { refresh } from "@/service/redusers/user.js";
import routes from "./routes/index.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	const location = useLocation();

	const openCabinetState = useState(false);
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

	return (
		<Fragment>
			{path.state.header && (
				<Header
					openCabinetState={openCabinetState}
					isDisplay={true}
				></Header>
			)}
			<Main openCabinetState={openCabinetState}></Main>
		</Fragment>
	);
}

export { App as default };
