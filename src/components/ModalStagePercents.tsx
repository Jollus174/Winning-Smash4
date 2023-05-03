import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import {
	Character,
	KillConfirm,
	SelectedKillConfirm,
	SelectedCharacterModal,
	UpdatedCharacter,
	ActiveRage
} from '../types';

interface ModalStagePercentsTypes {
	url: string;
	selectedCharacter: KillConfirm;
	selectedKillConfirm: SelectedKillConfirm;
	selectedCharacterModal: SelectedCharacterModal;
	activeRage: ActiveRage;
	setActiveRage: React.Dispatch<React.SetStateAction<ActiveRage>>;
	filteredKillConfirmCharacters: Array<UpdatedCharacter>;
}

const ModalStagePercents: React.FC<ModalStagePercentsTypes> = ({
	url,
	selectedCharacter,
	selectedKillConfirm,
	selectedCharacterModal,
	activeRage,
	setActiveRage,
	filteredKillConfirmCharacters
}) => {
	const history = useHistory();

	const handleSetActiveRage = (rageValue: ActiveRage) => {
		setActiveRage(rageValue);
	};

	const [mounted, setMounted] = React.useState(false);
	const [prevCharacter, setPrevCharacter] = React.useState<object>({});
	const [nextCharacter, setNextCharacter] = React.useState<object>({});

	React.useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}

		getPrevCharacter();
		getNextCharacter();
	}, [selectedCharacterModal]);

	const getPrevCharacter = async () => {
		const currentCharIndex = filteredKillConfirmCharacters.findIndex((char) => char.id === selectedCharacterModal.id);
		let newCharIndex = currentCharIndex;

		const result = await new Promise<UpdatedCharacter>((resolve) => {
			// keep searching through previous characters until one is found that's valid ie. percDiff is NOT 0
			const closureLoop = (): any => {
				newCharIndex = newCharIndex !== 0 ? newCharIndex - 1 : filteredKillConfirmCharacters.length - 1;
				const prevCharacter = filteredKillConfirmCharacters[newCharIndex];

				if (prevCharacter.percents.percDiff === 0) {
					return closureLoop();
				} else {
					resolve(prevCharacter);
				}
			};

			closureLoop();
		});

		setPrevCharacter(result);
	};

	const getNextCharacter = async () => {
		const currentCharIndex = filteredKillConfirmCharacters.findIndex((char) => char.id === selectedCharacterModal.id);
		let newCharIndex = currentCharIndex;

		const result = await new Promise<UpdatedCharacter>((resolve) => {
			// either get the next valid character via index or count forwards from the start of the characters array
			const closureLoop = (): any => {
				newCharIndex = newCharIndex !== filteredKillConfirmCharacters.length - 1 ? newCharIndex + 1 : 0;
				const nextCharacter = filteredKillConfirmCharacters[newCharIndex];

				if (nextCharacter.percents.percDiff === 0) {
					return closureLoop();
				} else {
					resolve(nextCharacter);
				}
			};

			closureLoop();
		});

		setNextCharacter(result);
	};

	const handleKeyPress = (e: KeyboardEvent) => {
		const { key } = e;
		if (key === 'ArrowLeft') {
			history.push(`${url}/${(prevCharacter as Character).id}`);
		}
		if (key === 'ArrowRight') {
			history.push(`${url}/${(nextCharacter as Character).id}`);
		}
		if (key === '1' || key === '8' || key === '9' || key === '0') handleSetActiveRage('rage0');
		if (key === '2') handleSetActiveRage('rage50');
		if (key === '3') handleSetActiveRage('rage60');
		if (key === '4') handleSetActiveRage('rage80');
		if (key === '5') handleSetActiveRage('rage100');
		if (key === '6') handleSetActiveRage('rage125');
		if (key === '7') handleSetActiveRage('rage150');
	};

	const handleModalHide = () => {
		history.push(url);
	};

	return (
		<Modal
			className="modal modal-stage-list"
			aria-labelledby="#modal-stage-percents-title"
			show={true}
			onHide={handleModalHide}
			centered={true}
			scrollable={true}
			animation={false}
			onKeyDown={handleKeyPress}
			style={{
				['--btn-color' as string]: `rgb(${selectedCharacterModal.charColor})`
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
				className={`btn btn-sm btn-close ${selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'}`}
				aria-label="Close"
				onClick={handleModalHide}
			>
				<svg className="icon-arrowback" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 0h24v24H0z" fill="none"></path>
					<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
				</svg>
			</button>
			<div className="modal-header">
				{selectedCharacter.moves.length > 1 && (
					<div className="character-topbar">
						<div className="btn-group">
							{selectedCharacter.moves.map((move) => (
								<Link
									to={`../../${selectedCharacter.id}/${move.id}/${selectedCharacterModal.id}`}
									className={`btn btn-primary btn-sm ${selectedKillConfirm.id === move.id ? 'active' : ''}`}
									style={{ ['--bs-btn-bg' as string]: 'rgb(' + selectedCharacterModal.charColor + ')' }}
									key={move.id}
								>
									<span dangerouslySetInnerHTML={{ __html: move.name }} />
								</Link>
							))}
						</div>
					</div>
				)}
				<section className="character-info-section">
					<CSSTransition
						in={mounted}
						timeout={{ enter: 1000 }}
						classNames="csstrans-slideFromRight"
						mountOnEnter
						unmountOnExit
					>
						<img
							src={`/images/characters/webp/${selectedCharacterModal.id}.webp`}
							alt={selectedCharacterModal.name}
							className="character-image"
							style={{ ['--amount' as string]: '200px' }}
						/>
					</CSSTransition>
					<div className="character-info-wrapper">
						<div className="character-info">
							<div className="item grid-percent-range">
								{selectedCharacterModal.percents.start} - {selectedCharacterModal.percents.end}%
							</div>
							<div className="d-flex flex-column align-items-start grid-difficulty">
								<div className={`item easy ${selectedCharacterModal.percents.difficultyClass}`}>
									{selectedCharacterModal.percents.difficultyText} - {selectedCharacterModal.percents.percDiff + 1}%
								</div>
								{selectedCharacterModal.percents.distance && (
									<div className="item special-info">{selectedCharacterModal.percents.distance}</div>
								)}
							</div>
						</div>
						<div id="character-name" className="character-name">
							<h3 className="h6 m-0 text-uppercase">{selectedCharacterModal.name}</h3>
						</div>
					</div>
					<CSSTransition
						in={mounted}
						timeout={{ enter: 1000 }}
						classNames="csstrans-slideFromRight"
						mountOnEnter
						unmountOnExit
					>
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
					</CSSTransition>
				</section>
				<section className="rage-modifier text-center">
					<h3 className="rage-modifier-title text-uppercase">{selectedCharacter.name} Rage Modifier</h3>
					<div className="btn-group">
						{selectedCharacterModal.rageModifiers.map((rageModifier) => (
							<button
								type="button"
								className={`btn btn-secondary ${activeRage === rageModifier.id ? 'active' : ''}`}
								key={rageModifier.id}
								onClick={() => handleSetActiveRage(rageModifier.id as ActiveRage)}
							>
								{rageModifier.amount}%
							</button>
						))}
					</div>
				</section>
			</div>
			<div className="modal-body">
				<h2 id="modal-stage-percents-title" className="visually-hidden">
					{selectedCharacter.name} <span dangerouslySetInnerHTML={{ __html: selectedKillConfirm.name }} /> -{' '}
					{selectedCharacterModal.name} Stage Percents
				</h2>
				<section className="stages">
					{selectedCharacterModal.stageList.map((stage, i) => (
						<CSSTransition
							in={mounted}
							timeout={{ enter: 200 * (i + 2) }}
							classNames="csstrans-fade"
							mountOnEnter
							key={stage.id}
						>
							<>
								<div
									className="stage"
									style={{ ['--stage-color' as string]: stage.color, ['--delay' as string]: `${200 * i}ms` }}
								>
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
														key={stagePosition.id}
													>
														<thead>
															<tr>
																<th colSpan={3}>{stagePosition.stagePartName}</th>
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
							</>
						</CSSTransition>
					))}
				</section>
			</div>
			<nav>
				<Link
					to={`${url}/${(prevCharacter as Character).id}`}
					id="btn-prev"
					className={`btn btn-secondary btn-prev ${
						selectedCharacterModal.textScheme === 'dark' ? 'text-dark' : 'text-light'
					}`}
				>
					<span className="visually-hidden">Previous character</span>
					<i className="fa fa-angle-left" aria-hidden="true"></i>
				</Link>
				<Link
					to={`${url}/${(nextCharacter as Character).id}`}
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
				}`}
			></div>
		</Modal>
	);
};

export default ModalStagePercents;
