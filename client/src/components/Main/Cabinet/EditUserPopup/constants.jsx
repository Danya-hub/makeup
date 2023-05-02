import Password from "./Password/Password.jsx";
import Email from "./Email/Email.jsx";

export const popups = {
	"password.username": () => (
		<Password
			purpose="changeUsernameByPassword"
			field="username"
		/>
	),
	"email.telephone": () => (
		<Email
			purpose="changeTelephoneByEmail"
			field="telephone"
		/>
	),
	"email.email": () => (
		<Email
			purpose="changeEmailByEmail"
			field="email"
		/>
	),
};

export const fields = [{
	changeBy: "password.username",
	field: "username",
}, {
	changeBy: "email.telephone",
	field: "telephone",
}, {
	changeBy: "email.email",
	field: "email",
}];