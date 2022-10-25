// import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment, useLayoutEffect, useState } from "react";

import Header from "@/components/Header/Header.jsx";
import Main from "@/components/Main/Main.jsx";

import { refresh } from "@/service/redusers/user.js";
// import routes from "./routes/index.js"; // !

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();
	// const location = useLocation();

	const openCabinetState = useState(false);
	// const currentPath = routes.find((route) => route.path === location.pathname); // !

	function __init__() {
		dispatch(refresh());
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	return (
		<Fragment>
			<Header
				openCabinetState={openCabinetState}
				isDisplay={true}
			></Header>
			<Main openCabinetState={openCabinetState}></Main>
		</Fragment>
	);
}

export { App as default };
