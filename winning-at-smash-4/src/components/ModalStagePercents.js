import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ModalStagePercents = ({
	stageList,
	selectedCharacter,
	modalShowStageList,
	setModalShowStageList,
	selectedCharacterModal,
	setSelectedCharacterModal,
	selectedKillConfirm,
	handleSelectedKillConfirm,
	filteredCharAttrs
}) => {
	// rage50, rage60, rage80, etc
	const [activeRage, setActiveRage] = useState('rage0');

	if (!Object.keys(selectedCharacterModal).length) return;

	const RageButton = ({ text, value }) => {
		return (
			<button
				type="button"
				className={`btn btn-secondary ${activeRage === value ? 'active' : ''}`}
				onClick={() => setActiveRage(value)}
			>
				{text}%
			</button>
		);
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
		if (key === '1' || key === '8' || key === '9' || key === '0') setActiveRage('rage0');
		if (key === '2') setActiveRage('rage50');
		if (key === '3') setActiveRage('rage60');
		if (key === '4') setActiveRage('rage80');
		if (key === '5') setActiveRage('rage100');
		if (key === '6') setActiveRage('rage125');
		if (key === '7') setActiveRage('rage150');
	};

	const handleModalShow = () => {
		document.addEventListener('keydown', handleKeyPress);
	};

	const handleModalHide = () => {
		setModalShowStageList(false);
		setSelectedCharacterModal({});
		document.removeEventListener('keydown', handleKeyPress);
	};

	return (
		// TODO: set up the aria- stuff since these modals will have slightly different content each time
		// https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content
		<>
			<Modal
				className="modal modal-stage-list"
				aria-labelledby="character-name"
				show={modalShowStageList}
				onShow={handleModalShow}
				onHide={handleModalHide}
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
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							{selectedCharacter.moves.length > 1 ? (
								<div className="character-topbar">
									<div className="btn-group">
										{selectedCharacter.moves.map((move) => (
											<button
												type="button"
												className={`btn btn-primary btn-sm ${
													selectedKillConfirm.moveId === move.moveId ? 'active' : ''
												}`}
												style={{ '--bs-btn-bg': 'rgb(' + selectedCharacterModal.charColor + ')' }}
												onClick={() => handleSelectedKillConfirm(selectedCharacter, move)}
												key={move.moveId}
											>
												<span dangerouslySetInnerHTML={{ __html: move.moveName }} />
											</button>
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
											<div className={`item easy ${selectedCharacterModal.percents.diffClass}`}>
												{selectedCharacterModal.percents.diffText} - {selectedCharacterModal.percents.percDiff}%
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
									<RageButton text={'0'} value={'rage0'} />
									<RageButton text={'50'} value={'rage50'} />
									<RageButton text={'60'} value={'rage60'} />
									<RageButton text={'80'} value={'rage80'} />
									<RageButton text={'100'} value={'rage100'} />
									<RageButton text={'125'} value={'rage125'} />
									<RageButton text={'150'} value={'rage150'} />
								</div>
							</section>
							{/* TODO: include 'Close' button */}
							{/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
						</div>
						<div className="modal-body">
							<section className="stages">
								{Object.values(stageList).map((stage) => (
									<div className="stage" style={{ '--stage-color': stage.color }} key={stage.id}>
										<div className="stage-title text-center text-uppercase">
											<h5 className="h6">{stage.name}</h5>
										</div>
										<div className="stage-details">
											<div className="row row-stage-details">
												<div className="col-md-3">
													<img className="img-fluid" src={`/images/stages/${stage.imageFile}`} alt={'stage.name'} />
												</div>
												<div className="col-md-9 col-tables">
													{stage.tables.map((table) => (
														<table
															className="table table-bordered table-sm"
															cellPadding="0"
															cellSpacing="0"
															border="0"
															key={table.id}
														>
															<thead>
																<tr>
																	<th colSpan="3">{table.stagePartName}</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<th>Min %</th>
																	<th>Max %</th>
																	<th>Window</th>
																</tr>
																<tr>
																	<td>{`${table.min}%`}</td>
																	<td>{`${table.max}%`}</td>
																	{/* would be nice to use a 'calculatePercDiff()' function for this instead */}
																	<td>{table.max - table.min > 0 ? `±${table.max - table.min}` : `N/A`}</td>
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
							<button
								type="button"
								id="btn-prev"
								className={`btn btn-secondary btn-prev ${
									selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
								}`}
								onClick={goToPrevCharacter}
							>
								<span className="visually-hidden">Previous character</span>
								<i className="fa fa-angle-left" aria-hidden="true"></i>
							</button>
							<button
								type="button"
								id="btn-next"
								className={`btn btn-secondary btn-next ${
									selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
								}`}
								onClick={goToNextCharacter}
							>
								<span className="visually-hidden">Next character</span>
								<i className="fa fa-angle-right" aria-hidden="true"></i>
							</button>
						</nav>

						<div
							class={`legend-keys d-none d-md-flex ${
								selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
							}
						`}
						>
							<div>
								<svg class="icon-keyboard" viewBox="0 0 100 70" width="100%" height="100%">
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
							<div
								class={`legend-key-escape ${selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'}`}
							>
								<span>ESC</span>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ModalStagePercents;
