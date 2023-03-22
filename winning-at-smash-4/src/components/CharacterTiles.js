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
								'--tile-bg-color': 'rgb(' + character.charColor + ')'
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

	// these sorters exist in a sort of 'tri-nary' state. 0 means off (sort not in action), 1 means sort descending, -1 means sort ascending
	// only one can be in action, so clicking one sets the others back to 0
	const [sortByName, setSortByName] = useState(1);
	const [sortByWeight, setSortByWeight] = useState(0);
	const [sortByDifficulty, setSortByDifficulty] = useState(0);
	const [sortByFallspeed, setSortByFallspeed] = useState(0);
	const [sortByGravity, setSortByGravity] = useState(0);

	const handleSortByName = () => {
		const newCharAttrs = [...charAttrs];

		setSortByWeight(0);
		setSortByDifficulty(0);
		setSortByFallspeed(0);
		setSortByGravity(0);

		if (sortByName === 0 || sortByName === -1) {
			setSortByName(1);
			newCharAttrs.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		} else if (sortByName === 1) {
			setSortByName(-1);
			newCharAttrs.sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
		}
		setCharAttrs(newCharAttrs);
	};

	const handleSortByWeight = () => {
		const newCharAttrs = [...charAttrs];

		setSortByName(0);
		setSortByDifficulty(0);
		setSortByFallspeed(0);
		setSortByGravity(0);

		if (sortByWeight === 0 || sortByWeight === -1) {
			newCharAttrs.sort((a, b) => a.weight - b.weight);
			setSortByWeight(1);
		} else if (sortByWeight === 1) {
			newCharAttrs.sort((a, b) => b.weight - a.weight);
			setSortByWeight(-1);
		}
		setCharAttrs(newCharAttrs);
	};

	const handleSortByDifficulty = () => {
		const newCharAttrs = [...charAttrs];

		setSortByName(0);
		setSortByWeight(0);
		setSortByFallspeed(0);
		setSortByGravity(0);

		if (sortByDifficulty === 0 || sortByDifficulty === -1) {
			// TODO: look into this one closer, especially with invalid percents and 'N/A'
			newCharAttrs.sort((a, b) => a.percents.end - a.percents.start - (b.percents.end - b.percents.start));
			setSortByDifficulty(1);
		} else if (sortByDifficulty === 1) {
			newCharAttrs.sort((a, b) => b.percents.end - b.percents.start - (a.percents.end - a.percents.start));
			setSortByDifficulty(-1);
		}
		setCharAttrs(newCharAttrs);
	};

	const handleSortByFallspeed = () => {
		const newCharAttrs = [...charAttrs];

		setSortByName(0);
		setSortByWeight(0);
		setSortByDifficulty(0);
		setSortByGravity(0);

		if (sortByFallspeed === 0 || sortByFallspeed === -1) {
			newCharAttrs.sort((a, b) => a.fallspeed - b.fallspeed);
			setSortByFallspeed(1);
		} else if (sortByFallspeed === 1) {
			newCharAttrs.sort((a, b) => b.fallspeed - a.fallspeed);
			setSortByFallspeed(-1);
		}
		setCharAttrs(newCharAttrs);
	};

	const handleSortByGravity = () => {
		const newCharAttrs = [...charAttrs];

		setSortByName(0);
		setSortByWeight(0);
		setSortByDifficulty(0);
		setSortByFallspeed(0);

		if (sortByGravity === 0 || sortByGravity === -1) {
			newCharAttrs.sort((a, b) => a.gravity - b.gravity);
			setSortByGravity(1);
		} else if (sortByGravity === 1) {
			newCharAttrs.sort((a, b) => b.gravity - a.gravity);
			setSortByGravity(-1);
		}
		setCharAttrs(newCharAttrs);
	};

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
							onClick={handleSortByName}
						>
							<span>
								Name{' '}
								{sortByName !== 0 ? (
									<i
										className={`fa ms-1 ${sortByName === -1 ? 'fa-caret-up' : 'fa-caret-down'}`}
										aria-hidden="true"
									></i>
								) : null}
							</span>
						</button>
						<button
							type="button"
							className="d-none d-md-inline-block btn btn-primary btn-sm"
							onClick={handleSortByWeight}
						>
							<span>
								Weight{' '}
								{sortByWeight !== 0 ? (
									<i
										className={`fa ms-1 ${sortByWeight === -1 ? 'fa-caret-up' : 'fa-caret-down'}`}
										aria-hidden="true"
									></i>
								) : null}
							</span>
						</button>
						<button
							type="button"
							className="d-none d-md-inline-block btn btn-primary btn-sm"
							onClick={handleSortByDifficulty}
						>
							<span>
								Difficulty
								{sortByDifficulty !== 0 ? (
									<i
										className={`fa ms-1 ${sortByDifficulty === -1 ? 'fa-caret-up' : 'fa-caret-down'}`}
										aria-hidden="true"
									></i>
								) : null}
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
								<button type="button" className="dropdown-item" onClick={handleSortByFallspeed}>
									<span>Fallspeed</span>
									{sortByFallspeed !== 0 ? (
										<i
											className={`fa ms-1 ${sortByFallspeed === -1 ? 'fa-caret-up' : 'fa-caret-down'}`}
											aria-hidden="true"
										></i>
									) : null}
								</button>
							</li>
							<li>
								<button type="button" className="dropdown-item" onClick={handleSortByGravity}>
									<span>Gravity</span>
									{sortByGravity !== 0 ? (
										<i
											className={`fa ms-1 ${sortByGravity === -1 ? 'fa-caret-up' : 'fa-caret-down'}`}
											aria-hidden="true"
										></i>
									) : null}
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
