// TODO: unused /* globals */ ?

import { useEffect, useState } from 'react';
import { Link, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CharacterMoveCards from './components/CharacterMoveCards';
import CharacterTiles from './components/CharacterTiles';
import ModalAbout from './components/ModalAbout';
import ModalCredits from './components/ModalCredits';

function App() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [charAttrs, setCharAttrs] = useState([]);
	const [killConfirms, setKillConfirms] = useState([]);
	const [stageList, setStageList] = useState([]);

	const [selectedCharacter, setSelectedCharacter] = useState({});
	const [selectedKillConfirm, setSelectedKillConfirm] = useState({});

	const [selectedCharacterModal, setSelectedCharacterModal] = useState({});

	const [modalShowAbout, setModalShowAbout] = useState(false);
	const [modalShowCredits, setModalShowCredits] = useState(false);

	// TODO: fallback if character doesn't exist

	const refreshStageList = (character) => {
		// spreading in selected kill confirm percents to each stage, based on the selected character modal
		const updatedStageList = [...stageList];
		for (const stage of updatedStageList) {
			for (const stagePosition of stage.stagePositions) {
				const killConfirmStageData = selectedKillConfirm.stageList.find(
					(stageModifier) => stageModifier.id === stagePosition.id
				);
				const { stagePositionModifier = 0 } = killConfirmStageData;

				// const rageModifierStart = selectedKillConfirm[activeRage].start || 0;
				// const rageModifierEnd = selectedKillConfirm[activeRage].end || 0;
				// console.log(rageModifierStart);
				// console.log(rageModifierEnd);
				const rageModifierStart = 0;
				const rageModifierEnd = 0;

				stagePosition.min =
					selectedKillConfirm.percents[character.id].start + stagePositionModifier + rageModifierStart;
				// I guess in the app I could only use the stage data people provided. There were no modifiers for init max % on each stage
				stagePosition.max = selectedKillConfirm.percents[character.id].end + rageModifierEnd;
			}
		}
		setStageList(updatedStageList);
	};

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

			// set initial data
			setLoading(true);
			const baseURL = 'http://localhost:3000';
			const requests = {
				charAttrs: getData(`${baseURL}/data/char-attrs.json`),
				killConfirms: getData(`${baseURL}/data/kill-confirms.json`),
				stageList: getData(`${baseURL}/data/stage-list.json`)
			};

			Promise.all(Object.values(requests))
				.then((responses) => {
					const [charAttrs, killConfirms, stageList] = responses;

					// TODO: this could become one giant object to prevent 2 of these 3 re-renders
					setCharAttrs(charAttrs);
					setKillConfirms(killConfirms);
					setStageList(stageList);

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
		const [, characterId, killConfirmId, selectedCharacterModal] = location.pathname.split('/');
		const characterToSet = killConfirms.find((killConfirm) => killConfirm.id === characterId);
		if (characterToSet) {
			setSelectedCharacter(characterToSet);

			const killConfirmToSet = characterToSet.moves.find((killConfirm) => killConfirm.id === killConfirmId);
			if (killConfirmToSet) {
				// generating a new object for each character in the kill confirm, that includes static data from char attrs and some calculated stuff
				const percDiffs = [];
				const updatedKillConfirmCharacters = killConfirmToSet.characters.map((kcCharacter) => {
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

				// calculating an average between percent differences to determine the 'difficulty' of the kill confirm on each character
				// since the total range changes between character to character, there can't be an absolute value for determining this - an average must be taken of all start/end differences for that particular kill confirm
				const sumOfPercDiffs = percDiffs.reduce((a, b) => a + b);
				const percentAverage = sumOfPercDiffs / percDiffs.length;

				// now calculate the percents to iterate by. Assuming there are 5 difficulty levels, take sum and divide by midway for average. So sum / 2.5
				// this calculates how much to iterate each percent by
				const diffIterator = Math.floor(percentAverage / 2.5);

				for (const kcCharacter of updatedKillConfirmCharacters) {
					const diffObj = {
						difficultyClass: '',
						difficultyText: ''
					};
					if (characterToSet.id !== 'zelda' && killConfirmToSet.id !== 'dthrow-up-air') {
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
					} else {
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
					}

					kcCharacter.percents.difficultyText = diffObj.difficultyText;
					kcCharacter.percents.difficultyClass = diffObj.difficultyClass;
				}

				updatedKillConfirmCharacters.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

				const updatedKillConfirmData = { ...killConfirmToSet, characters: updatedKillConfirmCharacters };
				setSelectedKillConfirm(updatedKillConfirmData);

				// const selectedCharacterModalToSet = characterToSet.moves.find((killConfirm) => killConfirm.id === killConfirmId);
				// if (kill)
				// setSelectedCharacterModal
			}
		}
	}, [killConfirms, charAttrs, location]);

	return (
		<div className="app-grid">
			<h1 className="visually-hidden">
				A Super Smash Bros. for Wii U Progressive Web App for calculating kill confirm ranges.
			</h1>
			<div className="d-md-flex h-100">
				{loading ? (
					'Is loading'
				) : (
					<Sidebar
						sidebarOpen={sidebarOpen}
						killConfirms={killConfirms}
						selectedCharacter={selectedCharacter}
						selectedKillConfirm={selectedKillConfirm}
					/>
				)}
				<div className="d-flex flex-column main-grid">
					{loading ? (
						'Is loading'
					) : (
						<Header
							setSidebarOpen={setSidebarOpen}
							sidebarOpen={sidebarOpen}
							selectedCharacter={selectedCharacter}
							setModalShowAbout={setModalShowAbout}
							setModalShowCredits={setModalShowCredits}
						/>
					)}
					<main>
						{loading ? (
							'Is loading'
						) : (
							<>
								<CharacterMoveCards killConfirms={killConfirms} selectedKillConfirm={selectedKillConfirm} />
								<Route path={`/:characterId/:moveId`}>
									{Object.keys(selectedKillConfirm).length ? (
										<CharacterTiles
											killConfirms={killConfirms}
											setSelectedKillConfirm={setSelectedKillConfirm}
											stageList={stageList}
											charAttrs={charAttrs}
											setCharAttrs={setCharAttrs}
											setSelectedCharacter={setSelectedCharacter}
											selectedCharacter={selectedCharacter}
											selectedKillConfirm={selectedKillConfirm}
											selectedCharacterModal={selectedCharacterModal}
											setSelectedCharacterModal={setSelectedCharacterModal}
											refreshStageList={refreshStageList}
										/>
									) : null}
								</Route>
								<ModalAbout modalShowAbout={modalShowAbout} setModalShowAbout={setModalShowAbout} />
								<ModalCredits
									modalShowCredits={modalShowCredits}
									setModalShowCredits={setModalShowCredits}
									killConfirms={killConfirms}
								/>
							</>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;
