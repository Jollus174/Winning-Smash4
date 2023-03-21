import React from 'react';
import { useState } from 'react';
const MoveButtons = ({ selectedCharacter, setSelectedKillConfirm, selectedKillConfirm }) => {
	if (!selectedCharacter.moves || selectedCharacter.moves.length < 2)
		return (
			<>
				<h2
					className={`h6 m-0 font-weight-normal ${selectedCharacter.textScheme === 'light' ? 'text-light' : ''}`}
					dangerouslySetInnerHTML={{ __html: selectedKillConfirm.moveName }}
				/>
			</>
		);
	return (
		<div className="move-buttons-wrapper">
			<div className="btn-group move-buttons">
				{selectedCharacter.moves.map((move) => (
					<button
						type="button"
						className={`btn btn-primary btn-sm ${move.moveId === selectedKillConfirm.moveId ? 'active' : ''}`}
						style={{ '--btn-bg': selectedCharacter.btnColor }}
						onClick={() => setSelectedKillConfirm(move)}
						key={'move-btn-' + move.moveId}
					>
						<span dangerouslySetInnerHTML={{ __html: move.moveName }} />
					</button>
				))}
			</div>
		</div>
	);
};

const InfoBox = ({ selectedKillConfirm }) => {
	if (!selectedKillConfirm.specialInfo) return null;

	return (
		<div
			className="alert alert-info"
			role="alert"
			dangerouslySetInnerHTML={{ __html: selectedKillConfirm.specialInfo }}
		/>
	);
};

