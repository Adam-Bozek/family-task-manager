import React from "react";

import style from "./css/TEMPLATE.module.css";

const TEMPLATE = () => {
	return (
		<div className={style["templateMain"]}>
			<div className={style["blur-container"]}>
				<header className={`container my-3 ${style["navbar-settings"]}`}>
					<nav className={`navbar navbar-expand-lg bg-body-tertiary p-2 rounded-4 ${style["background"]}`} aria-label="Thirteenth navbar example">
						<div className={`container-fluid `}>
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
										<a className={`nav-link ${style["nav-font-weight"]} active`} aria-current="page" href="#">
											Domov
										</a>
									</li>
									<li className="nav-item mx-4">
										<a className={`nav-link ${style["nav-font-weight"]}`} href="#">
											Nastavenia
										</a>
									</li>
									<li className="nav-item">
										<a className={`nav-link ${style["nav-font-weight"]}`} aria-disabled="true">
											Zadať úlohu
										</a>
									</li>
								</ul>
								<div className="d-lg-flex col-lg-3 justify-content-lg-end">
									<button className={`btn btn-dark ${style["nav-button-weight"]} rounded-4 my-1`}>Odhlásiť sa</button>
								</div>
							</div>
						</div>
					</nav>
				</header>
				<main className={`container my-5 ${style["navbar-settings"]}`}>
					<div className={` bg-body-tertiary rounded-4 p-5`}>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis faucibus erat quis diam commodo, vitae imperdiet felis elementum. Donec
							tristique lacus non felis mattis placerat. Pellentesque faucibus, risus sed lobortis feugiat, odio massa gravida odio, quis luctus est metus
							non purus. Pellentesque at dui risus. Etiam pretium pretium diam sit amet lobortis. Proin venenatis ut odio non sodales. Nullam commodo
							porttitor faucibus. Integer luctus facilisis nunc, elementum tristique mauris porta vitae. Sed vehicula tortor in tellus congue, hendrerit
							sagittis elit consectetur. In at dui lectus. Donec bibendum urna vel mauris sollicitudin, in ultrices orci maximus. Nulla tincidunt feugiat
							sem sit amet consequat. Duis sagittis, diam nec fringilla gravida, justo orci feugiat purus, ac sollicitudin nulla turpis vel tortor. Integer
							enim est, condimentum ut bibendum nec, posuere sit amet orci. Sed pellentesque est sapien, eget venenatis tortor dignissim non. Maecenas at
							nulla eget tellus aliquet dictum. Pellentesque non fringilla urna. Vivamus pellentesque ante at nibh ullamcorper congue. Praesent ornare
							imperdiet massa eu dictum. Fusce id ultrices nibh. Suspendisse tristique ultrices tortor ac viverra. Mauris iaculis ipsum sed leo convallis
							dapibus. Nam interdum tellus vel nulla vulputate finibus. Sed egestas ut purus ac porttitor. Integer scelerisque tincidunt bibendum. Nullam
							erat augue, tristique et molestie accumsan, tincidunt blandit nunc. Donec a malesuada sem. Cras hendrerit accumsan purus, in semper nibh
							vulputate vitae. Curabitur pellentesque imperdiet fermentum. Curabitur porta sollicitudin tellus, quis elementum tortor dignissim et. Sed et
							felis tortor. Aliquam venenatis viverra lectus, eu pretium ex vulputate eget. Aenean dignissim gravida orci, at tincidunt justo vestibulum a.
							Pellentesque lorem ante, vestibulum vel hendrerit a, semper eget nulla. Cras vulputate sapien ex, id interdum ex aliquet ac. Nulla ut orci
							quam. Donec vel mauris a quam cursus ultrices eu vel leo. Sed non volutpat tellus.
						</p>
					</div>
				</main>
			</div>
		</div>
	);
};

export default TEMPLATE;
