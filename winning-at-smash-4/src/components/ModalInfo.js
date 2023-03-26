import { Modal } from 'react-bootstrap';

const ModalInfo = ({ selectedCharacter, selectedKillConfirm, modalShowInfo, setModalShowInfo }) => {
	const handleModalHide = () => {
		setModalShowInfo(false);
		console.log('closing show info!');
	};

	if (!Object.keys(selectedKillConfirm).length) return null;

	const { info } = selectedKillConfirm;

	return (
		// TODO: set up the aria- stuff since these modals will have slightly different content each time
		// https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content
		<Modal
			className="modal modal-info"
			aria-labelledby=""
			show={modalShowInfo}
			onHide={handleModalHide}
			centered={true}
			animation={false}
		>
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
						{selectedCharacter.name} <span dangerouslySetInnerHTML={{ __html: selectedKillConfirm.moveName }} />{' '}
						spreadsheet
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
			</div>
		</Modal>
	);
};

export default ModalInfo;
