import React from 'react';

const Sidebar = ({ moveCards }) => {
	return (
		<aside class="d-none d-lg-block sidebar">
			<nav id="sidebar">
				<div class="sidebar-header">
					<a href="/">
						<img className="img-fluid" src="/images/logo-winning-at-smash4.png" alt="Winning a Smash 4 logo" />
					</a>
				</div>
				<ul class="list-unstyled">
					{moveCards.map((character) => (
						<li
							class="character-item"
							key={'sidebar-' + moveCards.charId}
							style={{ '--item-color': character.cardColor }}
						>
							<div className={`character-header ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
								{character.name}
							</div>
							<ul class="list-unstyled">
								{character.moves.map((move) => (
									<li key={'sidebar-' + move.id}>
										<button type="button" class="btn" dangerouslySetInnerHTML={{ __html: move.moveName }}></button>
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
