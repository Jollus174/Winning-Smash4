import React from 'react';
import { useState } from 'react';

const ModalStagePercents = ({
	stageList,
	selectedCharacter,
	selectedCharacterModal,
	setSelectedCharacterModal,
	handleSelectedKillConfirm,
	filteredCharAttrs
}) => {
	// rage50, rage60, rage80, etc
	const [activeRage, setActiveRage] = useState('rage0');

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
		if (key === 'ArrowLeft') goToPrevCharacter();
		if (key === 'ArrowRight') goToNextCharacter();
		if (key === '1' || key === '8' || key === '9' || key === '0') setActiveRage('rage0');
		if (key === '2') setActiveRage('rage50');
		if (key === '3') setActiveRage('rage60');
		if (key === '4') setActiveRage('rage80');
		if (key === '5') setActiveRage('rage100');
		if (key === '6') setActiveRage('rage125');
		if (key === '7') setActiveRage('rage150');
	};

	return (
		// TODO: set up the aria- stuff since these modals will have slightly different content each time
		// https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content
		<>
			<style>
				{`
					.modal-backdrop {
						--bs-backdrop-bg: rgb(${selectedCharacterModal.charColor});
						--bs-backdrop-opacity: 0.95;
					}
				`}
			</style>
			<div
				className="modal modal-stage-list"
				id="modal-stage"
				tabIndex="-1"
				aria-labelledby="character-name"
				aria-hidden="true"
				onKeyDown={handleKeyPress}
				style={{ '--bs-backdrop-bg': 'rgb(' + selectedCharacterModal.charColor + ')' }}
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							{selectedCharacter.moves?.length > 1 ? (
								<div className="btn-group">
									{selectedCharacter.moves.map((move) => (
										<button
											type="button"
											className="btn btn-primary"
											dangerouslySetInnerHTML={{ __html: move.moveName }}
											onClick={() => handleSelectedKillConfirm(selectedCharacter, move)}
											key={move.moveId}
										/>
									))}
								</div>
							) : null}
							<div className="d-flex">
								<img
									src={`/images/characters/webp/${selectedCharacterModal.id}.webp`}
									alt={selectedCharacterModal.name}
								/>
								<div className="info">
									<div>
										{selectedCharacterModal.percents?.start} - {selectedCharacterModal.percents?.end}%
									</div>
									<div>
										{selectedCharacterModal.percents?.diffText} - {selectedCharacterModal.percents?.percDiff}%
									</div>
									{selectedCharacterModal.percents?.distance ? (
										<div>{selectedCharacterModal.percents?.distance}</div>
									) : null}
									<div id="character-name">{selectedCharacterModal.name}</div>
								</div>

								<div className="more-info">
									<div>Weight {selectedCharacterModal.weight}</div>
									<div>Fallspeed {selectedCharacterModal.fallspeed}</div>
									<div>
										Airdodge {selectedCharacterModal.airdodgeStart} - {selectedCharacterModal.airdodgeEnd}
									</div>
									<div>Gravity {selectedCharacterModal.gravity}</div>
								</div>
							</div>

							<div className="rage-modifier text-center">
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
							</div>
							{/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
						</div>
						<div className="modal-body">
							<div className="stages">
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
							</div>
						</div>
						<button type="button" className="btn btn-secondary btn-prev" onClick={goToPrevCharacter}>
							<span className="visually-hidden">Previous character</span>
							<i className="fa fa-angle-left" aria-hidden="true"></i>
						</button>
						<button type="button" className="btn btn-secondary btn-next" onClick={goToNextCharacter}>
							<span className="visually-hidden">Next character</span>
							<i className="fa fa-angle-right" aria-hidden="true"></i>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalStagePercents;
