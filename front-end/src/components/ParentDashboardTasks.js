import React from 'react';
import styles from './css/ParentDashboardTasks.module.css';

const ParentDashboardTasks = () => {
  return (
    <div className={styles.pageContainer}>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
        </nav>
     
      </header>
      <div className={styles.tableContainer}>
        <div className={styles.tabs}>
          <button className={styles.tabActive}>Úlohy</button>
          <button className={styles.tabInactive}>Vybrané odmeny</button>
        </div>
        <h3>Úlohy na splnenie dnes</h3>
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.completed}></span> Splnené</span>
        <span className={styles.legendItem}><span className={styles.notCompleted}></span> Nesplnené</span>
        <span className={styles.legendItem}><span className={styles.pending}></span> Čaká na potvrdenie</span>
        <span className={styles.legendItem}><span className={styles.notStarted}></span> Zatiaľ neurobené</span>
      </div>
    </div>
  );
};

export default ParentDashboardTasks;
