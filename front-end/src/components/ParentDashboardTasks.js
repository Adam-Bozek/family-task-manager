import React, { useState } from 'react'; 
import styles from './css/ParentDashboardTasks.module.css';

const ParentDashboardTasks = () => {
  const [tasks, setTasks] = useState({
    Adam: ['Upratať izbu', 'Urobiť domáce úlohy', 'Napísať správu učiteľovi'], // Grouped tasks for Adam
    Janko: ['Vyvenčiť psa'],
    Marta: ['Urobiť domácu úlohu'],
   
    
  });

  const addTask = (name, newTask) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [name]: [...prevTasks[name], newTask], // Append new task to the existing tasks of the child
    }));
  };

  // Example: Adding a task for Adam (you can call this function with user input)
  // addTask('Adam', 'Nová úloha pre Adama');

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
            <button className={` ${styles["buttonCustom"]} my-1`}>Úlohy</button>
<button className={` ${styles["buttonCustom2"]} my-1`}>Vybrané odmeny</button>

            </div>
            <h3>Úlohy na splnenie dnes</h3>
            <div className={styles.tasksContainer}>
              {Object.entries(tasks).map(([name, taskList]) => (
                <div key={name} className={styles.userTaskGroup}>
                  <div className={styles.userSection}>
                    <span className={styles.userName}>{name}</span>
                    <div className={styles.taskList}>
                      {taskList.map((task, index) => (
                        <span key={index} className={styles.taskItem}>{task}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
           
            
            {/* Pridaný legendContainer do mainContainer */}
           
       
      
        
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
            </div>
    </>
  );
};

export default ParentDashboardTasks;
