import { memo } from "react";
import types from "prop-types";

import AvatarCanvas from "@/utils/genarateAvatar.js";

import constants from "./constants.js";

function Avatar({ id, userName }) {
	const avatarUrl = AvatarCanvas.getUrl(userName, constants.SIZE_AVATAR);

	return (
		<img
			id={id}
			src={avatarUrl}
			alt="userAvatar"
		/>
	);
}

Avatar.defaultProps = {
	id: "",
};

Avatar.propTypes = {
	id: types.string,
	userName: types.string.isRequired,
};

export default memo(Avatar);
