const Header = ({ setSidebarOpen, sidebarOpen, selectedCharacter }) => {
	return (
		<header className="d-flex align-items-center header text-light">
			<button
				type="button"
				className="d-none d-lg-block btn btn-secondary"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<i className="fa fa-bars" aria-hidden="true"></i>
			</button>
			<h2 className="h4 font-weight-normal">
				{selectedCharacter && selectedCharacter.name ? selectedCharacter.name : 'Select a Kill Confirm'}
			</h2>

			<nav className="nav">
				<a href="/about">About</a>
				<a href="/credits">Credits</a>
				<a href="/feedback">
					Feedback<i className="fa fa-external-link ms-2" style={{ fontSize: '75%' }} aria-hidden="true"></i>
				</a>
			</nav>
		</header>
	);
};

export default Header;
