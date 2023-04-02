import { useState, useEffect } from 'react';
import { Link, useRouteMatch, Route } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import ModalStagePercents from './ModalStagePercents';
import ModalInfo from './ModalInfo';

const MoveButtons = ({ selectedCharacter, selectedKillConfirm }) => {
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
						to={`/${selectedCharacter.id}/${move.id}`}
						className={`btn btn-primary btn-sm ${move.id === selectedKillConfirm.id ? 'active' : ''}`}
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
								<div className="character-index">{character.charIndex}</div>
								<div className="character-info">
									<div className="item grid-percent-range">
										{character.percents.start} - {character.percents.end}%
									</div>

									<div className="d-flex align-items-center grid-difficulty">
										<div className={`item easy ${character.percents.difficultyClass}`}>
											{character.percents.difficultyText} - {character.percents.percDiff + 1}%
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
	selectedCharacterModal,
	setSelectedCharacterModal,
	setModalShowInfo,
	setModalShowStageList,
	activeRage,
	setActiveRage,
	sortBy,
	setSortBy
}) => {
	const [showAdditionalCharacterInfoInGrid, setShowAdditionalCharacterInfoInGridInGrid] = useState(false);
	const [filteredKillConfirmCharacters, setFilteredKillConfirmCharacters] = useState(selectedKillConfirm.characters);
	const [filterText, setFilterText] = useState('');

	const { url } = useRouteMatch();

	const hasSelectedCharacter = selectedCharacter && Object.keys(selectedCharacter).length > 0;
	const hasFilteredKillConfirmCharacters = filteredKillConfirmCharacters && filteredKillConfirmCharacters.length;
	const hasSelectedCharacterModal = selectedCharacterModal && Object.keys(selectedCharacterModal).length;

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
		let newSortBy = [];
		let sortingDirection = sortBy.find((sort) => sort.id === sortId).sortingDirection;
		sortingDirection = sortingDirection === null || sortingDirection === 'ascending' ? 'descending' : 'ascending';
		newSortBy = sortBy.map((sort) => {
			return { ...sort, sortingDirection: null };
		});
		newSortBy.find((sort) => sort.id === sortId).sortingDirection = sortingDirection;
		setSortBy(newSortBy);
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

	return (
		<>
			{selectedCharacter ? (
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
						{hasSelectedCharacter && hasFilteredKillConfirmCharacters ? (
							<Tiles
								selectedKillConfirm={selectedKillConfirm}
								filteredKillConfirmCharacters={filteredKillConfirmCharacters}
								showAdditionalCharacterInfoInGrid={showAdditionalCharacterInfoInGrid}
								setSelectedCharacterModal={setSelectedCharacterModal}
								setModalShowStageList={setModalShowStageList}
								setModalShowInfo={setModalShowInfo}
								sortBy={sortBy}
							/>
						) : null}
					</div>
				</div>
			) : null}
			<Route path={`${url}/:selectedCharacterModalId`}>
				{hasSelectedCharacter && hasFilteredKillConfirmCharacters && hasSelectedCharacterModal ? (
					<ModalStagePercents
						url={url}
						selectedCharacter={selectedCharacter}
						selectedCharacterModal={selectedCharacterModal}
						selectedKillConfirm={selectedKillConfirm}
						activeRage={activeRage}
						setActiveRage={setActiveRage}
						filteredKillConfirmCharacters={filteredKillConfirmCharacters}
					/>
				) : null}
			</Route>
			<Route exact path={`${url}/info`}>
				{hasSelectedCharacter ? (
					<ModalInfo url={url} selectedCharacter={selectedCharacter} selectedKillConfirm={selectedKillConfirm} />
				) : null}
			</Route>
		</>
	);
};

export default CharacterTiles;
