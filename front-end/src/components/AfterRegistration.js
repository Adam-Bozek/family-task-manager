import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./css/AfterRegistrationPage.module.css"; // Import CSS module

const AfterRegistration = () => {
  const [familyName, setFamilyName] = useState('');//Set family name
  const [familyCode, setFamilyCode] = useState('');
  
  const navigate = useNavigate(); 

  const handleFamilyCreation = () => {
    console.log('Rodina vytvorená:', familyName);
    // Add functionality for family creation
  };

  const handleJoinFamily = () => {
    console.log('Prihlásenie do rodiny pomocou kódu:', familyCode);
    // Add functionality for joining a family
  };

  return (
    <div className={styles.afterRegistrationContainer}>
      <h1 className={styles.title}>A je to!</h1>
      <p className={styles.description}>
        Ste prihlásený, ale prvým krokom je vytvorenie si rodiny alebo prihlásenie sa do už existujúcej
      </p>

      <div className={styles.formContainer}>
        <div className={styles.joinFamilySection}>
        <p className={styles.instructions}>Ak už máte kľúč na pridanie sa do rodiny tak ho zadajte sem.</p>
          <input
            type="text"
            placeholder="Kód"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.actionButton} onClick={handleJoinFamily}>
            Pridať sa k rodine
          </button>
        </div>

        <div className={styles.createFamilySection}>
        <p className={styles.instructions}>Ak nemáte ešte rodinu tak si ju vytvorte.</p>
          <input
            type="text"
            placeholder="Názov rodiny"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.actionButton} onClick={handleFamilyCreation}>
            Vytvoriť rodinu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfterRegistration;
