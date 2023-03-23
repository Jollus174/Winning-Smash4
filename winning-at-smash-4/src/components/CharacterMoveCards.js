import React from 'react';

const CharacterMoveCards = ({ moveCards, handleSelectedKillConfirm }) => {
	return (
		<div className="character-move-cards">
			<div className="row">
				{moveCards.map((character) => (
					<div className="col-sm-6 col-md-4 character-move-card-col" key={'card-' + character.charId}>
						<div className="card">
							<div className="card-image" style={{ '--card-image-bg-color': 'rgb(' + character.cardColor + ')' }}>
								<img src={'/images/characters/webp/' + character.charId + '.webp'} alt="{character.name}" />
								<h2 className={`card-title ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
									{character.name}
								</h2>
							</div>
							<div className="card-body">
								<div className="btn-group">
									{character.moves.map((move) => (
										<button
											type="button"
											className="btn btn-primary btn-sm"
											key={'card-' + move.moveId}
											style={{ '--btn-bg': character.btnColor }}
											onClick={() => handleSelectedKillConfirm(character, move)}
										>
											<span dangerouslySetInnerHTML={{ __html: move.moveName }} />
										</button>
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
