import types from "prop-types";

import { default as GoogleSrc } from "@/assets/image/google.svg";

GoogleSignin.propTypes = {
	onSuccess: types.func,
};

function GoogleSignin({ onSuccess }) {
	return (
		<button
			onClick={() => {
				onSuccess(); //!
			}}
			type="button"
		>
			<img
				src={GoogleSrc}
				alt="google"
			/>
		</button>
		// <Signin
		//     clientId={process.env.client_id}
		//     cookiePolicy="signle_host_origin"
		//     onSuccess={(res) => onSuccess(res.profileObj)}
		//     render={(props) =>

		//     }>
		// </Signin>
	);
}

export { GoogleSignin as default };
