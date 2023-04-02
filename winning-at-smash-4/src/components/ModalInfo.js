import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router';

const ModalInfo = ({ url, selectedCharacter, selectedKillConfirm }) => {
	const history = useHistory();
	const handleModalHide = () => {
		history.push(url);
	};

	const { info } = selectedKillConfirm;

	return (
		// TODO: set up the aria- stuff since these modals will have slightly different content each time
		// https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content
		<Modal
			className="modal modal-info"
			aria-labelledby=""
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
					{info.spreadsheetMethod ? (
						<span>
							{' '}
							and{' '}
							<a href={info.spreadsheetMethod} target="_blank" rel="noreferrer">
								methodology
							</a>
						</span>
					) : null}
					.
				</div>

				{info.text.map((para, i) => (
					// the order of these will never change, so am using the index as the key
					<p dangerouslySetInnerHTML={{ __html: para }} key={i} />
				))}

				<div class="stages text-center">
					<div className="stage" style={{ '--stage-color': '#ff6f00' }}>
						<div class="stage-title text-uppercase">
							<h3 class="h6">Stage Modifiers</h3>
						</div>
						<h6 class="label">Add to Min% window</h6>
						<div class="container-fluid">
							<div class="row">
								{selectedKillConfirm.stageList.map((stage) => (
									<div class="col-6 col-sm-4 col-md-3">
										<table class="table table-bordered table-sm">
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
					<div className="stage" style={{ '--stage-color': '#cc2727' }}>
						<div class="stage-title text-uppercase">
							<h3 class="h6">Rage Modifiers</h3>
						</div>
						<h4 class="label">Add to Min% / Max% window</h4>
						<div class="container-fluid">
							<div class="row">
								{selectedKillConfirm.rageModifiers
									.filter((rm) => rm.id !== 'rage0')
									.map((rageModifier) => (
										<div class="col-4 col-md-2">
											<table class="table table-bordered table-sm">
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
