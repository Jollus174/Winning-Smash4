import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, moveCards }) => {
	return (
		<aside className={`d-none sidebar ${sidebarOpen ? 'd-lg-block' : ''}`}>
			<nav id="sidebar">
				<div className="sidebar-header">
					<Link to="/">
						<img className="img-fluid" src="/images/logo-winning-at-smash4.png" alt="Winning a Smash 4 logo" />
					</Link>
				</div>
				<ul className="list-unstyled">
					{moveCards.map((character) => (
						<li
							className="character-item"
							key={'sidebar-' + character.id}
							style={{ '--item-color': character.cardColor }}
						>
							<div className={`character-header ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
								{character.name}
							</div>
							<ul className="list-unstyled">
								{character.moves.map((move) => (
									<li key={'sidebar-' + move.id}>
										<Link
											to={`/${character.id}/${move.id}`}
											className="btn"
											dangerouslySetInnerHTML={{ __html: move.name }}
										></Link>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};

export default Sidebar;
