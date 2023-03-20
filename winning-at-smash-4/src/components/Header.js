import React from 'react';

const Header = () => {
	return (
		<header className="header text-light">
			<button type="button" className="d-none d-lg-block btn">
				<i className="fa fa-bars" aria-hidden="true"></i>
			</button>
			<h2 className="h4 title">Select a Kill Confirm</h2>

			<nav className="nav">
				<a href="/about">About</a>
				<a href="/credits">Credits</a>
				<a href="/feedback">Feedback</a>
			</nav>
		</header>
	);
};

export default Header;
