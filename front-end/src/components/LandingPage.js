import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./css/styleLandingPage.module.css";

const LandingPage = () => {
	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	return (
		<main className={style["landingPageMain"]}>
			<div className={`container row ${style["blur-container"]}`}>
				<h1 className={`text-start mx-5 mb-5 mt-4 ${style["welcome-header"]}`}> Vitajte! </h1>
				<div className="row p-4 text-start">
					<div className={`col-md-7 ${style["some-info"]}`}>
						<p className="mx-5">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quam eros, porttitor nec pulvinar ut, feugiat sed lectus. Curabitur tincidunt
							erat eu purus euismod, eget semper mauris sollicitudin. Quisque convallis est turpis. Mauris finibus vestibulum lorem, a malesuada magna
							feugiat ullamcorper. Phasellus scelerisque sem augue, non efficitur turpis egestas ac. Morbi malesuada mollis risus, nec condimentum magna
							hendrerit id.
						</p>
						<a
							href="/MoreInfo"
							className={`mx-5 ${style["landingPageLink"]}`}
							onClick={(e) => {
								e.preventDefault();
								handle_redirect("/MoreInfo");
							}}>
							Viac informácií tu.
						</a>
					</div>
					<div className="col-md-4 text-center m-3">
						<button className={`btn btn-primary btn-lg btn-dark my-2 ${style["landingPageButton"]}`} onClick={() => handle_redirect("/Login")}>
							Prihlásiť sa
						</button>
						<button className={`btn btn-primary btn-lg btn-dark my-2 ${style["landingPageButton"]}`} onClick={() => handle_redirect("/Register")}>
							Registrovať sa
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default LandingPage;
