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
							Naša aplikácia je navrhnutá tak, aby pomohla vašej rodine organizovať úlohy zábavným a motivačným spôsobom. Rodičia môžu jednoducho pridať
							úlohy pre deti, ktoré ich potom splnia a získajú za ne body. Tieto body môžu deti vymeniť za rôzne ceny podľa vlastného výberu! Aplikácia
							prináša rovnováhu medzi zodpovednosťou a odmenou, čím motivuje deti k aktívnemu zapájaniu sa do domácich prác. Začnite dnes a urobte
							organizáciu úloh zábavnejšou pre celú rodinu!
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
