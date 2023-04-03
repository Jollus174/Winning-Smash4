// TODO: unused /* globals */ ?

import { useEffect, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CharacterMoveCards from './components/CharacterMoveCards';
import CharacterTiles from './components/CharacterTiles';
import ModalAbout from './components/ModalAbout';
import ModalCredits from './components/ModalCredits';
import { Toast } from 'react-bootstrap';

function App() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(true);

	const [appData, setAppData] = useState({
		killConfirms: [],
		stageList: [],
		charAttrs: []
	});

	const [defaultSelections, setDefaultSelections] = useState({
		selectedCharacter: {},
		selectedKillConfirm: {},
		selectedCharacterModal: {},
		hasSelectedCharacter: false,
		hasSelectedKillConfirm: false,
		hasSelectedCharacterModal: false,
		selectedCharacterValid: true,
		selectedKillConfirmValid: true,
		selectedCharacterModalValid: true
	});
	const [appSelections, setAppSelections] = useState({ ...defaultSelections });

	const [sortBy, setSortBy] = useState([
		{ id: 'name', name: 'Name', sortingDirection: 'descending' },
		{ id: 'weight', name: 'Weight', sortingDirection: null },
		{ id: 'difficulty', name: 'Difficulty', sortingDirection: null },
		{ id: 'fallspeed', name: 'Fallspeed', sortingDirection: null },
		{ id: 'gravity', name: 'Gravity', sortingDirection: null }
	]);

	const [activeRage, setActiveRage] = useState('rage0');

	const [modalShowAbout, setModalShowAbout] = useState(false);
	const [modalShowCredits, setModalShowCredits] = useState(false);

	const [sidebarOpen, setSidebarOpen] = useState(true);

	const getData = async (url) => {
		return await fetch(url)
			.then((response) => response.json())
			.then((responseJSON) => {
				return responseJSON;
			})
			.catch((e) => {
				console.error('A request error has occurred!', e);
			});
	};

	const location = useLocation();

	// empty array means executes only once
	useEffect(() => {
		// TODO: set loading spinners
		if (!mounted) {
			setMounted(true);

			const baseURL = window.location.origin;
			const requests = {
				charAttrs: getData(`${baseURL}/data/char-attrs.json`),
				killConfirms: getData(`${baseURL}/data/kill-confirms.json`),
				stageList: getData(`${baseURL}/data/stage-list.json`)
			};

			Promise.all(Object.values(requests))
				.then((responses) => {
					const [charAttrs, killConfirms, stageList] = responses;
					const newAppData = {
						charAttrs,
						killConfirms,
						stageList
					};
					setAppData(newAppData);
					setLoading(false);
				})
				.catch((err) => {
					console.error('The app failed to load.', err);
				});

			// set resize listeners
			const resizeHandler = () => {
				// first we get the viewport height and we multiple it by 1% to get a value for a vh unit
				const vh = window.innerHeight * 0.01;
				// then we set the value in the --vh custom property to the root of the document
				document.documentElement.style.setProperty('--vh', vh + 'px');
			};

			resizeHandler();
			// we listen to the resize event and execute the same script as before
			window.addEventListener('resize', resizeHandler);
		} else {
			console.log('has already mounted!');
		}
		// page changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// for updating the 'global' state with a selected character, killConfirm and selectedCharacterModal
	useEffect(() => {
		const [, characterId, killConfirmId, selectedCharacterModal] = window.location.hash
			? window.location.hash.split('/')
			: '';

		const { killConfirms, charAttrs } = appData;
		const updatedSelections = {
			...defaultSelections
		};

		if (characterId) {
			const characterToSet = killConfirms.find((killConfirm) => killConfirm.id === characterId);
			if (!characterToSet) {
				updatedSelections.selectedCharacterValid = false;
			} else {
				updatedSelections.selectedCharacter = { ...characterToSet };
				updatedSelections.hasSelectedCharacter = true;
				updatedSelections.selectedCharacterValid = true;

				if (killConfirmId) {
					const killConfirmToSet = characterToSet.moves.find((killConfirm) => killConfirm.id === killConfirmId);
					if (!killConfirmToSet) {
						updatedSelections.selectedKillConfirmValid = false;
					} else {
						updatedSelections.hasSelectedKillConfirm = true;
						updatedSelections.selectedKillConfirmValid = true;
						// generating a new object for each character in the kill confirm, that includes static data from char attrs and some calculated stuff
						const percDiffs = [];
						let updatedKillConfirmCharacters = killConfirmToSet.characters.map((kcCharacter) => {
							const percDiff = kcCharacter.end - kcCharacter.start;
							const percents = {
								...kcCharacter,
								percDiff
							};

							// including raw data from the charAttrs.json file for each character
							const selectedCharAttrs = charAttrs.find((char) => char.id === kcCharacter.id);
							const updatedCharAttrs = { ...selectedCharAttrs, percents };
							// discluding percDiffs of 0 so they don't skew the difficulty curve calculations lower down
							if (percDiff !== 0) percDiffs.push(percDiff);
							return { ...updatedCharAttrs, ...kcCharacter };
						});

						// sorting characters
						const currentSort = sortBy.find((sort) => sort.sortingDirection !== null);
						if (currentSort) {
							if (currentSort.id === 'name') {
								if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
									updatedKillConfirmCharacters.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
								} else {
									updatedKillConfirmCharacters.sort((a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0));
								}
							}

							if (currentSort.id === 'weight') {
								if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
									updatedKillConfirmCharacters.sort((a, b) => (a.weight < b.weight ? -1 : a.weight > b.weight ? 1 : 0));
								} else {
									updatedKillConfirmCharacters.sort((a, b) => (a.weight > b.weight ? -1 : a.weight < b.weight ? 1 : 0));
								}
							}

							if (currentSort.id === 'difficulty') {
								if (characterToSet.id === 'zelda' && killConfirmToSet.id === 'dthrow-up-air') {
									// different difficulty sorting for smelly Zelda
									if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
										updatedKillConfirmCharacters.sort((a, b) => a.airdodgeStart - b.airdodgeStart);
									} else {
										updatedKillConfirmCharacters.sort((a, b) => b.airdodgeStart - a.airdodgeStart);
									}
								} else {
									if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
										updatedKillConfirmCharacters.sort((a, b) => b.percents.percDiff - a.percents.percDiff);
									} else {
										updatedKillConfirmCharacters.sort((a, b) => a.percents.percDiff - b.percents.percDiff);
									}
								}
							}

							if (currentSort.id === 'fallspeed') {
								if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
									updatedKillConfirmCharacters.sort((a, b) =>
										a.fallspeed < b.fallspeed ? -1 : a.fallspeed > b.fallspeed ? 1 : 0
									);
								} else {
									updatedKillConfirmCharacters.sort((a, b) =>
										a.fallspeed > b.fallspeed ? -1 : a.fallspeed < b.fallspeed ? 1 : 0
									);
								}
							}

							if (currentSort.id === 'gravity') {
								if (currentSort.sortingDirection === null || currentSort.sortingDirection === 'descending') {
									updatedKillConfirmCharacters.sort((a, b) =>
										a.gravity < b.gravity ? -1 : a.gravity > b.gravity ? 1 : 0
									);
								} else {
									updatedKillConfirmCharacters.sort((a, b) =>
										a.gravity > b.gravity ? -1 : a.gravity < b.gravity ? 1 : 0
									);
								}
							}
						}

						// calculating an average between percent differences to determine the 'difficulty' of the kill confirm on each character
						// since the total range changes between character to character, there can't be an absolute value for determining this - an average must be taken of all start/end differences for that particular kill confirm
						const sumOfPercDiffs = percDiffs.reduce((a, b) => a + b);
						const percentAverage = sumOfPercDiffs / percDiffs.length;

						// now calculate the percents to iterate by. Assuming there are 5 difficulty levels, take sum and divide by midway for average. So sum / 2.5
						// this calculates how much to iterate each percent by
						const diffIterator = Math.floor(percentAverage / 2.5);

						let counter = currentSort.sortingDirection === 'descending' ? 1 : updatedKillConfirmCharacters.length;
						for (const kcCharacter of updatedKillConfirmCharacters) {
							const diffObj = {
								difficultyClass: '',
								difficultyText: ''
							};
							kcCharacter.charIndex = counter;
							if (characterToSet.id === 'zelda' && killConfirmToSet.id === 'dthrow-up-air') {
								// alternative difficulty just for Zelda based on the victim's airdodge frames (thanks Zelda)
								if (kcCharacter.airdodgeStart === 1) {
									diffObj.difficultyText = 'Very Hard';
									diffObj.difficultyClass = 'very-hard';
								} else if (kcCharacter.airdodgeStart === 2) {
									diffObj.difficultyText = 'Hard';
									diffObj.difficultyClass = 'hard';
								} else if (kcCharacter.airdodgeStart === 3) {
									diffObj.difficultyText = 'Average';
									diffObj.difficultyClass = 'average';
								} else if (kcCharacter.airdodgeStart === 4) {
									diffObj.difficultyText = 'Easy';
									diffObj.difficultyClass = 'easy';
								}
							} else {
								if (0 <= kcCharacter.percents.percDiff && kcCharacter.percents.percDiff <= diffIterator) {
									diffObj.difficultyText = 'Very Hard';
									diffObj.difficultyClass = 'very-hard';
								} else if (
									diffIterator <= kcCharacter.percents.percDiff &&
									kcCharacter.percents.percDiff <= diffIterator * 2
								) {
									diffObj.difficultyText = 'Hard';
									diffObj.difficultyClass = 'hard';
								} else if (
									diffIterator * 2 <= kcCharacter.percents.percDiff &&
									kcCharacter.percents.percDiff <= diffIterator * 3
								) {
									diffObj.difficultyText = 'Average';
									diffObj.difficultyClass = 'average';
								} else if (
									diffIterator * 3 <= kcCharacter.percents.percDiff &&
									kcCharacter.percents.percDiff <= diffIterator * 4
								) {
									diffObj.difficultyText = 'Easy';
									diffObj.difficultyClass = 'easy';
								} else if (diffIterator * 4 <= kcCharacter.percents.percDiff) {
									diffObj.difficultyText = 'Very Easy';
									diffObj.difficultyClass = 'very-easy';
								} else {
									diffObj.difficultyText = '';
									diffObj.difficultyClass = '';
								}
							}

							kcCharacter.percents.difficultyText = diffObj.difficultyText;
							kcCharacter.percents.difficultyClass = diffObj.difficultyClass;

							// Am also spreading the stage data from stage-list into each character
							// can't do this from stageList.json... some characters like Pikachu don't have stage data for all stages. Gah.
							// A flatMap can be used to skip over stages we don't want to include in the modal. Convenient.
							// https://stackoverflow.com/a/55260552/9045925
							const kcStagePositions = killConfirmToSet.stageList.map((stage) => stage.id);
							const updatedStageListData = appData.stageList.flatMap((stage) => {
								// skipping stages that don't have an equivalent stage in the killConfirm stage modifier data
								if (!stage.stagePositions.find((kcStage) => kcStagePositions.includes(kcStage.id))) {
									return [];
								}
								if (stage.stagePositions.find((stagePosition) => stagePosition.id === 1));

								const newStagePositions = stage.stagePositions.map((stagePosition) => {
									const newStagePosition = { ...stagePosition };
									const killConfirmStageData = killConfirmToSet.stageList.find(
										(stageModifier) => stageModifier.id === newStagePosition.id
									);
									const { stagePositionModifier = 0 } = killConfirmStageData;

									const rageModifier = killConfirmToSet.rageModifiers.find((rageM) => rageM.id === activeRage);
									const rageModifierStart = rageModifier.start;
									const rageModifierEnd = rageModifier.end;

									newStagePosition.min = kcCharacter.percents.start + stagePositionModifier + rageModifierStart;
									// I guess in the app I could only use the stage data people provided. There were no modifiers for init max % on each stage
									newStagePosition.max = kcCharacter.percents.end + rageModifierEnd;
									return newStagePosition;
								});
								return { ...stage, stagePositions: newStagePositions };
							});

							kcCharacter.rageModifiers = [...killConfirmToSet.rageModifiers];
							kcCharacter.stageList = updatedStageListData;
							counter = currentSort.sortingDirection === 'descending' ? counter + 1 : counter - 1;
						}

						const updatedKillConfirmData = { ...killConfirmToSet, characters: updatedKillConfirmCharacters };
						updatedSelections.selectedKillConfirm = { ...updatedKillConfirmData };

						if (selectedCharacterModal) {
							const characterModalToSet = updatedKillConfirmData.characters.find(
								(kcCharacter) => kcCharacter.id === selectedCharacterModal
							);
							if (!characterModalToSet) {
								updatedSelections.selectedCharacterModalValid = false;
							} else {
								updatedSelections.selectedCharacterModalValid = true;
								updatedSelections.hasSelectedCharacterModal = true;
								updatedSelections.selectedCharacterModal = { ...characterModalToSet };
							}
						}
					}
				}
			}
		}
		setAppSelections(updatedSelections);
	}, [appData, defaultSelections, location, sortBy, activeRage]);

	return (
		<div className="app-grid">
			<h1 className="visually-hidden">
				A Super Smash Bros. for Wii U Progressive Web App for calculating kill confirm ranges.
			</h1>
			<div className="d-md-flex h-100">
				<aside className={`d-none sidebar ${sidebarOpen ? 'd-lg-block' : ''}`}>
					<Sidebar
						loading={loading}
						sidebarOpen={sidebarOpen}
						killConfirms={appData.killConfirms}
						selectedCharacter={appSelections.selectedCharacter}
						selectedKillConfirm={appSelections.selectedKillConfirm}
					/>
				</aside>
				<div className="d-flex flex-column main-grid">
					<Header
						loading={loading}
						setSidebarOpen={setSidebarOpen}
						sidebarOpen={sidebarOpen}
						selectedCharacter={appSelections.selectedCharacter}
						setModalShowAbout={setModalShowAbout}
						setModalShowCredits={setModalShowCredits}
					/>
					<main
						className={`${
							appSelections.hasSelectedCharacter && appSelections.hasSelectedKillConfirm ? 'show-character-tiles' : ''
						}`}
					>
						<div className="main-grid-wrapper">
							<CharacterMoveCards
								loading={loading}
								killConfirms={appData.killConfirms}
								selectedKillConfirm={appSelections.selectedKillConfirm}
							/>
							{loading ? null : (
								<>
									<CSSTransition
										in={appSelections.hasSelectedCharacter}
										timeout={1000}
										classNames="csstrans-fade"
										mountOnEnter
										unmountOnExit
									>
										<Route path={`/:characterId/:moveId`}>
											<CharacterTiles
												killConfirms={appData.killConfirms}
												stageList={appData.stageList}
												charAttrs={appData.charAttrs}
												selectedCharacter={appSelections.selectedCharacter}
												selectedKillConfirm={appSelections.selectedKillConfirm}
												selectedCharacterModal={appSelections.selectedCharacterModal}
												activeRage={activeRage}
												setActiveRage={setActiveRage}
												sortBy={sortBy}
												setSortBy={setSortBy}
											/>
										</Route>
									</CSSTransition>
									<ModalAbout modalShowAbout={modalShowAbout} setModalShowAbout={setModalShowAbout} />
									<ModalCredits
										modalShowCredits={modalShowCredits}
										setModalShowCredits={setModalShowCredits}
										killConfirms={appData.killConfirms}
									/>
								</>
							)}
						</div>
					</main>

					<div className={'toasts-container'}>
						<Toast show={!appSelections.selectedCharacterValid} animation={false}>
							<Toast.Body>
								Looks like this character does not exist.
								<br />
								Please check the URL.
							</Toast.Body>
						</Toast>
						<Toast show={!appSelections.selectedKillConfirmValid} animation={false}>
							<Toast.Body>
								This kill confirm does not exist.
								<br />
								Please check the URL.
							</Toast.Body>
						</Toast>
						<Toast show={!appSelections.selectedCharacterModalValid} animation={false}>
							<Toast.Body>
								This kill confirm modal does not exist.
								<br />
								Please check the URL.
							</Toast.Body>
						</Toast>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
