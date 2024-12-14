import React, { useState, useContext, useEffect } from "react";
import styles from "../css/KidDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { getPoints, markTaskComplete } from "../kid/KidUtils";

import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";

const KidDashboard = () => {
	const [rewards, setRewards] = useState([]); // Stav pre odmeny

	const [tasks, setTasks] = useState([]); // Stav pre úlohy

	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);

	// Stav pre modálne okno (otvorené/zatvorené)
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null); // Vybraná úloha

	const [credits, setCredits] = useState({ value: 0 }); // Predvolene 0

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { tasks: serverTasks, rewards: serverRewards, credits: serverCredits } = await getPoints(email);

				// Normalize tasks: Map "uloha" to "name", fix missing status, and ensure valid data structure
				const normalizedTasks = serverTasks.map((task) => ({
					...task,
					name: task.uloha, // Rename "uloha" to "name"
					status: task.stav || "pending", // Add default status if missing
					cas_od: task.cas_od || "", // Ensure dates are not undefined
					cas_do: task.cas_do || "",
				}));

				setTasks(normalizedTasks);

				// Normalize rewards: Set a default status if missing
				const normalizedRewards = serverRewards.map((reward) => ({
					...reward,
					status: reward.status || "waiting",
				}));

				setRewards(normalizedRewards);

				// Set credits (ensure credits are defined)
				setCredits({ value: serverCredits || 0 });
			} catch (err) {
				console.error("Chyba pri načítaní dát:", err);
			}
		};

		fetchData();
	}, [email]);

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
	const handleConfirm = async (task_id) => {
		try {
			const ret = await markTaskComplete(task_id);

			if (ret) {
				setTasks((prevTasks) =>
					prevTasks.map(
						(task) => (task.id === task_id ? { ...task, status: "done" } : task), // Set status to "done"
					),
				);

				handleCloseModal(); // Close the modal after updating the task
			} else {
				alert("Úloha nebola potvrdená");
			}
		} catch (err) {
			console.error("Chyba pri splnení úlohy:", err);
		}
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
							{/* Počet kreditov */}
							<div className="navbar-brand col-lg-3 me-0 d-flex align-items-center">
								<span className={`fw-bold ${styles["credits"]}`}>{credits.value} Kreditov</span>
							</div>

							{/* Navigačné odkazy */}
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

							{/* Tlačidlo na odhlásenie */}
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
									className={`${styles.taskButton} ${styles[task.stav] || ""}`} // Dynamically apply styles based on task status
									onClick={task.stav === "notDone" || task.stav === "pending" ? () => handleOpenModal(task) : null}>
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
							{rewards.map((reward) => {
								// Set reward status as a string if it's a boolean
								const rewardStatus = typeof reward.status === "boolean" ? (reward.status ? "done" : "waiting") : reward.status || "waiting"; // Default to "waiting" if not defined

								return (
									<button
										key={reward.id}
										className={`${styles.taskButton} ${styles[rewardStatus]}`} // Apply dynamic class based on status
									>
										{reward.name || reward.uloha || reward.meno || "Bez názvu"} {/* Fallback for the reward's name */}
									</button>
								);
							})}
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
							<button onClick={() => handleConfirm(selectedItem.id)} className={styles.confirmButton}>
								Áno
							</button>
							<button onClick={() => handleCloseModal} className={styles.cancelButton}>
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
