import { Modal } from 'react-bootstrap';

const ModalCredits = ({ modalShowCredits, setModalShowCredits, killConfirms }) => {
	const handleModalHide = () => {
		setModalShowCredits(false);
	};

	return (
		<Modal
			className="modal modal-info"
			aria-labelledby="#modal-credits-title"
			show={modalShowCredits}
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
				<h2 id="modal-credits-title">Credits</h2>
				{killConfirms.map((killConfirm) => (
					<p key={killConfirm.id}>
						{killConfirm.moves.map((move, i) => (
							<span key={move.id}>
								{move.info.creditLink ? (
									<a href={move.info.creditLink} target="_blank" rel="noreferrer">
										{move.info.creditName}
									</a>
								) : (
									<span>{move.info.creditName}</span>
								)}{' '}
								for the{' '}
								<a href={move.info.spreadsheetLink} target="_blank" rel="noreferrer">
									<span dangerouslySetInnerHTML={{ __html: move.name }} /> spreadsheet
								</a>
								{move.info.spreadsheetMethod ? (
									<>
										{' '}
										and <a href={move.info.spreadsheetMethod}>methodology</a>
									</>
								) : null}
								.{' '}
							</span>
						))}
					</p>
				))}

				<p>
					<a href="https://twitter.com/BanZelda" target="_blank" rel="noreferrer">
						Dia
					</a>{' '}
					for the{' '}
					<a
						href="https://docs.google.com/spreadsheets/d/1DJ6nOhD5csa5xEgPvgCXMXKR-Gsy_WwbtJARkbCxTIA/edit#gid=0"
						target="_blank"
						rel="noreferrer"
					>
						Zelda Kill Percents spreadsheet (WIP)
					</a>
					.
				</p>

				<p>
					<a href="https://twitter.com/NechuEXE" target="_blank" rel="noreferrer">
						Nechu
					</a>{' '}
					for the{' '}
					<a href="https://imgur.com/a/j3ekG" target="_blank" rel="noreferrer">
						Up Throw &gt; Thunder GIF collection
					</a>
					.
				</p>

				<p>
					<a href="https://twitter.com/unwnded?lang=en" target="_blank" rel="noreferrer">
						Extra{' '}
					</a>
					,
					<a href="https://twitter.com/Dsafunky1" target="_blank" rel="noreferrer">
						Denz{' '}
					</a>
					,
					<a href="https://twitter.com/Havok_96" target="_blank" rel="noreferrer">
						Havok
					</a>{' '}
					and{' '}
					<a href="https://twitter.com/JPiskopos" target="_blank" rel="noreferrer">
						Piski
					</a>{' '}
					for labbing assistance.
				</p>

				<p>
					Special thanks to smashers{' '}
					<a href="https://twitter.com/cayiika" target="_blank" rel="noreferrer">
						Cayika
					</a>
					,{' '}
					<a href="https://twitter.com/Gurpwnder" target="_blank" rel="noreferrer">
						Gurpinder
					</a>{' '}
					, Gale, BJN39, eta3372, Skia.
				</p>

				<p>
					Shoutouts to{' '}
					<a href="https://twitter.com/frappesnowland" target="_blank" rel="noreferrer">
						Shiva
					</a>{' '}
					for images help and{' '}
					<a href="https://twitter.com/KuroganeHammer" target="_blank" rel="noreferrer">
						Kurogane Hammer
					</a>{' '}
					for data help.
				</p>

				<p>Thanks to Nintendo, Namco Bandai, and Sora for developing Super Smash Bros. for Wii U.</p>

				<p>
					<img
						className="img-fluid"
						src="/images/credits.jpg"
						alt="Winning at Smash 4 Credits"
						width="545"
						height="306"
					/>
				</p>
			</div>
		</Modal>
	);
};

export default ModalCredits;
