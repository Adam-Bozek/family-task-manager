import React, { useState, useContext, useEffect } from "react";
import styles from "../css/ParentDashboardRewards.module.css";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";
import { getKidsRewards, confirmReward } from "./ParentUtils";

// Simulated method to mark the reward as confirmed
const markRewardComplete = async (child, reward, id) => {
	try {
		const res = await confirmReward(id);
		console.log(res);

		if (res) {
			console.log(`Reward for ${child} marked as completed: ${reward}`);
			return true;
		}
	} catch (err) {
		console.error("Error fetching rewards:", err);
		return false;
	}
};

const ParentDashboardRewards = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedReward, setSelectedReward] = useState(null);
	const [selectedRewardId, setSelectedRewardId] = useState(null); // New state for reward ID
	const [selectedChild, setSelectedChild] = useState(null);

	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);
	const navigate = useNavigate();

	// State for storing tasks (rewards grouped by child name)
	const [tasks, setTasks] = useState({});

	// Fetch rewards data and group by child name
	useEffect(() => {
		const fetchRewards = async () => {
			try {
				const rewards = await getKidsRewards(email);

				// Group rewards by child name
				const groupedRewards = rewards.reduce((acc, { name, reward, id, status }) => {
					if (!acc[name]) {
						acc[name] = [];
					}
					acc[name].push({ reward, id, status });
					return acc;
				}, {});

				setTasks(groupedRewards);
			} catch (err) {
				console.error("Error fetching rewards:", err);
			}
		};

		if (email) {
			fetchRewards();
		}
	}, [email]);

	const handle_redirect = (route) => {
		navigate(route);
	};

	const handleOpenModal = (child, reward, id) => {
		setSelectedChild(child);
		setSelectedReward(reward);
		setSelectedRewardId(id); // Store reward ID
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedReward(null);
		setSelectedRewardId(null); // Reset reward ID
		setSelectedChild(null);
		setIsModalOpen(false);
	};

	const handleConfirmReward = async (id) => {
		const success = await markRewardComplete(selectedChild, selectedReward, id);
		if (success) {
			handleCloseModal();
		} else {
			alert("Failed to confirm reward");
			setIsModalOpen(false);
		}
	};

	return (
		<>
					<div className={styles["templateMain"]}>
							<div className={styles["blur-container"]}>
								{/* Header with navigation */}
								<header className={`container my-3 ${styles["navbar-settings"]}`}>
									<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Thirteenth navbar example">
										<div className={`container-fluid`}>
											<button
												className="navbar-toggler"
												type="button"
												data-bs-toggle="collapse"
												data-bs-target="#navbarsExample11"
												aria-controls="navbarsExample11"
												aria-expanded="false"
												aria-label="Toggle navigation">
												<span className="navbar-toggler-icon"></span>
											</button>
			
											{/* Navbar items and links */}
											<div className="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
												<span className="navbar-brand col-lg-3 me-0" />
												<ul className="navbar-nav col-lg-6 justify-content-lg-center">
													<li className="nav-item ">
														<button
															className={`nav-link ${styles["nav-font-weight"]} active`}
															aria-current="page"
															onClick={() => handle_redirect("/ParentDashboardTasks")}>
															Domov
														</button>
													</li>
													<li className="nav-item mx-4">
														<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/ParentSettings")}>
															Nastavenia
														</button>
													</li>
													<li className="nav-item">
														<button className={`nav-link ${styles["nav-font-weight"]}`} onClick={() => handle_redirect("/ParentTasks")}>
															Zadať úlohu
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
										</div>
									</nav>
								</header>

					<div className={styles.mainContainer}>
						<div className={styles.formContainer}>
							<button className={`${styles["buttonTask"]} my-1`} onClick={() => handle_redirect("/ParentDashboardTasks")}>
								Úlohy
							</button>
							<button className={`${styles["buttonReward"]} my-1`} onClick={() => handle_redirect("/ParentDashboardRewards")}>
								Vybrané odmeny
							</button>
						</div>

						<h3>Úlohy na splnenie dnes</h3>
						<div className={styles.tasksContainer}>
							{Object.entries(tasks).map(([child, taskList]) => (
								<div key={child} className={styles.userTaskGroup}>
									<div className={styles.userSection}>
										<span className={styles.userName}>{child}</span>
										<div className={styles.taskList}>
											{taskList.map(({ reward, id, status }, index) => (
												<span
													key={index}
													className={`${styles.taskItem} ${styles[status]}`}
													onClick={() => handleOpenModal(child, reward, id)}>
													{reward}
												</span>
											))}
										</div>
									</div>
								</div>
							))}
						

						{/* Legend */}
						<div className={styles.legendContainer}>
							<div className={styles.legend}>
								<span className={styles.legendItem}>
									<span className={styles.completed}></span> Splnené
								</span>
								<span className={styles.legendItem}>
									<span className={styles.pending}></span> Čaká na potvrdenie
								</span>
							</div>
						</div>
					</div>
				</div>
				</div>
				{isModalOpen && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<h3>Potvrdiť dokončenie odmeny</h3>
							<p>{`Do you confirm the reward "${selectedReward}" for ${selectedChild}?`}</p>
							<button onClick={() => handleConfirmReward(selectedRewardId)} className={styles.confirmButton}>
								Potvrdiť
							</button>
							<button onClick={handleCloseModal} className={styles.cancelButton}>
								Zrušiť
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ParentDashboardRewards;
