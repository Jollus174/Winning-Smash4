import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CharacterMoveCards from './components/CharacterMoveCards';
import CharacterTiles from './components/CharacterTiles';
import { Dropdown, Modal } from 'bootstrap';

function App() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [charAttrs, setCharAttrs] = useState([]);
	const [killConfirms, setKillConfirms] = useState([]);
	const [stageList, setStageList] = useState([]);

	const [selectedCharacter, setSelectedCharacter] = useState({});
	const [selectedKillConfirm, setSelectedKillConfirm] = useState({});

	// these sorters exist in a sort of 'tri-nary' state. 0 means off (sort not in action), 1 means sort descending, -1 means sort ascending
	// only one can be in action, so clicking one sets the others back to 0
	const [sortByName, setSortByName] = useState(1);
	const [sortByWeight, setSortByWeight] = useState(0);
	const [sortByDifficulty, setSortByDifficulty] = useState(0);
	const [sortByFallspeed, setSortByFallspeed] = useState(0);
	const [sortByGravity, setSortByGravity] = useState(0);

	const confirmSelectedKillConfirm = (character, move) => {
		// updating base character attributes with the percents and stage info from the kill confirm
		const updatedCharAttrs = [...charAttrs];
		const percDiffs = [];
		for (const char of updatedCharAttrs) {
			const percDiff = move.percents[char.id].end - move.percents[char.id].start;
			char.percents = {
				...move.percents[char.id],
				percDiff
			};

			if (percDiff !== 0) percDiffs.push(percDiff);
		}

		// calculating an average between percent differences to determine the 'difficulty' of the kill confirm on each character
		// since the total range changes between character to character, there can't be an absolute value for determining this - an average must be taken of all start/end differences for that particular kill confirm
		const sumOfPercDiffs = percDiffs.reduce((a, b) => a + b);
		const percentAverage = sumOfPercDiffs / percDiffs.length;

		// now calculate the percents to iterate by. Assuming there are 5 difficulty levels, take sum and divide by midway for average. So sum / 2.5
		// this calculates how much to iterate each percent by
		const diffIterator = Math.floor(percentAverage / 2.5);

		for (const char of updatedCharAttrs) {
			const diffObj = {
				diffClass: '',
				diffText: ''
			};
			if (character.charId !== 'zelda' && move.moveId !== 'dthrow-up-air') {
				if (0 <= char.percents.percDiff && char.percents.percDiff <= diffIterator) {
					diffObj.diffText = 'Very Hard';
					diffObj.diffClass = 'very-hard';
				} else if (diffIterator <= char.percents.percDiff && char.percents.percDiff <= diffIterator * 2) {
					diffObj.diffText = 'Hard';
					diffObj.diffClass = 'hard';
				} else if (diffIterator * 2 <= char.percents.percDiff && char.percents.percDiff <= diffIterator * 3) {
					diffObj.diffText = 'Average';
					diffObj.diffClass = 'average';
				} else if (diffIterator * 3 <= char.percents.percDiff && char.percents.percDiff <= diffIterator * 4) {
					diffObj.diffText = 'Easy';
					diffObj.diffClass = 'easy';
				} else if (diffIterator * 4 <= char.percents.percDiff) {
					diffObj.diffText = 'Very Easy';
					diffObj.diffClass = 'very-easy';
				} else {
					diffObj.diffText = 'Blah';
					diffObj.diffClass = 'blah';
				}
			} else {
				// alternative difficulty just for Zelda based on the victim's airdodge frames (thanks Zelda)
				if (char.airdodgeStart === 1) {
					diffObj.diffText = 'Very Hard';
					diffObj.diffClass = 'very-hard';
				} else if (char.airdodgeStart === 2) {
					diffObj.diffText = 'Hard';
					diffObj.diffClass = 'hard';
				} else if (char.airdodgeStart === 3) {
					diffObj.diffText = 'Average';
					diffObj.diffClass = 'average';
				} else if (char.airdodgeStart === 4) {
					diffObj.diffText = 'Easy';
					diffObj.diffClass = 'easy';
				}
			}

			char.percents.diffText = diffObj.diffText;
			char.percents.diffClass = diffObj.diffClass;
		}


		updatedCharAttrs.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

		setCharAttrs(updatedCharAttrs);
		setSelectedCharacter(character);
		setSelectedKillConfirm(move);

		// resetting sorters
		setSortByName(1);
		setSortByWeight(0);
		setSortByDifficulty(0);
		setSortByFallspeed(0);
		setSortByGravity(0);
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

	const setInitialData = () => {
		setLoading(true);
		const baseURL = 'http://localhost:3000';
		const requests = {
			charAttrs: getData(`${baseURL}/data/char-attrs.json`),
			killConfirms: getData(`${baseURL}/data/kill-confirms.json`),
			stageList: getData(`${baseURL}/data/stage-list.json`)
		};

		Promise.all(Object.values(requests))
			.then((responses) => {
				// console.log(responses);
				const [charAttrs, killConfirms, stageList] = responses;

				setCharAttrs(charAttrs);
				setKillConfirms(killConfirms);
				setStageList(stageList);

				setLoading(false);
			})
			.catch((err) => {
				console.error('The app failed to load.', err);
			});
	};

	// empty array means executes only once
	useEffect(() => {
		if (!mounted) {
			setMounted(true);
			setInitialData();

			// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
			let vh = window.innerHeight * 0.01;
			// Then we set the value in the --vh custom property to the root of the document
			document.documentElement.style.setProperty('--vh', vh + 'px');

			// We listen to the resize event
			window.addEventListener('resize', () => {
				// We execute the same script as before
				vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', vh + 'px');
			});
		} else {
			console.log('has already mounted!');
		}
		// page changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="app-grid">
			<h1 className="visually-hidden">
				A Super Smash Bros. for Wii U Progressive Web App for calculating kill confirm ranges.
			</h1>
			{/* Flex on mobile with Pikachu open causes issues with Move Select buttons and x overscroll */}
			<div className="d-md-flex h-100">
				{loading ? (
					'Is loading'
				) : (
					<Sidebar
						sidebarOpen={sidebarOpen}
						moveCards={killConfirms}
						confirmSelectedKillConfirm={confirmSelectedKillConfirm}
					/>
				)}
				<div className="d-flex flex-column main-grid">
					{loading ? (
						'Is loading'
					) : (
						<Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} selectedCharacter={selectedCharacter} />
					)}
					<main>
						{loading ? (
							'Is loading'
						) : (
							<>
								<CharacterMoveCards moveCards={killConfirms} confirmSelectedKillConfirm={confirmSelectedKillConfirm} />
								<CharacterTiles
									charAttrs={charAttrs}
									setCharAttrs={setCharAttrs}
									setSelectedCharacter={setSelectedCharacter}
									selectedCharacter={selectedCharacter}
									setSelectedKillConfirm={setSelectedKillConfirm}
									selectedKillConfirm={selectedKillConfirm}
									confirmSelectedKillConfirm={confirmSelectedKillConfirm}
									sortByName={sortByName}
									setSortByName={setSortByName}
									sortByWeight={sortByWeight}
									setSortByWeight={setSortByWeight}
									sortByDifficulty={sortByDifficulty}
									setSortByDifficulty={setSortByDifficulty}
									sortByFallspeed={sortByFallspeed}
									setSortByFallspeed={setSortByFallspeed}
									sortByGravity={sortByGravity}
									setSortByGravity={setSortByGravity}
								/>
								<ModalStagePercents stageList={stageList} />
							</>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}

export default App;
