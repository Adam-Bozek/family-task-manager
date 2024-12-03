import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ParentDashboardTasks.module.css";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";
import { getKidsTasks } from "./ParentUtils"; // Importing the getKidsTasks function

const ParentDashboardTasks = () => {
	// State to manage tasks fetched from the API
	const [tasks, setTasks] = useState({});
	const { email, setName, setIsLoggedIn, setEmail } = useContext(AppContext);
	const navigate = useNavigate();

	// Fetch tasks when the component mounts
	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const fetchedTasks = await getKidsTasks(email);

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
												Pridať úlohu
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
								Tasks
							</button>
							<button className={` ${styles["buttonReward"]} my-1`} onClick={() => handle_redirect("/ParentDashboardRewards")}>
								Selected Rewards
							</button>
						</div>

						<h3>Tasks to Complete Today</h3>
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
													<span key={index} className={styles.taskItem}>
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
										<span className={styles.completed}></span> Completed
									</span>
									<span className={styles.legendItem}>
										<span className={styles.notCompleted}></span> Not Completed
									</span>
									<span className={styles.legendItem}>
										<span className={styles.pending}></span> Pending Confirmation
									</span>
									<span className={styles.legendItem}>
										<span className={styles.notStarted}></span> Not Started
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ParentDashboardTasks;
