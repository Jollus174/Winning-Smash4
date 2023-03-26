import { useState } from 'react';
import ModalStagePercents from './ModalStagePercents';
import ModalInfo from './ModalInfo';

const MoveButtons = ({ selectedCharacter, selectedKillConfirm, handleSelectedKillConfirm }) => {
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
						onClick={() => handleSelectedKillConfirm(selectedCharacter, move)}
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
	const {
		charAttrs,
		filteredCharAttrs,
		showAdditionalCharacterInfoInGrid,
		setSelectedCharacterModal,
		sortDescending,
		setModalShowStageList,
		setModalShowInfo
	} = props;

	const handleOpenModal = (character, characterValid) => {
		if (characterValid) {
			setSelectedCharacterModal(character);
			setModalShowStageList(true);
		} else {
			setModalShowInfo(true);
		}
	};

	return (
		<div>
			<div className="row row-character-tile">
				{charAttrs.map((character, i) => {
					const characterValid = character.percents.percDiff !== 0;

					return (
						<div
							className={`col-6 col-md-4 col-lg-3 col-character-tile ${
								filteredCharAttrs.find((char) => char.id === character.id) ? '' : 'd-none'
							}`}
							key={'character-' + character.charIndex}
						>
							<button
								type="button"
								className={`btn character-tile ${characterValid ? '' : 'invalid'}`}
								style={{
									'--tile-bg-color': 'rgb(' + character.charColor + ')'
								}}
								onClick={() => {
									handleOpenModal(character, characterValid);
								}}
							>
								<img
									src={`/images/characters/webp/${character.id}.webp`}
									alt={character.name}
									className="character-image"
								/>
								<div className="character-index">{sortDescending ? i + 1 : charAttrs.length - i}</div>
								<div className="character-info">
									<div className="item grid-percent-range">
										{character.percents.start} - {character.percents.end}%
									</div>

									<div className="d-flex align-items-center grid-difficulty">
										<div className={`item easy ${character.percents.diffClass}`}>
											{character.percents.diffText} - {character.percents.percDiff}%
										</div>
										{character.percents.distance ? (
											<div className="item special-info">{character.percents.distance}</div>
										) : null}
									</div>
									{showAdditionalCharacterInfoInGrid ? (
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

								{!characterValid ? <div className="text-invalid text-uppercase">N/A - Check Info</div> : null}
							</button>
						</div>
					);
				})}
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
	selectedKillConfirm,
	handleSelectedKillConfirm,
	stageList,
	sortByName,
	setSortByName,
	sortByWeight,
	setSortByWeight,
	sortByDifficulty,
	setSortByDifficulty,
	sortByFallspeed,
	setSortByFallspeed,
	sortByGravity,
	setSortByGravity,
	selectedCharacterModal,
	setSelectedCharacterModal,
	setFilteredCharAttrs,
	filteredCharAttrs
}) => {
	const [modalShowStageList, setModalShowStageList] = useState(false);
	const [modalShowInfo, setModalShowInfo] = useState(false);
	const [showAdditionalCharacterInfoInGrid, setShowAdditionalCharacterInfoInGridInGrid] = useState(false);

	const handleFilter = (value) => {
		let filteredChars = charAttrs;
		if (value !== '') {
			filteredChars = charAttrs.filter((char) => char.name.toLowerCase().includes(value.toLowerCase()));
		}
		setFilteredCharAttrs(filteredChars);
	};

	const [sortDescending, setSortDescending] = useState(true);

	const handleSortByName = () => {
		const newCharAttrs = [...charAttrs];

		setSortByWeight(0);
		setSortByDifficulty(0);
		setSortByFallspeed(0);
		setSortByGravity(0);

		if (sortByName === 0 || sortByName === -1) {
			setSortByName(1);
			setSortDescending(true);
			newCharAttrs.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		} else if (sortByName === 1) {
			setSortByName(-1);
			setSortDescending(false);
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
			setSortByWeight(1);
			setSortDescending(true);
			newCharAttrs.sort((a, b) => a.weight - b.weight);
		} else if (sortByWeight === 1) {
			setSortByWeight(-1);
			setSortDescending(false);
			newCharAttrs.sort((a, b) => b.weight - a.weight);
		}
		setCharAttrs(newCharAttrs);
	};

	const handleSortByDifficulty = () => {
		const newCharAttrs = [...charAttrs];

		setSortByName(0);
		setSortByWeight(0);
		setSortByFallspeed(0);
		setSortByGravity(0);

		if (selectedCharacter.charId !== 'zelda' && selectedKillConfirm.moveId !== 'dthrow-up-air') {
			if (sortByDifficulty === 0 || sortByDifficulty === -1) {
				setSortByDifficulty(1);
				setSortDescending(true);
				newCharAttrs.sort((a, b) => a.percents.percDiff - b.percents.percDiff);
			} else if (sortByDifficulty === 1) {
				setSortByDifficulty(-1);
				setSortDescending(false);
				newCharAttrs.sort((a, b) => b.percents.percDiff - a.percents.percDiff);
			}
		} else {
			// different difficulty sorting for smelly Zelda
			if (sortByDifficulty === 0 || sortByDifficulty === -1) {
				setSortByDifficulty(1);
				setSortDescending(true);
				newCharAttrs.sort((a, b) => a.airdodgeStart - b.airdodgeStart);
			} else if (sortByDifficulty === 1) {
				setSortByDifficulty(-1);
				setSortDescending(false);
				newCharAttrs.sort((a, b) => b.airdodgeStart - a.airdodgeStart);
			}
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
			setSortByFallspeed(1);
			setSortDescending(true);
			newCharAttrs.sort((a, b) => a.fallspeed - b.fallspeed);
		} else if (sortByFallspeed === 1) {
			setSortByFallspeed(-1);
			setSortDescending(false);
			newCharAttrs.sort((a, b) => b.fallspeed - a.fallspeed);
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
			setSortByGravity(1);
			setSortDescending(true);
			newCharAttrs.sort((a, b) => a.gravity - b.gravity);
		} else if (sortByGravity === 1) {
			setSortByGravity(-1);
			setSortDescending(false);
			newCharAttrs.sort((a, b) => b.gravity - a.gravity);
		}
		setCharAttrs(newCharAttrs);
	};

	return (
		<>
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
						<svg
							className="icon-arrowback"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
						</svg>
					</button>
					<MoveButtons
						selectedCharacter={selectedCharacter}
						selectedKillConfirm={selectedKillConfirm}
						handleSelectedKillConfirm={handleSelectedKillConfirm}
					/>

					<button type="button" className="btn btn-primary btn-sm ms-auto" onClick={() => setModalShowInfo(true)}>
						<i className="fa fa-info-circle" aria-hidden="true"></i>
						<span className="d-none d-md-inline ms-2">More Information</span>
					</button>
				</nav>

				<div className="tiles">
					<div className="d-flex align-items-center character-filterbar">
						<input
							type="text"
							className="form-control input-filter"
							placeholder="Filter..."
							onKeyUp={(e) => handleFilter(e.target.value)}
						/>
						<div className="btn-group">
							<button
								type="button"
								className="d-none d-md-inline-block btn btn-primary btn-sm"
								onClick={handleSortByName}
							>
								<span>
									Name
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
									Weight
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
										onClick={() => setShowAdditionalCharacterInfoInGridInGrid(!showAdditionalCharacterInfoInGrid)}
									>
										Show Additional Character Info
										<i
											className={`fa ms-1 ${showAdditionalCharacterInfoInGrid ? 'fa-check' : 'fa-times'}`}
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
						filteredCharAttrs={filteredCharAttrs}
						showAdditionalCharacterInfoInGrid={showAdditionalCharacterInfoInGrid}
						setSelectedCharacterModal={setSelectedCharacterModal}
						setModalShowStageList={setModalShowStageList}
						setModalShowInfo={setModalShowInfo}
						sortDescending={sortDescending}
					/>
				</div>
			</div>
			<ModalStagePercents
				stageList={stageList}
				modalShowStageList={modalShowStageList}
				setModalShowStageList={setModalShowStageList}
				selectedCharacter={selectedCharacter}
				selectedCharacterModal={selectedCharacterModal}
				setSelectedCharacterModal={setSelectedCharacterModal}
				selectedKillConfirm={selectedKillConfirm}
				handleSelectedKillConfirm={handleSelectedKillConfirm}
				filteredCharAttrs={filteredCharAttrs}
			/>
			<ModalInfo
				selectedCharacter={selectedCharacter}
				selectedKillConfirm={selectedKillConfirm}
				modalShowInfo={modalShowInfo}
				setModalShowInfo={setModalShowInfo}
			/>
		</>
	);
};

export default CharacterTiles;
