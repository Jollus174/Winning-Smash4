import Skeleton from 'react-loading-skeleton';
import { Dropdown } from 'react-bootstrap';

const Header = ({
	loading,
	setSidebarOpen,
	sidebarOpen,
	selectedCharacter,
	setModalShowAbout,
	setModalShowCredits
}) => {
	return (
		<header className="d-flex align-items-center header text-light">
			<button
				type="button"
				className="d-none d-lg-block btn btn-secondary"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<i className="fa fa-bars" aria-hidden="true"></i>
			</button>
			<h2 className="title h4">
				{loading ? (
					<Skeleton />
				) : selectedCharacter && selectedCharacter.name ? (
					selectedCharacter.name
				) : (
					'Select a Kill Confirm'
				)}
			</h2>

			<nav className="nav">
				<div className="nav-links d-none d-md-flex">
					<button type="button" className="btn btn-link" onClick={() => setModalShowAbout(true)}>
						About
					</button>
					<button type="button" className="btn btn-link" onClick={() => setModalShowCredits(true)}>
						Credits
					</button>
					<a href="https://github.com/Jollus174/Winning-Smash4/issues" target="_blank" rel="noreferrer">
						Feedback<i className="fa fa-external-link ms-2" style={{ fontSize: '75%' }} aria-hidden="true"></i>
					</a>
				</div>

				<Dropdown className="d-block d-md-none">
					<Dropdown.Toggle id="dropdown-header" className="btn-secondary">
						Menu
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item as="button" type="button" className="btn btn-link" onClick={() => setModalShowAbout(true)}>
							About
						</Dropdown.Item>
						<Dropdown.Item as="button" type="button" className="btn btn-link" onClick={() => setModalShowCredits(true)}>
							Credits
						</Dropdown.Item>
						<Dropdown.Item href="https://github.com/Jollus174/Winning-Smash4/issues" target="_blank" rel="noreferrer">
							Feedback<i className="fa fa-external-link ms-2" style={{ fontSize: '75%' }} aria-hidden="true"></i>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</nav>
		</header>
	);
};

export default Header;
