import React, { useState } from "react";
import styles from "./css/ParentSettings.module.css";

const ParentSettings = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [rewards, setRewards] = useState([
    { name: "PC - 30 minút", price: 20 },
  ]);
  const [newReward, setNewReward] = useState({ name: "", price: "" });

  const handleAddReward = (event) => {
    event.preventDefault();
    if (newReward.name && newReward.price) {
      setRewards([...rewards, { name: newReward.name, price: parseInt(newReward.price) }]);
      setNewReward({ name: "", price: "" });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "members":
        return (
          <div className={styles.membersContainer}>
            <div className={styles.column}>
              <div className={styles.memberList}>
                <h2>Pridaní členovia</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th><h4>Člen</h4></th>
                      <th><h4>Email člena</h4></th>
                      <th><h4>Rola</h4></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Janko</td>
                      <td>janko@gmail.com</td>
                      <td>Dieťa</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className={`${styles.infoText} ${styles.leftText}`}>Kód na pridanie rodiča:</p>
            </div>
            <div className={styles.column}>
              <div className={styles.removeMember}>
                <h3>Odobrať člena</h3>
                <form>
                  <select className={styles.inputField}>
                    <option>Meno</option>
                  </select>
                  <input type="email" placeholder="Email" className={styles.inputField} />
                  <input type="text" placeholder="Rola" className={styles.inputField} />
                  <button type="submit" className={styles.submitButton}>Potvrdiť</button>
                </form>
              </div>
              <p className={`${styles.infoText} ${styles.rightText}`}>Kód na pridanie dieťaťa:</p>
            </div>
          </div>
        );
  
      case "rewards":
        return (
          <div className={styles.rewardsContainer}>
            <div className={styles.column}>
              <div className={styles.rewardList}>
                <h2>Nastavené odmeny</h2>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th><h4>Odmena</h4></th>
                      <th><h4>Cena Odmeny</h4></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward, index) => (
                      <tr key={index}>
                        <td>{reward.name}</td>
                        <td>{reward.price} kreditov</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
            </div>
            <div className={styles.column}>
              <div className={styles.addReward}>
                <h3>Pridať odmenu</h3>
                <form onSubmit={handleAddReward}>
                  <input
                    type="text"
                    placeholder="Odmena"
                    className={styles.inputField}
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Cena"
                    className={styles.inputField}
                    value={newReward.price}
                    onChange={(e) => setNewReward({ ...newReward, price: e.target.value })}
                  />
                  <button type="submit" className={styles.submitButton}>Pridať odmenu</button>
                </form>
              </div>
              
            </div>
          </div>
        );
  
      case "cancel":
        return (
          <div className={styles.cancelFamily}>
            <h2>Naozaj si prajete zrušiť rodinu?</h2>
            <button className={styles.cancelButton}>Áno</button>
          </div>
        );
  
      default:
        return null;
    }
  };

  return (
      <main className={styles.mainContainer}>
        <div className={styles.blurContainer}> 
          <header className={`container my-3 ${styles["navbar-settings"]}`}>
            <nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${styles["background"]}`} aria-label="Navbar">
              <div className={`container-fluid`}>
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
                  <span className="navbar-brand col-lg-3 me-0" />
                  <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                    <li className="nav-item">
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
          <div className={styles.content}>
            <div className={styles.navbar}>
              <button className={activeTab === "members" ? styles.activeTab : ""} onClick={() => setActiveTab("members")}>Členovia</button>
              <button className={activeTab === "rewards" ? styles.activeTab : ""} onClick={() => setActiveTab("rewards")}>Odmeny</button>
              <button className={activeTab === "cancel" ? styles.activeTab : ""} onClick={() => setActiveTab("cancel")}>Zrušenie rodiny</button>
            </div>
            
            {renderTabContent()}
          
          </div>
        </div>
      </main>
  );
};

export default ParentSettings;
