import React, { useState, useContext, useEffect } from "react";
import styles from "../css/KidDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { getPoints } from "../kid/KidUtils";

import { logOutUser } from "../utilities/Utils";
import { AppContext } from "../utilities/AppContext";

const KidDashboard = () => {
  const { email } = useContext(AppContext); // Získanie emailu z kontextu

  const [rewards, setRewards] = useState([]); // Stav pre odmeny
  
  const [tasks, setTasks] = useState([]); // Stav pre úlohy

  const { setName, setIsLoggedIn, setEmail } = useContext(AppContext);

  // Stav pre modálne okno (otvorené/zatvorené)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Vybraná úloha

  const [credits, setCredits] = useState({ value: 0 }); // Predvolene 0
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const { tasks: serverTasks, rewards: serverRewards, credits: serverCredits } = await getPoints(email);

            // Nastavenie úloh
            if (serverTasks && serverTasks.length > 0) {
                setTasks(serverTasks);
            } else {
                console.warn("Neboli nájdené žiadne úlohy.");
            }

            // Nastavenie odmien
            if (serverRewards && serverRewards.length > 0) {
                setRewards(serverRewards);
            } else {
                console.warn("Neboli nájdené žiadne odmeny.");
            }

            // Nastavenie kreditov (ako číslo)
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
  const handleConfirm = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedItem.id ? { ...task, status: "waiting" } : task
      )
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
          <nav
            className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`}
            aria-label="Navbar"
          >
            <div className="container-fluid">
              {/* Počet kreditov */}
              <div className="navbar-brand col-lg-3 me-0 d-flex align-items-center">
    <span className={`fw-bold ${styles["credits"]}`}>
        {credits.value} Kreditov
    </span>
</div>

              {/* Navigačné odkazy */}
              <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles["nav-font-weight"]} active`}
                    aria-current="page"
                    onClick={() => handle_redirect("/KidDashboard")}
                  >
                    Domov
                  </button>
                </li>
                <li className="nav-item mx-4">
                  <button
                    className={`nav-link ${styles["nav-font-weight"]}`}
                    onClick={() => handle_redirect("/KidRewardExchange")}
                  >
                    Obchod
                  </button>
                </li>
              </ul>

              {/* Tlačidlo na odhlásenie */}
              <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                <button
                  className={`btn btn-dark ${styles["nav-button-weight"]} rounded-4 my-1`}
                  onClick={() => logOutUser(setName, setIsLoggedIn, setEmail)}
                >
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
          className={`${styles.taskButton} ${styles[task.status]}`} // Nastavenie farby podľa stavu
          onClick={task.status === "notDone" || task.status === "pending" ? () => handleOpenModal(task) : null}
        >
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
  {rewards.map((reward) => (
    <button
	
	className={`${styles.taskButton} ${styles[reward.status]}`} // Nastavenie farby podľa stavu
	
  >
	{reward.name}
  </button>
  ))}
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
