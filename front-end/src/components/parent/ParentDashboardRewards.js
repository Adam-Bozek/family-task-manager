import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ParentDashboardTasks.module.css";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";
import { getKidsTasks, confirmTask } from "./ParentUtils"; // Importing the getKidsTasks function

const ParentDashboardTasks = () => {
	// State to manage tasks fetched from the API
	const [tasks, setTasks] = useState({});
	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);
	const navigate = useNavigate();

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null); // Store selected task details

	// Fetch tasks when the component mounts
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const fetchedTasks = await getKidsTasks(email);

				console.log(fetchedTasks);

				// Group tasks by the child's name
				const groupedTasks = fetchedTasks.reduce((acc, task) => {
					if (!acc[task.name]) acc[task.name] = [];
					acc[task.name].push(task);
					return acc;
				}, {});

				setTasks(groupedTasks);
			} catch (err) {
				console.error("Error fetching tasks:", err);
			}
		};

		fetchTasks();
	}, [email]);

	// Navigate to a different route
	const handle_redirect = (route) => {
		navigate(route);
	};

	// Open the modal when a "waiting" task is clicked
	const handleOpenModal = (task) => {
		if (task.status === "waiting") {
			setSelectedTask(task); // Store the task details
			setIsModalOpen(true); // Open the modal
		}
	};

	// Close the modal
	const handleCloseModal = () => {
		setSelectedTask(null); // Reset selected task
		setIsModalOpen(false); // Close the modal
	};

	// Confirm the task completion (implement the actual functionality as needed)
	const handleConfirmTask = async () => {
		const success = await confirmTask(selectedTask.task_id);
		if (success) {
			handleCloseModal();
		} else {
			alert("Failed to confirm reward");
			setIsModalOpen(false);
		}

		handleCloseModal(); // Close the modal after confirming
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
											Logout
										</button>
									</div>
								</div>
							</div>
						</nav>
					</header>

					{/* Main content area for tasks */}
					<div className={styles.mainContainer}>
						<div className={styles.formContainer}>
							{/* Buttons for navigating to different sections */}
							<button className={` ${styles["buttonTask"]} my-1`} onClick={() => handle_redirect("/ParentDashboardTasks")}>
								Úlohy
							</button>
							<button className={` ${styles["buttonReward"]} my-1`} onClick={() => handle_redirect("/ParentDashboardRewards")}>
								Vybrané odmeny
							</button>
						</div>

						<h3>Úlohy na splnenie dnes</h3>
						<div className={styles.tasksContainer}>
							{/* Display each child's name and list of tasks */}
							{Object.entries(tasks).length === 0 ? (
								<p>No tasks assigned yet.</p>
							) : (
								Object.entries(tasks).map(([name, taskList]) => (
									<div key={name} className={styles.userTaskGroup}>
										<div className={styles.userSection}>
											<span className={styles.userName}>{name}</span>
											<div className={styles.taskList}>
												{taskList.map((task, index) => (
													<span
														key={index}
														className={styles.taskItem}
														onClick={() => handleOpenModal(task)} // Open modal on task click
													>
														{task.task} - {task.status}
													</span>
												))}
											</div>
										</div>
									</div>
								))
							)}

							{/* Legend to describe the status of each task */}
							<div className={styles.legendContainer}>
								<div className={styles.legend}>
									<span className={styles.legendItem}>
										<span className={styles.completed}></span> Splnené
									</span>
									<span className={styles.legendItem}>
										<span className={styles.notCompleted}></span> Nesplnené
									</span>
									<span className={styles.legendItem}>
										<span className={styles.pending}></span> Čaká na potvrdenie
									</span>
									<span className={styles.legendItem}>
										<span className={styles.notStarted}></span> Zatiaľ neurobené
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal for confirming task */}
			{isModalOpen && selectedTask && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<h3>Confirm Task Completion</h3>
						<p>{`Do you confirm the task "${selectedTask.task}" for ${selectedTask.name}?`}</p>
						<button onClick={handleConfirmTask} className={styles.confirmButton}>
							Confirm
						</button>
						<button onClick={handleCloseModal} className={styles.cancelButton}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ParentDashboardTasks;
