import { Link } from 'react-router-dom';

const CharacterMoveCards = ({ killConfirms, selectedKillConfirm }) => {
	return (
		<div className="character-move-cards">
			<div className="row">
				{killConfirms.map((character) => (
					<div className="col-sm-6 col-md-4 character-move-card-col" key={'card-' + character.id}>
						<div className="card">
							<div className="card-image" style={{ '--card-image-bg-color': 'rgb(' + character.cardColor + ')' }}>
								<img src={'/images/characters/webp/' + character.id + '.webp'} alt="{character.name}" />
								<h2 className={`card-title ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
									{character.name}
								</h2>
							</div>
							<div className="card-body">
								<div className="btn-group">
									{character.moves.map((move) => (
										<Link
											to={`/${character.id}/${move.id}`}
											className={`btn btn-primary btn-sm ${selectedKillConfirm.id === move.id ? 'active' : ''}`}
											key={'card-' + move.id}
											style={{ '--btn-bg': character.btnColor }}
										>
											<span dangerouslySetInnerHTML={{ __html: move.name }} />
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CharacterMoveCards;
