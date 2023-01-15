import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import { signup, actions } from "@/service/redusers/user.js";
import changePropertyValue from "@/helpers/changePropertyValue.js";

// import GoogleSignin from "@/components/UI/Form/GoogleSignin/GoogleSignin.jsx";

import style from "@/pages/Auth/Auth.module.css";

Output.propTypes = {
	onSuccess: types.func,
	userState: types.array,
};

function Output({ onSuccess, userState }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { error } = useSelector((state) => state.user);
	const { state } = useLocation();

	const [, setUser] = userState;
	const purpose = state?.purpose || "adviceForAuth";

	function valueFromInput(e, callback) {
		const t = e.target;

		changePropertyValue(
			{
				[t.name]: t.value,
			},
			callback
		);
	}

	function handleSubmitForm(e) {
		e.preventDefault();

		onSuccess();
	}

	function toSignin() {
		dispatch(actions.clearError());

		navigate("/signin", {
			state: {
				purpose,
			},
		});
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("signupAccount")}</h2>
				<p className={`${style.message}  ${style.left}`}>{t(purpose)}</p>
				{/* {error?.msg && <p>{error?.msg}</p>} */}
				<form onSubmit={handleSubmitForm}>
					<label>
						<h3 className="title">{t("fullname")}</h3>
						<input
							type="text"
							name="fullname"
							onBlur={(e) => valueFromInput(e, setUser)}
						></input>
					</label>
					<label>
						<h3 className="title">{t("telephone")}</h3>
						<input
							type="tel"
							name="telephone"
							onBlur={(e) => valueFromInput(e, setUser)}
						></input>
					</label>
					<button
						type="submit"
						className="button border"
					>
						{t("signUp")}
					</button>
				</form>
				<div className={style.question}>
					<p>{t("alreadyExistsAccount")}</p>
					<button
						type="button"
						className="button"
						onClick={toSignin}
					>
						{t("signIn")}
					</button>
				</div>
			</div>
		</div>
	);
}

export { Output as default };
