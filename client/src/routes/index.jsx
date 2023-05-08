import { lazy } from "react";

const Base = lazy(() => import("@/pages/Base/Base.jsx"));
const Appointment = lazy(() => import("@/pages/Appointment/Appointment.jsx"));
const NotFound = lazy(() => import("@/pages/Error/NotFound/NotFound.jsx"));
const Signup = lazy(() => import("@/pages/Auth/Signup/Signup.jsx"));
const Signin = lazy(() => import("@/pages/Auth/Signin/Signin.jsx"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword/ResetPassword.jsx"));
const UserProcedures = lazy(() => import("@/pages/UserProcedures/UserProcedures.jsx"));
const ProcDetails = lazy(() => import("@/pages/ProcDetails/ProcDetails.jsx"));

const routes = [
	{
		path: "/",
		elem: () => <Base />,
		state: {
			title: "mainTitle",
			header: true,
			footer: true,
		},
	},
	{
		path: "/appointment",
		elem: () => <Appointment />,
		state: {
			title: "appointmentTitle",
			header: true,
			footer: true,
		},
	},
	{
		path: "/signup",
		elem: () => <Signup />,
		state: {
			title: "signUpTitle",
			header: true,
		},
	},
	{
		path: "/signin",
		elem: () => <Signin />,
		state: {
			title: "signInTitle",
			header: true,
		},
	},
	{
		path: "/myprocedures",
		elem: () => <UserProcedures />,
		state: {
			title: "myProceduresTitle",
			header: true,
			footer: true,
		},
	},
	{
		path: "/resetPassword/:email",
		elem: () => <ResetPassword />,
		state: {
			title: "resetPasswordTitle",
			header: true,
		},
	},
	{
		path: "/details",
		elem: () => <ProcDetails />,
		state: {
			title: "procDetailsTitle",
			header: true,
			footer: true,
		},
	},
	{
		path: "*",
		elem: () => <NotFound />,
		state: {
			title: "notFoundTitle",
		},
	},
];

export default routes;
