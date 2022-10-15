import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { signin, actions } from "@/service/redusers/user.js";
import { default as GoogleSrc } from "@/assets/image/google.svg";

import style from "@/pages/Auth/Auth.module.css";

function Signin() {
	const { t } = useTranslation();
	const { error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state } = useLocation();

	const [user, setUser] = useState({});

	function valueFromInput(e, callback) {
		const t = e.target;

		callback((prev) => ({
			...prev,
			[t.name]: t.value,
		}));
	}

	async function handleSubmitForm(e) {
		e.preventDefault();

		const res = await dispatch(signin(user));

		if (res.meta.rejectedWithValue) {
			return;
		}

		localStorage.setItem("token", res.payload.data.accessToken);

		dispatch(actions.clearError());
		navigate("/appointment", {
			replace: true,
		});
	}

	return (
		<div id={style.auth}>
			<aside>
				<h2>{t("welcome")}</h2>
				<p>{state?.purpose}</p>
				<button
					type="button"
					className="button"
					onClick={() => {
						dispatch(actions.clearError());
						navigate("/signup", {
							replace: true,
							state: {
								purpose: state?.purpose,
							},
						});
					}}
				>
					{t("signUp")}
				</button>
			</aside>
			<div id={style.form}>
				<div className={style.wrapper}>
					<h2>{t("signinAccount")}</h2>
					{error.msg && <p>{error.msg}</p>}
					<form onSubmit={handleSubmitForm}>
						<label>
							<h3 className="title">{t("telephone")}</h3>
							<input
								name="telephone"
								onBlur={(e) => valueFromInput(e, setUser)}
							></input>
						</label>
						<label>
							<h3 className="title">{t("password")}</h3>
							<input
								name="password"
								onBlur={(e) => valueFromInput(e, setUser)}
							></input>
						</label>
						<button
							type="submit"
							className="button"
						>
							{t("signIn")}
						</button>
					</form>
					<div id={style.or}>
						<span>{t("or")}</span>
					</div>
					<div id={style.other}>
						<button type="button">
							<img
								src={GoogleSrc}
								alt="google"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Signin as default };
