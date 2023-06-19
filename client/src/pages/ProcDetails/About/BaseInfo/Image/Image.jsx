import { useTranslation } from "react-i18next";

import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";

import style from "./Image.module.css";

function Image() {
	const { t } = useTranslation();

	return (
		<div className={style.image}>
			<button
				type="button"
				className="button"
				id={style.left}
			>
				<img
					src={LeftArrowSrc}
					alt="leftArrow"
				/>
			</button>
			<img
				src=""
				alt={t("noPhotos")}
				className={style.procImage}
			/>
			<button
				type="button"
				id={style.right}
				className="button"
			>
				<img
					src={RightArrowSrc}
					alt="rightArrow"
				/>
			</button>
		</div>
	);
}

export default Image;