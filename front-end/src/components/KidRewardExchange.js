import React, { useState, useContext } from 'react';
import styles from './css/KidRewardExchange.module.css';

import { logOutUser } from "./utilities/Utils";
import { AppContext } from "./utilities/AppContext";

const KidRewardExchange = ({ userName }) => {
  // State to track user's total credits and rewards available for exchange
  const [credits, setCredits] = useState(120); // Example starting credits
  const rewards = [
    { name: 'PC - 30 minút', cost: 20 },
    { name: 'PlayStation - 20 minút', cost: 50 },
    { name: '5€', cost: 80 },
    { name: 'Sladkosť', cost: 15 },
    { name: 'Slanosť', cost: 15 },
  ];

  const { setName, setIsLoggedIn, setEmail } = useContext(AppContext);

  const handleRedeem = (cost) => {
    if (credits >= cost) {
      setCredits(credits - cost);
      alert('Reward redeemed successfully!');
    } else {
      alert('Not enough credits to redeem this reward.');
    }
  };

  return (
    <div className={styles["templateMain"]}>
      <div className={styles["blur-container"]}>
      <header className={`container my-3 ${styles["navbar-settings"]}`}>
					<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Navbar">
						<div className="container-fluid">
							{/* Tlačidlo pre mobilné zobrazenie */}
							<button
								className="navbar-toggler"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#navbarsExample12"
								aria-controls="navbarsExample12"
								aria-expanded="false"
								aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse d-lg-flex" id="navbarsExample12">
								{/* Počet kreditov */}
								<div className="navbar-brand col-lg-3 me-0 d-flex align-items-center">
									<span className={`fw-bold ${styles["credits"]}`}>120 Kreditov</span>
								</div>

								{/* Navigačné odkazy */}
								<ul className="navbar-nav col-lg-6 justify-content-lg-center">
									<li className="nav-item">
										<a className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" href="#">
											Domov
										</a>
									</li>
									<li className="nav-item mx-4">
										<a className={`nav-link ${styles["nav-font-weight"]}`} href="#">
											Obchod
										</a>
									</li>
								</ul>

								{/* Tlačidlo na odhlásenie */}
								<div className="d-lg-flex col-lg-3 justify-content-lg-end">
									<button
										className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}
										onClick={() => logOutUser(setName, setIsLoggedIn, setEmail)}>
										Odhlásiť sa
									</button>
								</div>
							</div>
						</div>
					</nav>
				</header>

      {/* Welcome and Rewards Table */}
      <div className={styles["mainContainer"]}>
          <h2 className={styles["welcomeText"]}>Ahoj {userName}!</h2>
          <p className={styles["instructions"]}>
            Tu si môžeš nazbierané kredity vymeniť za odmenu!
          </p>
          <table className={styles.rewardsTable}>
            <thead>
              <tr>
                <th>Odmena</th>
                <th>Cena Odmeny</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward, index) => (
                <tr key={index} className={styles.rewardRow}>
                  <td>{reward.name}</td>
                  <td>{reward.cost} kreditov</td>
                  <td>
                    <button
                      className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4`}
                      onClick={() => handleRedeem(reward.cost)}
                      disabled={credits < reward.cost}>
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
