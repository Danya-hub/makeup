import { lazy } from "react";

const Main = lazy(() => import("@/pages/Main/Main.jsx"));
const Procedure = lazy(() => import("@/pages/Procedure/Procedure.jsx"));
const Error = lazy(() => import("@/pages/Error/Error.jsx"));
const Signup = lazy(() => import("@/pages/Auth/Signup/Signup.jsx"));
const Signin = lazy(() => import("@/pages/Auth/Signin/Signin.jsx"));

const routes = [
	{
		path: "/",
		elem: <Main />,
		flags: {
			title: "",
			header: true,
			footer: true,
		},
	},
	{
		path: "/appointment",
		elem: <Procedure />,
		flags: {
			title: "",
			header: true,
		},
	},
	{
		path: "/signup",
		elem: <Signup />,
		flags: {
			title: "",
			header: true,
		},
	},
	{
		path: "/signin",
		elem: <Signin />,
		flags: {
			title: "",
			header: true,
		},
	},
	{
		path: "*",
		elem: <Error />,
		flags: {
			title: "",
		},
	},
];

export { routes as default };
