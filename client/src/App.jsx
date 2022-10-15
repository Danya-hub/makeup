import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment, Suspense, useLayoutEffect } from "react";

import Header from "@/components/Header/Header.jsx";
import Loader from "@/features/Loader/Loader.jsx";

import { refresh } from "./service/redusers/user.js";
import routes from "@/routes/index.js";

import "@/styles/main.css";

function App() {
	const dispatch = useDispatch();

	function __init__() {
		dispatch(refresh());
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	return (
		<Fragment>
			<Header></Header>
			<main>
				<Suspense fallback={<Loader />}>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.elem}
							></Route>
						))}
					</Routes>
				</Suspense>
			</main>
		</Fragment>
	);
}

export { App as default };
