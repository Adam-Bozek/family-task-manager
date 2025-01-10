import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./css/styleMoreInfo.module.css";

const MoreInfo = () => {
	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	return (
		<main className={style["moreInfoMain"]}>
			<div className={`container row ${style["blur-container"]}`}>
				<div className="col-md-6 text-start">
					<h1 className={`mx-5 mb-2 mt-4 ${style["welcome-header"]}`}> Info. </h1>
					<p className={`mx-5 ${style["some-info"]}`}>
					<h2>Ako to funguje?</h2>
<ol>
  <li>
    <strong>Pridávanie úloh:</strong> Rodič pridá úlohu do systému a priradí jej body, ktoré dieťa získa po jej splnení.
  </li>
  <li>
    <strong>Splnenie úlohy:</strong> Dieťa vykoná úlohu, zaznamená jej splnenie v aplikácii a rodič potvrdí pridelenie bodov.
  </li>
  <li>
    <strong>Získavanie odmien:</strong> Získané body môžu byť vymenené za rôzne odmeny, ktoré rodič prispôsobí podľa preferencií detí.
  </li>
  <li>
    <strong>Motivácia a zodpovednosť:</strong> Tento systém podporuje pozitívne správanie a motivuje deti k plneniu úloh výmenou za odmeny.
  </li>
  <li>
    <strong>Prehľad a kontrola:</strong> Rodičia majú prehľad o splnených úlohách, pridelených bodoch a vymenených odmenách.
  </li>
</ol>
				</p>
				</div>
				<div className="col-md-6">
					<div className="text-end mx-5">
						<i className={`bi bi-arrow-right-short ${style["moreInfoIcon"]}`} onClick={() => handle_redirect("/Home")}></i>
					</div>
					<p className={`mx-5 text-start ${style["some-info"]}`}>
					<h2>Výhody tohto systému:</h2>
      <ul>
        <li><strong>Motivácia cez odmeny:</strong> Deti sú viac motivované, keď vedia, že za svoju prácu môžu získať niečo, čo si želajú.</li>
        <li><strong>Učenie zodpovednosti:</strong> Systém pomáha deťom rozvíjať zodpovednosť a schopnosť plniť úlohy v stanovených termínoch.</li>
        <li><strong>Flexibilita pre rodičov:</strong> Rodičia môžu prispôsobiť úlohy, body a ceny podľa potrieb a záujmov rodiny.</li>
        <li><strong>Prehľad a kontrola:</strong> Aplikácia poskytuje jednoduchý spôsob, ako sledovať pokrok detí a kontrolovať splnenie úloh.</li>
        <li><strong>Zábava a organizácia:</strong> Proces sa stáva zábavný a interaktívny, čím pomáha deťom naučiť sa organizovať svoj čas a povinnosti.</li>
      </ul>

      <p>
        Tento systém je skvelým nástrojom pre rodiny, ktoré hľadajú spôsob, ako zlepšiť domácu organizáciu a zároveň udržať deti motivované a zapojené do každodenných úloh. Je to jednoduchý spôsob, ako urobiť každodenné povinnosti zábavné a podporiť zodpovednosť a spoluprácu v rodine.
      </p>
					</p>
				</div>
			</div>
		</main>
	);
};

export default MoreInfo;
