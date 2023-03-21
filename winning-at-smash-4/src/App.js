import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CharacterMoveCards from './components/CharacterMoveCards';
import CharacterTiles from './components/CharacterTiles';

function App() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [charAttrs, setCharAttrs] = useState([]);
	const [killConfirms, setKillConfirms] = useState([]);
	const [stageList, setStageList] = useState([]);

	const [selectedCharacter, setSelectedCharacter] = useState({});
	const [selectedKillConfirm, setSelectedKillConfirm] = useState({});

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
						setSelectedCharacter={setSelectedCharacter}
						setSelectedKillConfirm={setSelectedKillConfirm}
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
								<CharacterMoveCards
									moveCards={killConfirms}
									setSelectedCharacter={setSelectedCharacter}
									setSelectedKillConfirm={setSelectedKillConfirm}
								/>
								<CharacterTiles
									charAttrs={charAttrs}
									setCharAttrs={setCharAttrs}
									setSelectedCharacter={setSelectedCharacter}
									selectedCharacter={selectedCharacter}
									setSelectedKillConfirm={setSelectedKillConfirm}
									selectedKillConfirm={selectedKillConfirm}
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
