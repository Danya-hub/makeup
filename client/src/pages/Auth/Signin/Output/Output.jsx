import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import { signin, actions } from "@/service/redusers/user.js";
import changePropertyValue from "@/helpers/changePropertyValue";

import style from "@/pages/Auth/Auth.module.css";

Output.propTypes = {
	onSuccess: types.func,
	userState: types.array,
};

function Output({ onSuccess, userState }) {
	const { t } = useTranslation();
	const { error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
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

	function toSignup() {
		dispatch(actions.clearError());

		navigate("/signup", {
			state: {
				purpose,
			},
		});
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("welcome")}</h2>
				<p className={`${style.message}  ${style.left}`}>{t(purpose)}</p>
				{/* {error.msg && <p>{error.msg}</p>} */}
				<form onSubmit={handleSubmitForm}>
					<label id="telephone">
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
						{t("signIn")}
					</button>
				</form>
				<div className={style.question}>
					<p>{t("notHaveAccount")}</p>
					<button
						type="button"
						onClick={toSignup}
					>
						{t("signUp")}
					</button>
				</div>
			</div>
		</div>
	);
}

export { Output as default };
