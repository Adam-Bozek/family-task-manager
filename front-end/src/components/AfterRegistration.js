import React, { useState } from "react";

const AfterRegistration = () => {
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');

  const handleFamilyCreation = () => {
    console.log('Family created:', familyName);
    // Add functionality for family creation
  };

  const handleJoinFamily = () => {
    console.log('Joining family with code:', familyCode);
    // Add functionality for joining a family
  };

  return (
    <div className="after-registration-container">
      <h1 className="title">A je to!</h1>
      <p className="description">
        Ste prihlásený ale prvým krokom je vytvorenie si rodiny alebo
        prihlásenie sa do už existujúcej
      </p>

      <div className="form-container">
        <div className="join-family-section">
          <input
            type="text"
            placeholder="Kód"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className="input-field"
          />
          <button className="action-button" onClick={handleJoinFamily}>
            Pridať sa k rodine
          </button>
        </div>

        <div className="create-family-section">
          <input
            type="text"
            placeholder="Názov rodiny"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="input-field"
          />
          <button className="action-button" onClick={handleFamilyCreation}>
            Vytvoriť rodinu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfterRegistration;