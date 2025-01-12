import React, { useState, useContext, useEffect } from "react";
import styles from "../css/KidDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { getPoints, markTaskComplete,markTaskMine } from "../kid/KidUtils";
import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";

const KidDashboard = () => {
	const [rewards, setRewards] = useState([]); // Rewards state
	const [tasks, setTasks] = useState([]); // Tasks state
	const [tasksToChooseFrom, setTasksToChooseFrom] = useState([]); // Tasks to choose from state
	const { name, email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);
	const [credits, setCredits] = useState({ value: 0 }); // Credits state

	const [isModalOpen, setIsModalOpen] = useState(false); // Modal for task completion
	const [isTakeTaskModalOpen, setIsTakeTaskModalOpen] = useState(false); // Modal for taking a task
	const [selectedItem, setSelectedItem] = useState(null); // Selected task for completion
	const [selectedTaskToTake, setSelectedTaskToTake] = useState(null); // Selected task to take

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { tasks: serverTasks, tasksToChooseFrom: serverTasksToChooseFrom, rewards: serverRewards, credits: serverCredits } = await getPoints(email);

				const normalizedTasks = (serverTasks || []).map((task) => ({
					...task,
					name: task.uloha,
					status: task.stav || "pending",
					cas_od: task.cas_od || "",
					cas_do: task.cas_do || "",
				}));
				setTasks(normalizedTasks);

				const normalizedTasksToChooseFrom = (serverTasksToChooseFrom || []).map((tasksToChooseFrom) => ({
					...tasksToChooseFrom,
					name: tasksToChooseFrom.uloha,
					status: tasksToChooseFrom.stav || "pending",
				}));
				setTasksToChooseFrom(normalizedTasksToChooseFrom);

				const normalizedRewards = serverRewards.map((reward) => ({
					...reward,
					status: reward.status || "waiting",
				}));
				setRewards(normalizedRewards);

				setCredits({ value: serverCredits || 0 });
			} catch (err) {
				console.error("Error loading data:", err);
			}
		};

		fetchData();
	}, [email]);

	const handle_redirect = (route) => {
		navigate(route);
	};

	const getStatusTitle = (status) => {
		switch (status) {
			case "notDone":
				return "Nesplnené";
			case "pending":
				return "Zatiaľ neurobené";
			case "done":
				return "Splnené";
			case "waiting":
				return "Čaká na potvrdenie";
			default:
				return "Iné";
		}
	};

	const handleOpenModal = (item) => {
		setSelectedItem(item);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedItem(null);
		setIsModalOpen(false);
	};

	const handleConfirm = async (task_id) => {
		try {
			const ret = await markTaskComplete(task_id);

			if (ret) {
				setTasks((prevTasks) => prevTasks.map((task) => (task.id === task_id ? { ...task, stav: "waiting" } : task)));
				handleCloseModal();
			} else {
				alert("Úloha nebola potvrdená");
			}
		} catch (err) {
			console.error("Error marking task as complete:", err);
		}
	};

	const handleOpenModalTakeTask = (task) => {
		setSelectedTaskToTake(task);
		setIsTakeTaskModalOpen(true);
	};

	const handleCloseTakeTaskModal = () => {
		setSelectedTaskToTake(null);
		setIsTakeTaskModalOpen(false);
	};

	const handleConfirmTakeTask = async (task_id) => {
		try {
			const ret = await markTaskMine(email, task_id); // Replace with the actual function for taking the task

			if (ret) {
				// Add the task to the "pending" category
				setTasks((prevTasks) => [...prevTasks, { ...selectedTaskToTake, stav: "pending" }]);

				// Remove the task from tasksToChooseFrom
				setTasksToChooseFrom((prevTasks) => prevTasks.filter((task) => task.id !== task_id));

				handleCloseTakeTaskModal();
			} else {
				alert("Úloha nebola prevzatá");
			}
		} catch (err) {
			console.error("Error taking task:", err);
		}
	};

	return (
		<div className={styles.mainContainer}>
			{/* Navbar and Credits Section */}
			<div className={styles.blurContainer}>
				<header className={`container my-3 ${styles["navbar-settings"]}`}>
					<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Navbar">
						<div className="container-fluid">
							<div className="navbar-brand col-lg-3 me-0 d-flex align-items-center">
								<span className={`fw-bold ${styles["credits"]}`}>{credits.value} Kreditov</span>
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

				{/* Task Section */}
				<div className={styles.content}>
					<section className={styles.tasks}>
						<h2>Ahoj {name}!</h2>
						<h5>Tieto úlohy treba splniť, nezabudni!</h5>
						<div className={styles.boards}>
							{["pending", "waiting", "done", "notDone"].map((status) => (
								<div key={status} className={styles.board}>
									<h3>{getStatusTitle(status)}</h3>
									<div className={styles.tasksList}>
										{tasks
											.filter((task) => task.stav === status)
											.map((task) => (
												<button
													key={task.id}
													className={`${styles.taskButton} ${styles[task.stav] || ""}`}
													onClick={status === "notDone" || status === "pending" ? () => handleOpenModal(task) : null}>
													{task.name}
												</button>
											))}
									</div>
								</div>
							))}
						</div>
					</section>
				</div>

				{/* Tasks to Choose From Section */}
				<div className={styles.content}>
					<section className={styles.tasksToChooseFrom}>
						<h5>Z týchto úloh si môžeš vybrať:</h5>
						<div className={styles.tasksList}>
							{tasksToChooseFrom.map((task) => (
								<button
									key={task.id}
									className={`${styles.taskButton} ${styles[task.stav] || ""}`}
									onClick={task.stav === "notDone" || task.stav === "pending" ? () => handleOpenModalTakeTask(task) : null}>
									{task.name}
								</button>
							))}
						</div>
					</section>
				</div>

				{/* Rewards Section */}
				<div className={styles.content}>
					<section className={styles.rewards}>
						<h2>Aktivované odmeny:</h2>
						<div className={styles.rewardsList}>
							{rewards.map((reward) => {
								const rewardStatus = typeof reward.status === "boolean" ? (reward.status ? "done" : "waiting") : reward.status || "waiting";
								return (
									<button key={reward.id} className={`${styles.taskButton} ${styles[rewardStatus]}`}>
										{reward.name || reward.uloha || reward.meno || "Bez názvu"}
									</button>
								);
							})}
						</div>
					</section>
				</div>
			</div>

			{/* Modals */}
			{isModalOpen && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h3>Chceš označiť úlohu ako splnenú?</h3>
						<p>{selectedItem?.name}</p>
						<button onClick={() => handleConfirm(selectedItem.id)} className={styles.confirmButton}>
							Áno
						</button>
						<button onClick={handleCloseModal} className={styles.cancelButton}>
							Zrušiť
						</button>
					</div>
				</div>
			)}

			{isTakeTaskModalOpen && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h3>Chceš prevziať túto úlohu?</h3>
						<p>{selectedTaskToTake?.name}</p>
						<button onClick={() => handleConfirmTakeTask(selectedTaskToTake.id)} className={styles.confirmButton}>
							Áno
						</button>
						<button onClick={handleCloseTakeTaskModal} className={styles.cancelButton}>
							Zrušiť
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default KidDashboard;
