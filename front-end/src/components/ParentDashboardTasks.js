import React, { useState } from 'react';
import styles from './css/ParentDashboardTasks.module.css';

const ParentDashboardTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Adam', task: 'Upratať izbu' },
    { id: 2, name: 'Eva', task: 'Vyvenčiť psa' },
  ]);

  return (
    <>
      <div className={styles["templateMain"]}>
        <div className={styles["blur-container"]}>
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

                <div className="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
                  <span className="navbar-brand col-lg-3 me-0" />
                  <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                    <li className="nav-item ">
                      <a className={`nav-link ${styles["nav-font-weight"]} active`} aria-current="page" href="#">
                        Domov
                      </a>
                    </li>
                    <li className="nav-item mx-4">
                      <a className={`nav-link ${styles["nav-font-weight"]}`} href="#">
                        Nastavenia
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className={`nav-link ${styles["nav-font-weight"]}`} aria-disabled="true">
                        Zadať úlohu
                      </a>
                    </li>
                  </ul>
                  <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                    <button className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}>Odhlásiť sa</button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
          <div className={styles.mainContainer}>
            <div className={styles.formContainer}>
              <button className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}>Úlohy</button>
              <button className={`btn btn-secondary ${styles["nav-button-weight"]} rounded-4 my-1`}>Vybrané odmeny</button>
              <h3>Úlohy na splnenie dnes</h3>
            </div>



            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Meno</th>
                  <th>Úloha</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.legendContainer}>
              <div className={styles.legend}>
                <span className={styles.legendItem}><span className={styles.completed}></span> Splnené</span>
                <span className={styles.legendItem}><span className={styles.notCompleted}></span> Nesplnené</span>
                <span className={styles.legendItem}><span className={styles.pending}></span> Čaká na potvrdenie</span>
                <span className={styles.legendItem}><span className={styles.notStarted}></span> Zatiaľ neurobené</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </>
  );
};

export default ParentDashboardTasks;
