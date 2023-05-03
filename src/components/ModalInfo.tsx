import React from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { MoveRageModifier, SelectedKillConfirm, UpdatedKillConfirm } from '../types';

interface ModalInfoTypes {
	url: string;
	selectedCharacter: UpdatedKillConfirm;
	selectedKillConfirm: SelectedKillConfirm;
}

const ModalInfo: React.FC<ModalInfoTypes> = ({ url, selectedCharacter, selectedKillConfirm }) => {
	const history = useHistory();
	const handleModalHide = () => {
		history.push(url);
	};

	const { info } = selectedKillConfirm;

	return (
		<Modal
			className="modal modal-info"
			aria-labelledby="#modal-info-title"
			show={true}
			onHide={handleModalHide}
			centered={true}
			scrollable={true}
			animation={false}
		>
			<button type="button" className="btn btn-sm btn-close" aria-label="Close" onClick={handleModalHide}>
				<svg className="icon-arrowback" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 0h24v24H0z" fill="none"></path>
					<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
				</svg>
			</button>
			<div className="modal-body">
				<h2 id="modal-info-title" className="visually-hidden">
					{selectedCharacter.name} <span dangerouslySetInnerHTML={{ __html: selectedKillConfirm.name }} /> - Info
				</h2>
				{info.giphy.youtubeUrl ? (
					<a href={info.giphy.youtubeUrl} target="_blank" rel="noreferrer">
						<div className="ratio ratio-16x9 mb-3">
							<iframe src={info.giphy.giphyUrl} title={`${selectedCharacter.name} kill confirm Giphy`}></iframe>
						</div>
					</a>
				) : (
					<div className="ratio ratio-16x9 mb-3">
						<iframe src={info.giphy.giphyUrl} title={`${selectedCharacter.name} kill confirm Giphy`}></iframe>
					</div>
				)}
				<div className="alert alert-secondary">
					Thanks to{' '}
					{info.creditLink ? (
						<a href={info.creditLink} target="_blank" rel="noreferrer">
							{info.creditName}
						</a>
					) : (
						info.creditName
					)}{' '}
					for the{' '}
					<a href={info.spreadsheetLink} target="_blank" rel="noreferrer">
						{selectedCharacter.name} <span dangerouslySetInnerHTML={{ __html: selectedKillConfirm.name }} /> spreadsheet
					</a>
					{info.spreadsheetMethod && (
						<span>
							{' '}
							and{' '}
							<a href={info.spreadsheetMethod} target="_blank" rel="noreferrer">
								methodology
							</a>
						</span>
					)}
					.
				</div>

				{info.text.map((para, i) => (
					// the order of these will never change, so am using the index as the key
					<p dangerouslySetInnerHTML={{ __html: para }} key={i} />
				))}

				<div className="stages text-center">
					{selectedKillConfirm.stageList.length > 1 && (
						<div className="stage" style={{ ['--stage-color' as string]: '#ff6f00' }}>
							<div className="stage-title text-uppercase">
								<h3 className="h6">Stage Modifiers</h3>
							</div>
							<h6 className="label">Add to Min% window</h6>
							<div className="container-fluid">
								<div className="row">
									{selectedKillConfirm.stageList.map((stage) => (
										<div className="col-6 col-sm-4 col-md-3" key={stage.id}>
											<table className="table table-bordered table-sm">
												<thead>
													<tr>
														<th>
															<label>{stage.name}</label>
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>{stage.stagePositionModifier}</td>
													</tr>
												</tbody>
											</table>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
					<div className="stage" style={{ ['--stage-color' as string]: '#cc2727' }}>
						<div className="stage-title text-uppercase">
							<h3 className="h6">Rage Modifiers</h3>
						</div>
						<h4 className="label">Add to Min% / Max% window</h4>
						<div className="container-fluid">
							<div className="row">
								{selectedKillConfirm.rageModifiers
									.filter((rm) => rm.id !== 'rage0')
									.map((rageModifier: MoveRageModifier) => (
										<div className="col-4 col-md-2" key={rageModifier.id}>
											<table className="table table-bordered table-sm">
												<thead>
													<tr>
														<th>
															<label>Rage {rageModifier.amount}</label>
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>
															{rageModifier.start} {rageModifier.end}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalInfo;
