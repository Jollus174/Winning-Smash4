import { useState, useEffect } from 'react';
import { Link, useRouteMatch, useParams, Route } from 'react-router-dom';

import { Dropdown } from 'react-bootstrap';
import ModalStagePercents from './ModalStagePercents';
import ModalInfo from './ModalInfo';

const MoveButtons = ({ selectedCharacter, selectedKillConfirm }) => {
	const { characterId, id } = useParams();

	if (!selectedCharacter.moves || selectedCharacter.moves.length < 2)
		return (
			<>
				<h2
					className={`h6 m-0 font-weight-normal ${selectedCharacter.textScheme === 'light' ? 'text-light' : ''}`}
					dangerouslySetInnerHTML={{ __html: selectedKillConfirm.name }}
				/>
			</>
		);
	return (
		<div className="move-buttons-wrapper">
			<div className="btn-group move-buttons">
				{selectedCharacter.moves.map((move) => (
					<Link
						to={`/${characterId}/${move.id}`}
						className={`btn btn-primary btn-sm ${move.id === id ? 'active' : ''}`}
						style={{ '--btn-bg': selectedCharacter.btnColor }}
						key={'move-btn-' + move.id}
					>
						<span dangerouslySetInnerHTML={{ __html: move.name }} />
					</Link>
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

const Tiles = ({ selectedKillConfirm, filteredKillConfirmCharacters, showAdditionalCharacterInfoInGrid, sortBy }) => {
	const { url } = useRouteMatch();

	const sortingDirection = sortBy.find((sort) => sort.sortingDirection !== null).sortingDirection;

	return (
		<div>
			<div className="row row-character-tile">
				{selectedKillConfirm.characters.map((character, i) => {
					const characterValid = character.percents.percDiff !== 0;
					return (
						<div
							className={`col-6 col-md-4 col-lg-3 col-character-tile ${
								filteredKillConfirmCharacters.find((char) => char.id === character.id) ? '' : 'd-none'
							}`}
							key={'character-' + character.id}
						>
							<Link
								to={`${url}/${characterValid ? character.id : 'info'}`}
								className={`btn character-tile ${characterValid ? '' : 'invalid'}`}
								style={{
									'--tile-bg-color': 'rgb(' + character.charColor + ')'
								}}
							>
								<img
									src={`/images/characters/webp/${character.id}.webp`}
									alt={character.name}
									className="character-image"
								/>
								<div className="character-index">
									{sortingDirection === 'descending' ? i + 1 : filteredKillConfirmCharacters.length - i}
								</div>
								<div className="character-info">
									<div className="item grid-percent-range">
										{character.percents.start} - {character.percents.end}%
									</div>

									<div className="d-flex align-items-center grid-difficulty">
										<div className={`item easy ${character.percents.difficultyClass}`}>
											{character.percents.difficultyText} - {character.percents.percDiff}%
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
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const CharacterTiles = ({
	selectedCharacter,
	selectedKillConfirm,
	setSelectedKillConfirm,
	selectedCharacterModal,
	setSelectedCharacterModal,
	setModalShowInfo,
	setModalShowStageList,
	refreshStageList
}) => {
	const [showAdditionalCharacterInfoInGrid, setShowAdditionalCharacterInfoInGridInGrid] = useState(false);
	const [activeRage, setActiveRage] = useState('rage0');

	const [filteredKillConfirmCharacters, setFilteredKillConfirmCharacters] = useState(selectedKillConfirm.characters);
	const [sortBy, setSortBy] = useState([
		{ id: 'name', name: 'Name', sortingDirection: 'descending' },
		{ id: 'weight', name: 'Weight', sortingDirection: null },
		{ id: 'difficulty', name: 'Difficulty', sortingDirection: null },
		{ id: 'fallspeed', name: 'Fallspeed', sortingDirection: null },
		{ id: 'gravity', name: 'Gravity', sortingDirection: null }
	]);

	const [filterText, setFilterText] = useState('');

	const { url } = useRouteMatch();

	useEffect(() => {
		// filtering characters based on the filter input
		let filteredChars = selectedKillConfirm.characters;
		if (filterText !== '') {
			filteredChars = selectedKillConfirm.characters.filter((char) =>
				char.name.toLowerCase().includes(filterText.toLowerCase())
			);
		}

		setFilteredKillConfirmCharacters(filteredChars);
	}, [filterText, sortBy, selectedKillConfirm]);

	const handleSort = (sortId) => {
		const newKcCharacters = [...selectedKillConfirm.characters];
		let newSortBy = {};
		newSortBy = sortBy.map((sort) => {
			return { ...sort, sortingDirection: null };
		});

		if (sortId === 'name') {
			const sortByName = sortBy.find((sort) => sort.id === 'name');
			let { sortingDirection } = sortByName;

			if (sortingDirection === null || sortingDirection === 'ascending') {
				newKcCharacters.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
				sortingDirection = 'descending';
			} else {
				newKcCharacters.sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
				sortingDirection = 'ascending';
			}

			newSortBy.find((sort) => sort.id === 'name').sortingDirection = sortingDirection;
		}

		if (sortId === 'weight') {
			const sortByWeight = sortBy.find((sort) => sort.id === 'weight');
			let { sortingDirection } = sortByWeight;

			if (sortingDirection === null || sortingDirection === 'ascending') {
				newKcCharacters.sort((a, b) => (a.weight < b.weight ? -1 : a.weight > b.weight ? 1 : 0));
				sortingDirection = 'descending';
			} else {
				newKcCharacters.sort((a, b) => (a.weight > b.weight ? -1 : a.weight < b.weight ? 1 : 0));
				sortingDirection = 'ascending';
			}

			newSortBy.find((sort) => sort.id === 'weight').sortingDirection = sortingDirection;
		}

		if (sortId === 'difficulty') {
			const sortByDifficulty = sortBy.find((sort) => sort.id === 'difficulty');
			let { sortingDirection } = sortByDifficulty;

			if (selectedCharacter.id !== 'zelda' && selectedKillConfirm.id !== 'dthrow-up-air') {
				if (sortingDirection === null || sortingDirection === 'ascending') {
					newKcCharacters.sort((a, b) => b.percents.percDiff - a.percents.percDiff);
					sortingDirection = 'descending';
				} else {
					newKcCharacters.sort((a, b) => a.percents.percDiff - b.percents.percDiff);
					sortingDirection = 'ascending';
				}
			} else {
				// different difficulty sorting for smelly Zelda
				if (sortingDirection === null || sortingDirection === 'ascending') {
					newKcCharacters.sort((a, b) => a.airdodgeStart - b.airdodgeStart);
					sortingDirection = 'descending';
				} else {
					newKcCharacters.sort((a, b) => b.airdodgeStart - a.airdodgeStart);
					sortingDirection = 'ascending';
				}
			}

			newSortBy.find((sort) => sort.id === 'difficulty').sortingDirection = sortingDirection;
		}

		if (sortId === 'fallspeed') {
			const sortByFallspeed = sortBy.find((sort) => sort.id === 'fallspeed');
			let { sortingDirection } = sortByFallspeed;

			if (sortingDirection === null || sortingDirection === 'ascending') {
				newKcCharacters.sort((a, b) => (a.fallspeed < b.fallspeed ? -1 : a.fallspeed > b.fallspeed ? 1 : 0));
				sortingDirection = 'descending';
			} else {
				newKcCharacters.sort((a, b) => (a.fallspeed > b.fallspeed ? -1 : a.fallspeed < b.fallspeed ? 1 : 0));
				sortingDirection = 'ascending';
			}

			newSortBy.find((sort) => sort.id === 'fallspeed').sortingDirection = sortingDirection;
		}

		if (sortId === 'gravity') {
			const sortByGravity = sortBy.find((sort) => sort.id === 'gravity');
			let { sortingDirection } = sortByGravity;

			if (sortingDirection === null || sortingDirection === 'ascending') {
				newKcCharacters.sort((a, b) => (a.gravity < b.gravity ? -1 : a.gravity > b.gravity ? 1 : 0));
				sortingDirection = 'descending';
			} else {
				newKcCharacters.sort((a, b) => (a.gravity > b.gravity ? -1 : a.gravity < b.gravity ? 1 : 0));
				sortingDirection = 'ascending';
			}

			newSortBy.find((sort) => sort.id === 'gravity').sortingDirection = sortingDirection;
		}

		setSortBy(newSortBy);
		setSelectedKillConfirm({ ...selectedKillConfirm, characters: newKcCharacters });
	};

	const ItemSortBy = ({ sortBy, sortParameter }) => {
		const newSortBy = sortBy.find((s) => s.id === sortParameter);
		if (!newSortBy) return null;

		const { name, sortingDirection } = newSortBy;
		return (
			<span>
				<span>{name}</span>{' '}
				<i
					className={`fa ms-1 ${
						!sortingDirection ? 'd-none' : sortingDirection === 'ascending' ? 'fa-caret-up' : 'fa-caret-down'
					}`}
					aria-hidden="true"
				></i>
			</span>
		);
	};

	if (!selectedKillConfirm || !Object.keys(selectedKillConfirm).length) return;

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
					<Link
						to="/"
						className={`btn btn-secondary btn-sm ${
							selectedCharacter.textScheme === 'light' ? 'text-light' : 'text-dark'
						}`}
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
					</Link>
					<MoveButtons selectedCharacter={selectedCharacter} selectedKillConfirm={selectedKillConfirm} />

					<Link to={`${url}/info`} className="btn btn-primary btn-sm ms-auto">
						<i className="fa fa-info-circle" aria-hidden="true"></i>
						<span className="d-none d-md-inline ms-2">More Information</span>
					</Link>
				</nav>

				<div className="tiles">
					<div className="d-flex align-items-center character-filterbar">
						<input
							type="text"
							className="form-control input-filter"
							placeholder="Filter..."
							onKeyUp={(e) => setFilterText(e.target.value)}
						/>
						<div className="btn-group">
							<button
								type="button"
								className="d-none d-md-inline-block btn btn-primary btn-sm"
								onClick={() => handleSort('name')}
							>
								<ItemSortBy sortBy={sortBy} sortParameter="name" />
							</button>
							<button
								type="button"
								className="d-none d-md-inline-block btn btn-primary btn-sm"
								onClick={() => handleSort('weight')}
							>
								<ItemSortBy sortBy={sortBy} sortParameter="weight" />
							</button>
							<button
								type="button"
								className="d-none d-md-inline-block btn btn-primary btn-sm"
								onClick={() => handleSort('difficulty')}
							>
								<ItemSortBy sortBy={sortBy} sortParameter="difficulty" />
							</button>
							<Dropdown autoClose="outside">
								<Dropdown.Toggle id="dropdown-more" className="btn btn-primary btn-sm dropdown-toggle">
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
								</Dropdown.Toggle>
								<Dropdown.Menu
									style={{
										'--bs-dropdown-bg': `rgb(${selectedCharacter.btnColor})`,
										'--btn-color': `rgba(${
											selectedCharacter.textScheme === 'light' ? 'var(--bs-light-rgb)' : 'var(--bs-dark-rgb)'
										}, var(--bs-text-opacity))`
									}}
								>
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary d-md-none"
										onClick={() => handleSort('name')}
									>
										<ItemSortBy sortBy={sortBy} sortParameter="name" />
									</Dropdown.Item>
									<hr className="d-md-none dropdown-divider" />
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary d-md-none"
										onClick={() => handleSort('weight')}
									>
										<ItemSortBy sortBy={sortBy} sortParameter="weight" />
									</Dropdown.Item>
									<hr className="d-md-none dropdown-divider" />
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary d-md-none"
										onClick={() => handleSort('difficulty')}
									>
										<ItemSortBy sortBy={sortBy} sortParameter="difficulty" />
									</Dropdown.Item>
									<hr className="d-md-none dropdown-divider" />
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary"
										onClick={() => handleSort('fallspeed')}
									>
										<ItemSortBy sortBy={sortBy} sortParameter="fallspeed" />
									</Dropdown.Item>
									<hr className="dropdown-divider" />
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary"
										onClick={() => handleSort('gravity')}
									>
										<ItemSortBy sortBy={sortBy} sortParameter="gravity" />
									</Dropdown.Item>
									<hr className="dropdown-divider" />
									<Dropdown.Item
										as="button"
										type="button"
										className="btn btn-primary btn-show-additional-info"
										onClick={() => setShowAdditionalCharacterInfoInGridInGrid(!showAdditionalCharacterInfoInGrid)}
									>
										<span>Show Additional Character Info</span>{' '}
										<i
											className={`fa ms-1 ${showAdditionalCharacterInfoInGrid ? 'fa-check' : 'fa-times'}`}
											aria-hidden="true"
										></i>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</div>
					<InfoBox selectedKillConfirm={selectedKillConfirm} />
					{filteredKillConfirmCharacters.length ? (
						<Tiles
							selectedKillConfirm={selectedKillConfirm}
							filteredKillConfirmCharacters={filteredKillConfirmCharacters}
							showAdditionalCharacterInfoInGrid={showAdditionalCharacterInfoInGrid}
							setSelectedCharacterModal={setSelectedCharacterModal}
							setModalShowStageList={setModalShowStageList}
							setModalShowInfo={setModalShowInfo}
							sortBy={sortBy}
							refreshStageList={refreshStageList}
						/>
					) : null}
				</div>
			</div>
		</>
	);
};

export default CharacterTiles;
