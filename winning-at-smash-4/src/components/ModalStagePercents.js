import { Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

const ModalStagePercents = (props) => {
	const {
		url,
		selectedCharacter,
		selectedKillConfirm,
		selectedCharacterModal,
		activeRage,
		setActiveRage,
		filteredKillConfirmCharacters
	} = props;

	const history = useHistory();

	const handleSetActiveRage = (rageValue) => {
		setActiveRage(rageValue);
	};

	// checking filtered characters, and making sure they have a diff percent greater than 0
	// if they don't, then get check the next one, and so on
	const goToPrevCharacter = () => {
		let counter = 1;

		// keep searching through previous characters until one is found that's valid ie. percDiff is NOT 0
		const closureLoop = () => {
			const findPrevCharacter = (i) => {
				const currentCharIndex = filteredCharAttrs.findIndex((char) => char.id === selectedCharacterModal.id);
				// either get the previous valid character via index or count backwrds from the end of the characters array
				return currentCharIndex !== 0
					? filteredCharAttrs[currentCharIndex - i]
					: filteredCharAttrs[filteredCharAttrs.length - 1 + (i - 1)];
			};

			const prevCharacter = findPrevCharacter(counter);
			if (prevCharacter.percents.percDiff === 0) {
				counter++;
				return closureLoop(counter);
			} else {
				setSelectedCharacterModal(prevCharacter);
				setActiveRage('rage0');
				refreshStageList(prevCharacter, selectedKillConfirm);
			}
		};

		closureLoop();
	};

	const goToNextCharacter = () => {
		let counter = 1;

		const closureLoop = () => {
			const findNextCharacter = (i) => {
				const currentCharIndex = filteredCharAttrs.findIndex((char) => char.id === selectedCharacterModal.id);

				// either get the next valid character via index or count forwards from the start of the characters array
				return currentCharIndex !== filteredCharAttrs.length - 1
					? filteredCharAttrs[currentCharIndex + i]
					: filteredCharAttrs[0 + (i - 1)];
			};

			const nextCharacter = findNextCharacter(counter);
			if (nextCharacter.percents.percDiff === 0) {
				counter++;
				return closureLoop(counter);
			} else {
				setSelectedCharacterModal(nextCharacter);
				setActiveRage('rage0');
				refreshStageList(nextCharacter, selectedKillConfirm);
			}
		};

		closureLoop();
	};

	const handleKeyPress = (e) => {
		const { key } = e;
		if (key === 'ArrowLeft') {
			// for some reason this doesn't work properly, but imitating a click on the DOM element does. Whack.
			// goToPrevCharacter();
			document.querySelector('#btn-prev').click();
		}
		if (key === 'ArrowRight') {
			// goToNextCharacter();
			document.querySelector('#btn-next').click();
		}
		if (key === '1' || key === '8' || key === '9' || key === '0') handleSetActiveRage('rage0');
		if (key === '2') handleSetActiveRage('rage50');
		if (key === '3') handleSetActiveRage('rage60');
		if (key === '4') handleSetActiveRage('rage80');
		if (key === '5') handleSetActiveRage('rage100');
		if (key === '6') handleSetActiveRage('rage125');
		if (key === '7') handleSetActiveRage('rage150');
	};

	const handleModalShow = () => {
		document.addEventListener('keydown', handleKeyPress);
	};

	const handleModalHide = () => {
		// document.removeEventListener('keydown', handleKeyPress);
		history.push(url);
	};

	return (
		// TODO: set up the aria- stuff since these modals will have slightly different content each time
		// https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content
		<>
			<Modal
				className="modal modal-stage-list"
				aria-labelledby="character-name"
				show={true}
				onHide={handleModalHide}
				centered={true}
				animation={false}
				style={{
					'--btn-color': 'rgb(' + selectedCharacterModal.charColor + ')'
				}}
			>
				<style>
					{`
						.modal-backdrop {
							--bs-backdrop-bg: rgb(${selectedCharacterModal.charColor});
							--bs-backdrop-opacity: 0.95;
						}
					`}
				</style>
				<button
					type="button"
					className={`btn btn-sm btn-close ${
						selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
					}`}
					aria-label="Close"
					onClick={handleModalHide}
				>
					<svg className="icon-arrowback" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"></path>
						<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
					</svg>
				</button>
				<div className="modal-header">
					{selectedCharacter.moves.length > 1 ? (
						<div className="character-topbar">
							<div className="btn-group">
								{selectedCharacter.moves.map((move) => (
									<Link
										to={`../../${selectedCharacter.id}/${move.id}/${selectedCharacterModal.id}`}
										className={`btn btn-primary btn-sm ${selectedKillConfirm.id === move.id ? 'active' : ''}`}
										style={{ '--bs-btn-bg': 'rgb(' + selectedCharacterModal.charColor + ')' }}
										key={move.id}
									>
										<span dangerouslySetInnerHTML={{ __html: move.name }} />
									</Link>
								))}
							</div>
						</div>
					) : null}
					<section className="character-info-section">
						<img
							src={`/images/characters/webp/${selectedCharacterModal.id}.webp`}
							alt={selectedCharacterModal.name}
							className="character-image"
						/>
						<div className="character-info-wrapper">
							<div className="character-info">
								<div className="item grid-percent-range">
									{selectedCharacterModal.percents.start} - {selectedCharacterModal.percents.end}%
								</div>
								<div className="d-flex flex-column align-items-start grid-difficulty">
									<div className={`item easy ${selectedCharacterModal.percents.difficultyClass}`}>
										{selectedCharacterModal.percents.difficultyText} - {selectedCharacterModal.percents.percDiff}%
									</div>
									{selectedCharacterModal.percents.distance ? (
										<div className="item special-info">{selectedCharacterModal.percents.distance}</div>
									) : null}
								</div>
							</div>
							<div id="character-name" className="character-name">
								<h3 className="h6 m-0 text-uppercase">{selectedCharacterModal.name}</h3>
							</div>
						</div>

						<ul
							className={`list-unstyled m-0 more-info ${
								selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
							}`}
						>
							<li>
								<span>Weight</span> <span>{selectedCharacterModal.weight}</span>
							</li>
							<li>
								<span>Fallspeed</span> <span>{selectedCharacterModal.fallspeed}</span>
							</li>
							<li>
								<span>Airdodge</span>{' '}
								<span>
									{selectedCharacterModal.airdodgeStart} - {selectedCharacterModal.airdodgeEnd}
								</span>
							</li>
							<li>
								<span>Gravity</span> <span>{selectedCharacterModal.gravity}</span>
							</li>
						</ul>
					</section>

					<section className="rage-modifier text-center">
						<h3 className="rage-modifier-title text-uppercase">{selectedCharacterModal.name} Rage Modifier</h3>
						<div className="btn-group">
							{selectedCharacterModal.rageModifiers.map((rageModifier) => (
								<button
									type="button"
									className={`btn btn-secondary ${activeRage === rageModifier.id ? 'active' : ''}`}
									key={rageModifier.id}
									onClick={() => handleSetActiveRage(rageModifier.id)}
								>
									{rageModifier.amount}%
								</button>
							))}
						</div>
					</section>
				</div>
				<div className="modal-body">
					<section className="stages">
						{selectedCharacterModal.stageList.map((stage) => (
							<div className="stage" style={{ '--stage-color': stage.color }} key={stage.id}>
								<div className="stage-title text-center text-uppercase">
									<h5 className="h6">{stage.name}</h5>
								</div>
								<div className="stage-details">
									<div className="row row-stage-details">
										<div className="col-md-3">
											<img className="img-fluid" src={`/images/stages/${stage.imageFile}`} alt={stage.name} />
										</div>
										<div className="col-md-9 col-tables">
											{stage.stagePositions.map((stagePosition) => (
												<table
													className="table table-bordered table-sm"
													cellPadding="0"
													cellSpacing="0"
													border="0"
													key={stagePosition.id}
												>
													<thead>
														<tr>
															<th colSpan="3">{stagePosition.stagePartName}</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<th>Min %</th>
															<th>Max %</th>
															<th>Window</th>
														</tr>
														<tr>
															<td>{`${stagePosition.min <= stagePosition.max ? stagePosition.min + '%' : 'N/A'}`}</td>
															<td>{`${stagePosition.min <= stagePosition.max ? stagePosition.max + '%' : 'N/A'}`}</td>
															<td className="cell-window">
																{stagePosition.min <= stagePosition.max
																	? `±${stagePosition.max - stagePosition.min + 1}`
																	: `-`}
															</td>
														</tr>
													</tbody>
												</table>
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</section>
				</div>
				<nav>
					<Link
						to={`${url}/${
							filteredKillConfirmCharacters[
								filteredKillConfirmCharacters.findIndex((char) => char.id === selectedCharacterModal.id)
							].id
						}`}
						id="btn-prev"
						className={`btn btn-secondary btn-prev ${
							selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
						}`}
					>
						<span className="visually-hidden">Previous character</span>
						<i className="fa fa-angle-left" aria-hidden="true"></i>
					</Link>
					<Link
						to={`${url}/${nextCharacter.id}`}
						id="btn-next"
						className={`btn btn-secondary btn-next ${
							selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
						}`}
					>
						<span className="visually-hidden">Next character</span>
						<i className="fa fa-angle-right" aria-hidden="true"></i>
					</Link>
				</nav>

				<div
					className={`legend-keys d-none d-md-flex ${
						selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
					}
						`}
				>
					<div className="legend-key legend-key-keyboard">
						<svg className="icon-keyboard" viewBox="0 0 100 70" width="100%" height="100%">
							<title>keyboard</title>
							<path
								d="M 60.94,1.83 39.22,1.83 C 36.71,1.83 34.67,3.86 34.67,6.376 L 34.67,28.1 C 34.67,30.61 36.71,32.65 39.22,32.65 L 60.94,32.65 C 63.45,32.65 65.5,30.61 65.5,28.1 L 65.5,6.376 C 65.5,3.86 63.45,1.83 60.94,1.83 Z M 44.79,18.63 50.08,11.74 55.37,18.63 Z"
								opacity="0.2"
							></path>
							<path
								d="M 60.86,36.75 39.14,36.75 C 36.63,36.75 34.59,38.79 34.59,41.3 L 34.59,63.02 C 34.59,65.53 36.63,67.57 39.14,67.57 L 60.86,67.57 C 63.38,67.57 65.41,65.53 65.41,63.02 L 65.41,41.3 C 65.42,38.79 63.38,36.75 60.86,36.75 Z M 50.08,57.45 44.79,50.55 55.37,50.55 Z"
								opacity="0.2"
							></path>
							<path d="M 95.45,36.75 73.73,36.75 C 71.22,36.75 69.18,38.79 69.18,41.3 L 69.18,63.02 C 69.18,65.53 71.22,67.57 73.73,67.57 L 95.45,67.57 C 97.97,67.57 100,65.53 100,63.02 L 100,41.3 C 100,38.79 97.97,36.75 95.45,36.75 Z M 83.4,57.45 83.4,46.86 90.3,52.16 Z"></path>
							<path d="M 26.27,36.75 4.55,36.75 C 2.037,36.75 0,38.79 0,41.3 L 0,63.02 C 0,65.53 2.037,67.57 4.55,67.57 L 26.27,67.57 C 28.78,67.57 30.82,65.53 30.82,63.02 L 30.82,41.3 C 30.82,38.79 28.78,36.75 26.27,36.75 Z M 16.69,57.45 9.79,52.16 16.69,46.86 Z"></path>
						</svg>
					</div>
					<div className="legend-key legend-key-escape">
						<div
							className={`icon-key-escape ${selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'}`}
						>
							<span>ESC</span>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalStagePercents;
