import { memo } from "react";
import types from "prop-types";

import AvatarCanvas from "@/utils/genarateAvatar.js";

import { SIZE_AVATAR } from "./constant.js";

Avatar.propTypes = {
	id: types.string,
	userName: types.string,
};

function Avatar({ id = "", userName }) {
	const avatarUrl = AvatarCanvas.getUrl(userName, SIZE_AVATAR);

	return (
		<img
			id={id}
			src={avatarUrl}
			alt="userAvatar"
		/>
	);
}

export default memo(Avatar);
