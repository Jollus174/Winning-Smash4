import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const Sidebar = ({ loading, killConfirms, selectedCharacter, selectedKillConfirm }) => {
	return (
		<nav id="sidebar">
			<div className="sidebar-header">
				<Link to="/">
					<img className="img-fluid" src="/images/logo-winning-at-smash4.png" alt="Winning at Smash 4 logo" />
				</Link>
			</div>
			{loading ? (
				<Skeleton count={7} height={100} />
			) : (
				<ul className="list-unstyled">
					{killConfirms.map((character) => (
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
											className={`btn ${
												character.id === selectedCharacter.id && move.id === selectedKillConfirm.id ? 'active' : ''
											}`}
											dangerouslySetInnerHTML={{ __html: move.name }}
										></Link>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
};

export default Sidebar;
