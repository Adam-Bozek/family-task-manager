import React, { useState, useContext } from "react";
import styles from "./css/KidDashboard.module.css";
import { useNavigate } from "react-router-dom";

import { logOutUser } from "./utilities/Utils";
import { AppContext } from "./utilities/AppContext";

const KidDashboard = () => {
	// Stav úloh
	const [tasks, setTasks] = useState([
		{ id: 1, name: "Vyniesť smeti", status: "done" }, // Splnené
		{ id: 2, name: "Povysávať", status: "waiting" }, // Čaká na potvrdenie
		{ id: 3, name: "Umyť podlahu", status: "notDone" }, // Nesplnené
		{ id: 4, name: "Povysávať", status: "pending" }, // Zatiaľ neurobené
	]);

	const { setName, setIsLoggedIn, setEmail } = useContext(AppContext);

	// Stav pre modálne okno (otvorené/zatvorené)
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null); // Vybraná úloha

	// Otvorí modálne okno pre konkrétnu úlohu
	const handleOpenModal = (item) => {
		setSelectedItem(item); // Nastaví vybranú úlohu
		setIsModalOpen(true); // Zobrazí modálne okno
	};

	// Zavrie modálne okno
	const handleCloseModal = () => {
		setSelectedItem(null); // Vyčistí výber úlohy
		setIsModalOpen(false); // Skryje modálne okno
	};

	// Potvrdí splnenie úlohy
	const handleConfirm = () => {
		setTasks((prevTasks) =>
			prevTasks.map(
				(task) => (task.id === selectedItem.id ? { ...task, status: "waiting" } : task), // Zmení stav úlohy na "waiting"
			),
		);
		handleCloseModal(); // Zavrie modálne okno
	};

	const navigate = useNavigate();
	const handle_redirect = (route) => {
		navigate(route);
	};

	return (
		<div className={styles.mainContainer}>
			{/* Pozadie a hlavička */}
			<div className={styles.blurContainer}>
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
										<button
											className={`nav-link ${styles["nav-font-weight"]} active`}
											aria-current="page"
											onClick={() => handle_redirect("/KidDashboard")}>
											Domov
										</button>
									</li>
									<li className="nav-item mx-4">
										<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/KidRewardExchange")}>
											Obchod
										</button>
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

				{/* Sekcia úloh */}
				<div className={styles.content}>
					<section className={styles.tasks}>
						<h2>Ahoj Janko!</h2>
						<h5>Tieto úlohy treba splniť dnes, nezabudni!</h5>

						{/* Zoznam úloh */}
						<div className={styles.tasksList}>
							{tasks.map((task) => (
								<button
									key={task.id}
									className={`${styles.taskButton} ${styles[task.status]}`} // Nastavenie farby podľa stavu
									onClick={
										task.status === "notDone" || task.status === "pending"
											? () => handleOpenModal(task) // Povolenie kliknutia iba na nesplnené úlohy
											: null
									}>
									{task.name}
								</button>
							))}
						</div>

						{/* Legenda úloh */}
						<div className={styles.legend}>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.done}`} /> Splnené
							</div>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.notDone}`} /> Nesplnené
							</div>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.waiting}`} /> Čaká na potvrdenie
							</div>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.pending}`} /> Zatiaľ neurobené
							</div>
						</div>
					</section>
				</div>

				{/* Sekcia odmien */}
				<div className={styles.content}>
					<section className={styles.rewards}>
						<h2>Aktivované odmeny:</h2>
						<div className={styles.rewardsList}>
							<button className={`${styles.rewardButton} ${styles.done}`}>Sladkosť</button>
							<button className={`${styles.rewardButton} ${styles.waiting}`}>5€</button>
						</div>

						{/* Legenda odmien */}
						<div className={styles.legend}>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.done}`} /> Splnené
							</div>
							<div className={styles.legendItem}>
								<span className={`${styles.circle} ${styles.waiting}`} /> Čakajúce na splnenie
							</div>
						</div>
					</section>
				</div>

				{/* Modálne okno */}
				{isModalOpen && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<h3>Označiť ako splnené?</h3>
							<p>{selectedItem?.name}</p>
							<button onClick={handleConfirm} className={styles.confirmButton}>
								Áno
							</button>
							<button onClick={handleCloseModal} className={styles.cancelButton}>
								Zrušiť
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default KidDashboard;
