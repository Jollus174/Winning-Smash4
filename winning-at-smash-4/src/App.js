import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CharacterMoveCards from './components/CharacterMoveCards';

function App() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [charAttrs, setCharAttrs] = useState([]);
	const [killConfirms, setKillConfirms] = useState([]);
	const [stageList, setStageList] = useState([]);

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
		} else {
			console.log('has already mounted!');
		}
		// page changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  return (
		<div>
			<h1 className="visually-hidden">
				A Super Smash Bros. for Wii U Progressive Web App for calculating kill confirm ranges.
			</h1>
			<div className="d-flex">
				{loading ? 'Is loading' : <Sidebar moveCards={killConfirms} />}
				<div className="d-flex flex-column">
					{loading ? 'Is loading' : <Header />}
					<main>{loading ? 'Is loading' : <CharacterMoveCards moveCards={killConfirms} />}</main>
				</div>
			</div>
    </div>
  );
}

export default App;
