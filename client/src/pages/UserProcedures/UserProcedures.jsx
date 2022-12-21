import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getProcedureByUserId } from "@/service/redusers/userProcedures.js";

import Filters from "./Filters/Filters.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./UserProcedures.module.css";

function UserProcedures() {
	const dispatch = useDispatch();
	const { user, userProcedures } = useSelector((state) => state);

	const [carts, setCarts] = useState([]);

	async function __init__() {
		if (!user.info) {
			return;
		}

		const _carts = await dispatch(getProcedureByUserId(user.info._id)).then(
			(res) => res.payload.data
		);

		setCarts(_carts);
	}

	useLayoutEffect(() => {
		return __init__;
	}, [user.info]);

	return (
		<div id={style.userProcedures}>
			<Filters
				cartsState={[carts, setCarts]}
			></Filters>
			<Presentation
				carts={carts}
				isLoadingContent={userProcedures.isLoading}
			></Presentation>
		</div>
	);
}

export { UserProcedures as default };