const Tiles = (props) => {
	const { charAttrs, setCharAttrs, selectedKillConfirm, showAdditionalCharacterInfo } = props;

	return (
		<div>
			<div className="row row-character-tile">
				{charAttrs.map((character, i) => (
					<div className="col-6 col-md-4 col-lg-3 col-character-tile" key={'character-' + character.charIndex}>
						<button
							type="button"
							className="btn character-tile"
							style={{
								'--tile-bg-color': 'rgb(' + character.charColor + ')',
								'--tile-image-position': character.imagePosition
							}}
							onClick={openCharacterModal}
						>
							<img src={'/images/characters/webp/' + character.id + '.webp'} alt={'character.name'} />
							<div className="character-index">{i + 1}</div>
							<div className="character-info">
								<div className="item grid-percent-range">85 - 107%</div>
								<div className="d-flex align-items-center grid-difficulty">
									<div className="item easy">Easy - 23%</div>
									<div className="item special-info">Close</div>
								</div>
								{showAdditionalCharacterInfo ? (
									<>
										<div className="item-extra grid-additional-info">
											<span className="font-weight-normal">Fallspeed -</span> {character.fallspeed}
										</div>
										<div className="item-extra grid-additional-info">
											<span className="font-weight-normal">Gravity -</span> {character.gravity}
										</div>
									</>
								) : null}
							</div>
							<div className="character-name">
								<h3 className="h6 m-0 text-center">{character.name}</h3>
							</div>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

const CharacterTiles = ({
	charAttrs,
	setCharAttrs,
	setSelectedCharacter,
	selectedCharacter,
	setSelectedKillConfirm,
	selectedKillConfirm
}) => {
	const [showAdditionalCharacterInfo, setShowAdditionalCharacterInfo] = useState(false);

	// TODO: this would be a 'tri-nary' state? Could be ascending / descending / null
	const [sortByName, setSortByName] = useState(false);
	const [sortByWeight, setSortByWeight] = useState(false);
	const [sortByDifficulty, setSortByDifficulty] = useState(false);
	const [sortByFallspeed, setSortByFallspeed] = useState(false);
	const [sortByGravity, setSortByGravity] = useState(false);

	return (
		<div
			className={'d-flex flex-column character-tiles'}
			style={{
				'--card-color': selectedCharacter.cardColor,
				'--btn-color': selectedCharacter.btnColor
			}}
		>
			<nav className="d-flex align-items-center character-topbar">
				<button
					type="button"
					className={`btn btn-secondary btn-sm ${
						selectedCharacter.textScheme === 'light' ? 'text-light' : 'text-dark'
					}`}
					onClick={() => {
						setSelectedCharacter({});
						setSelectedKillConfirm({});
					}}
				>
					<span className="visually-hidden">Back</span>
					<svg className="icon-arrowback" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"></path>
						<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
					</svg>
				</button>
				<MoveButtons
					selectedCharacter={selectedCharacter}
					setSelectedKillConfirm={setSelectedKillConfirm}
					selectedKillConfirm={selectedKillConfirm}
				/>

				<button type="button" className="btn btn-primary btn-sm ms-auto">
					<i className="fa fa-info-circle" aria-hidden="true"></i>
					<span className="d-none d-md-inline ms-2">More Information</span>
				</button>
			</nav>

			<div className="tiles">
				<div className="d-flex align-items-center character-filterbar">
					<input type="search" className="form-control input-filter" placeholder="Filter..." />
					<div className="btn-group">
						<button
							type="button"
							className="d-none d-md-inline-block btn btn-primary btn-sm"
							onClick={() => setSortByName(!sortByName)}
						>
							<span>
								Name <i className={`fa ms-1 ${sortByName ? 'fa-caret-up' : 'fa-caret-down'}`} aria-hidden="true"></i>
							</span>
						</button>
						<button
							type="button"
							className="d-none d-md-inline-block btn btn-primary btn-sm"
							onClick={() => setSortByWeight(!sortByWeight)}
						>
							<span>
								Weight{' '}
								<i className={`fa ms-1 ${sortByWeight ? 'fa-caret-up' : 'fa-caret-down'}`} aria-hidden="true"></i>
							</span>
						</button>
						<button
							type="button"
							className="d-none d-md-inline-block btn btn-primary btn-sm"
							onClick={() => setSortByDifficulty(!sortByDifficulty)}
						>
							<span>
								Difficulty
								<i className={`fa ms-1 ${sortByDifficulty ? 'fa-caret-up' : 'fa-caret-down'}`} aria-hidden="true"></i>
							</span>
						</button>
						<button
							type="button"
							id="dropdown-more"
							className="btn btn-primary btn-sm dropdown-toggle"
							data-bs-toggle="dropdown"
							data-bs-auto-close="outside"
							aria-expanded="false"
						>
							<span className="d-none d-md-inline">
								<span className="visually-hidden">More</span>
								<i className="fa fa-caret-down" aria-hidden="true"></i>
							</span>
							<span className="d-flex align-items-center d-md-none">
								Sort
								<svg
									id="icon-filter"
									className="ms-1"
									height="24"
									viewBox="0 0 24 24"
									width="24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										className="pathfill"
										d="M14 5h8v2h-8zm0 5.5h8v2h-8zm0 5.5h8v2h-8zM2 11.5C2 15.08 4.92 18 8.5 18H9v2l3-3-3-3v2h-.5C6.02 16 4 13.98 4 11.5S6.02 7 8.5 7H12V5H8.5C4.92 5 2 7.92 2 11.5z"
									></path>
								</svg>
							</span>
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdown-more">
							<li>
								<button type="button" className="dropdown-item" onClick={() => setSortByFallspeed(!sortByFallspeed)}>
									<span>Fallspeed</span>
									<i className={`fa ms-1 ${sortByFallspeed ? 'fa-caret-up' : 'fa-caret-down'}`} aria-hidden="true"></i>
								</button>
							</li>
							<li>
								<button type="button" className="dropdown-item" onClick={() => setSortByGravity(!sortByGravity)}>
									<span>Gravity</span>
									<i className={`fa ms-1 ${sortByGravity ? 'fa-caret-up' : 'fa-caret-down'}`} aria-hidden="true"></i>
								</button>
							</li>
							<li>
								<button
									type="button"
									className="dropdown-item"
									onClick={() => setShowAdditionalCharacterInfo(!showAdditionalCharacterInfo)}
								>
									Show Additional Character Info
									<i
										className={`fa ms-1 ${showAdditionalCharacterInfo ? 'fa-check' : 'fa-times'}`}
										aria-hidden="true"
									></i>
								</button>
							</li>
						</ul>
					</div>
				</div>
				<InfoBox selectedKillConfirm={selectedKillConfirm} />
				<Tiles
					charAttrs={charAttrs}
					setCharAttrs={setCharAttrs}
					selectedKillConfirm={selectedKillConfirm}
					showAdditionalCharacterInfo={showAdditionalCharacterInfo}
				/>
			</div>
		</div>
	);
};

export default CharacterTiles;
