import { useState, useContext, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { asyncActions } from "@/service/redusers/user.js";
import fields from "@/components/Body/Cabinet/EditUserPopup/constants/fields.js";
import GlobalContext from "@/context/global.js";

import style from "./Info.module.css";

function Info() {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state);
	const { t } = useTranslation();
	const {
		setVisiblePopup,
		setPopup,
		setOpenCabinet,
	} = useContext(GlobalContext);

	const [isEdit, setEditState] = useState(false);

	function handleResetPassword() {
		dispatch(asyncActions.sendLinkForResetingPassword({
			email: user.info.email,
		}));
		setOpenCabinet(false);
	}

	function handleChangeStateProfile() {
		setEditState((state) => !state);
	}

	function handleEditProfile(popupName) {
		setPopup([popupName, null]);
		setVisiblePopup(true);
		setOpenCabinet(false);
		setEditState(false);
	}

	return (
		<div id={style.info}>
			<img
				id={style.userAvatar}
				src={user.info.avatar}
				alt="userAvatar"
			/>
			<div>
				{fields.map(({
					changeBy,
					field,
				}) => (
					<div
						key={field}
						className={style.field}
					>
						<span
							id={style[field]}
						>
							{user.info[field]}
						</span>
						<button
							type="button"
							className={isEdit ? style.edit : ""}
							onClick={() => handleEditProfile(changeBy)}
							title={t("edit")}
						>
							<i
								className="fa fa-pencil-square-o"
								aria-hidden="true"
							/>
						</button>
					</div>
				))}
				{isEdit && (
					<button
						type="button"
						className="button"
						id={style.resetPassword}
						onClick={handleResetPassword}
					>
						{t("changePassword")}
					</button>
				)}
				<button
					type="button"
					className="button border"
					id={style.editProfile}
					onClick={handleChangeStateProfile}
				>
					{t(isEdit ? "cancel" : "editProfile")}
				</button>
			</div>
		</div>
	);
}

export default memo(Info);