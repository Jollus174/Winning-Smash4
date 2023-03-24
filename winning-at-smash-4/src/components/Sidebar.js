const Sidebar = ({ sidebarOpen, moveCards, handleSelectedKillConfirm }) => {
	return (
		<aside className={`d-none sidebar ${sidebarOpen ? 'd-lg-block' : ''}`}>
			<nav id="sidebar">
				<div className="sidebar-header">
					<a href="/">
						<img className="img-fluid" src="/images/logo-winning-at-smash4.png" alt="Winning a Smash 4 logo" />
					</a>
				</div>
				<ul className="list-unstyled">
					{moveCards.map((character) => (
						<li
							className="character-item"
							key={'sidebar-' + character.charId}
							style={{ '--item-color': character.cardColor }}
						>
							<div className={`character-header ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
								{character.name}
							</div>
							<ul className="list-unstyled">
								{character.moves.map((move) => (
									<li key={'sidebar-' + move.moveId}>
										<button
											type="button"
											className="btn"
											dangerouslySetInnerHTML={{ __html: move.moveName }}
											onClick={() => handleSelectedKillConfirm(character, move)}
										></button>
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
