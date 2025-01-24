import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../utilities/AppContext";
import { getExchangedRewards, getRewards } from "./KidUtils";
import { logOutUser } from "../utilities/Utils";

import styles from "../css/KidRewardExchange.module.css";

const KidRewardExchange = ({ userName }) => {
	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);
	const [credits, setCredits] = useState(0); // Dynamicky aktualizované kredity
	const [rewards, setRewards] = useState([]); // Odmeny načítané z backendu

	useEffect(() => {
		// Načítanie odmien pri načítaní komponentu
		const fetchRewards = async () => {
			try {
				const { remainingCredits, rewards } = await getRewards(email);
				if (rewards && remainingCredits !== undefined) {
					setCredits(remainingCredits); // Nastavenie kreditov
					setRewards(rewards); // Nastavenie odmien
				} else {
					console.warn("Žiadne dostupné odmeny alebo kredity.");
				}
			} catch (error) {
				console.error("Chyba pri načítaní odmien:", error);
			}
		};

		fetchRewards();
	}, [email]);

	const handleRedeem = async (reward) => {
		if (credits >= reward.price) {
			try {
				await getExchangedRewards(email, reward.id, credits - reward.price);

				// Opätovné načítanie údajov používateľa
				const { remainingCredits, rewards } = await getRewards(email);
				setCredits(remainingCredits); // Aktualizácia kreditov
				setRewards(rewards); // Aktualizácia odmien

				alert(`Úspešne ste si vymenili odmenu: ${reward.name}`);
			} catch (error) {
				console.error("Chyba:", error);
				alert("Pri výmene odmeny nastala chyba.");
			}
		} else {
			alert("Nedostatok kreditov na výmenu tejto odmeny.");
		}
	};

	const navigate = useNavigate();
	const handle_redirect = (route) => {
		navigate(route);
	};

	return (
		<div className={styles["templateMain"]}>
			<div className={styles["blur-container"]}>
				<header className={`container my-3 ${styles["navbar-settings"]}`}>
									<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Navbar">
										<div className="container-fluid">
											<div className="navbar-brand col-lg-3 me-0 d-flex align-items-center">
												<span className={`fw-bold ${styles["credits"]}`}>{credits} Kreditov</span>
											</div>
											<ul className="navbar-nav col-lg-6 justify-content-lg-center">
												<li className="nav-item">
													<button className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" onClick={() => handle_redirect("/KidDashboard")}>
														Domov
													</button>
												</li>
												<li className="nav-item mx-4">
													<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/KidRewardExchange")}>
														Obchod
													</button>
												</li>
											</ul>
											<div className="d-lg-flex col-lg-3 justify-content-lg-end">
												<button
													className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}
													onClick={() => logOutUser(setName, setIsLoggedIn, setEmail)}>
													Odhlásiť sa
												</button>
											</div>
										</div>
									</nav>
								</header>

				<div className={styles["mainContainer"]}>
					<h2 className={styles["welcomeText"]}>Ahoj {userName}!</h2>
					<p className={styles["instructions"]}>Vymieňaj svoje kredity za odmeny!</p>
					<table className={styles["rewardsTable"]}>
						<thead>
							<tr>
								<th>Odmena</th>
								<th>Cena</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{rewards.map((reward, index) => (
								<tr key={index} className={styles["rewardRow"]}>
									<td>{reward.name}</td>
									<td>{reward.price} kreditov</td>
									<td>
										<button
											className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4`}
											onClick={() => handleRedeem(reward)}
											disabled={credits < reward.price}>
											Vymeniť
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default KidRewardExchange;
