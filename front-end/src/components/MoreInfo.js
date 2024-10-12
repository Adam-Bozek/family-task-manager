import React from "react";
import { useNavigate } from "react-router-dom";

import "./css/MoreInfo.css";

const MoreInfo = () => {
	const navigate = useNavigate();

	const handle_redirect = (route) => {
		navigate(route);
	};

	return (
		<main>
			<div className="container blur-container row">
				<div className="col-md-6 text-start">
					<h1 className="welcome-header mx-5 mb-2 mt-4"> Info. </h1>
					<p className="mx-5 some-info">
						Praesent a erat turpis. Nunc lectus eros, vehicula sed aliquam non, convallis ut neque. Duis in cursus sapien. Interdum et malesuada fames ac
						ante ipsum primis in faucibus. Etiam dignissim, augue in pretium feugiat, libero felis sagittis diam, ac scelerisque eros justo ac quam. Sed
						condimentum a est molestie suscipit. Suspendisse id facilisis erat, et lacinia tortor. Etiam ac est massa. In ut facilisis leo. Donec a elit
						pellentesque, lobortis diam vitae, finibus felis. Phasellus interdum sagittis mauris non congue. Donec eget justo semper, hendrerit magna id,
						efficitur magna. Vivamus tristique in odio et gravida. In sollicitudin nulla arcu, ut dapibus ante vehicula sollicitudin. Proin viverra euismod
						dictum.
					</p>
				</div>
				<div className="col-md-6">
					<div className="text-end mx-5">
						<i
							className="bi bi-arrow-right-short" // Use className here
							onClick={() => handle_redirect("/Home")} // Use an arrow function to pass the argument
						></i>
					</div>
					<p className="mx-5 text-start some-info">
						Proin tristique iaculis erat, vehicula consectetur ligula laoreet vitae. Curabitur ac pretium sapien. Aenean semper ultricies lacus at feugiat.
						Quisque nec risus et nibh commodo rutrum a eu sapien. Sed in mauris tempus, mattis ipsum in, mollis ante. In porta nisl sit amet nisl tempor,
						at hendrerit turpis maximus. Quisque ac ex et ligula facilisis tincidunt. Aliquam dolor nunc, vulputate id purus a, bibendum euismod nisi.
						Morbi tristique malesuada augue, non facilisis diam lobortis vel. Aliquam sed enim lacus. Etiam tincidunt mattis sem, vitae egestas erat auctor
						vitae. Donec quis laoreet est, venenatis gravida nisi. Vestibulum a lectus arcu. Nunc accumsan dolor ligula, sit amet imperdiet diam tincidunt
						eget. Proin maximus congue mauris nec vehicula. Sed rhoncus diam sit amet massa commodo tempus. Sed nunc justo, fringilla nec libero et,
						tincidunt luctus nunc. Aenean euismod erat enim, ut maximus lorem lobortis a. Integer sagittis, dui ut rutrum tempus, eros sem hendrerit mi,
						vel molestie diam nisi at felis. Nulla in nisi elit. Maecenas finibus mauris et ante mollis pellentesque. Praesent sed sem vitae tortor
						condimentum varius.
					</p>
				</div>
			</div>
		</main>
	);
};

export default MoreInfo;
