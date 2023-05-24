import MenuPdf from "@/assets/pdf/menu.pdf";
import MenuSrc from "@/assets/image/menu.svg";

import "./MyServices.module.css";

function MyServices() {
	return (
		<div>
			<a
				href={MenuPdf}
				target="_blank"
				rel="noreferrer"
			>
				<img
					src={MenuSrc}
					alt="services"
				/>
				<i
					className="fa fa-search-plus"
					aria-hidden="true"
				/>
			</a>
		</div>
	);
}

export default MyServices;