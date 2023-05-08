import Password from "../Password/Password.jsx";
import Email from "../Email/Email.jsx";

import format, { keys } from "@/components/UI/Form/ChannelInput/constants/format.js";
import { asyncActions } from "@/service/actions/user.js";
import AvatarCanvas from "@/pages/Auth/helpers/genarateAvatar.js";

const popups = {
	"password.username": () => (
		<Password
			purpose="changeUsernameByPassword"
			field="username"
			onSuccess={async ({
				dispatch,
				user,
			}) => {
				const avatar = AvatarCanvas.getUrl(user.username, 100);

				await dispatch(asyncActions.editUserById({
					id: user.id,
					data: {
						avatar,
					},
					field: "avatar",
				}));
			}}
			rules={{
				pattern: {
					value: /^\p{L}+(?:\s\p{L}+)?$/u,
					message: ["usernameValid"],
				},
				minLength: {
					value: 3,
					message: ["largerusernameValid", {
						min: 3,
					}],
				},
				maxLength: {
					value: 40,
					message: ["lesserusernameValid", {
						max: 40,
					}],
				},
			}}
		/>
	),
	"email.telephone": () => (
		<Email
			purpose="changeTelephoneByEmail"
			field="telephone"
			rules={({
				countryValue,
			}) => ({
				pattern: {
					value: /^[0-9]+$/,
					message: ["wrongTelFormatValid"],
				},
				minLength: {
					value: format.telephone[countryValue || keys[0]].template.length,
					message: ["lesserTelephoneValid", {
						max: format.telephone[countryValue || keys[0]].template.length,
					}],
				},
			})}
		/>
	),
	"email.email": () => (
		<Email
			purpose="changeEmailByEmail"
			field="email"
			rules={() => ({
				pattern: {
					value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					message: ["wrongEmailFormatValid"],
				},
			})}
		/>
	),
};

export default popups;