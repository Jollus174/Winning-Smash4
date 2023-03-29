import { Modal } from 'react-bootstrap';

const ModalAbout = ({ modalShowAbout, setModalShowAbout }) => {
	const handleModalHide = () => {
		setModalShowAbout(false);
	};

	return (
		<Modal
			className="modal modal-info"
			aria-labelledby="#modal-about-title"
			show={modalShowAbout}
			onHide={handleModalHide}
			centered={true}
			animation={false}
		>
			<button type="button" className="btn btn-sm btn-close" aria-label="Close" onClick={handleModalHide}>
				<svg className="icon-arrowback" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 0h24v24H0z" fill="none"></path>
					<path className="pathfill" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
				</svg>
			</button>
			<div className="modal-body">
				<h2 id="modal-about-title">About</h2>
				<p>
					This is a personal project developed to help Super Smash Bros. for Wii U (SSBU) players better understand the
					kill confirms of their characters or opponents, across a variety of stages and rage amounts.
				</p>

				<p>
					For every confirm listed, the calculator assumes that the victim is applying the most optimal DI for the
					situation. More information can be viewed in the Information section for each move.
				</p>

				<p>
					The calculator also assumes that the attacker's rage affects every victim in the same way - in practice it
					does not. There could be somewhere between a 5-10% discrepancy between character kill percents depending on
					their weight and gravity. See{' '}
					<a
						href="https://docs.google.com/spreadsheets/d/1bGbb7fiX1W0Oer58yf6Kcwtx_zgxg--WYGrUpxTjRpk/htmlview?pli=1#"
						target="_blank"
						rel="noreferrer"
					>
						Poke's Bowser chart
					</a>{' '}
					to see how rage scaling affects victims in different ways.
				</p>

				<h3>Downloading the Web App</h3>

				<p>
					This is an open-source{' '}
					<a href="https://developers.google.com/web/progressive-web-apps/" target="_blank" rel="noreferrer">
						Progressive Web App (PWA)
					</a>
					, an emerging web technology that allows users to download a website to their mobile or tablet device for
					offline use. This is not a native mobile app that can be downloaded from an App Store, but contains similar
					functions and provides the same user experience and benefits. If viewing the website on Chrome Browser on
					mobile, you should be treated with an install banner like the following.
				</p>

				<p>
					<img
						className="img-fluid"
						src="images/progressive-web-app.jpg"
						alt="Progressive Web App Installation"
						width="545"
						height="484"
					/>
				</p>

				<p>
					Downloading the web app for offline use carries many benefits, including faster speed, and ensured
					functionality in areas with limited or no network connection. If there's ever an update, your device will
					automatically download it upon opening the app, and it will be present the next time it's started up.
				</p>

				<h3>Feedback / Bug Reports</h3>

				<p>
					The latest builds are pushed to the{' '}
					<a href="https://github.com/Jollus174/Winning-Smash4" target="_blank" rel="noreferrer">
						Github repo
					</a>
					. Any development issues should be submitted through{' '}
					<a href="https://github.com/Jollus174/Winning-Smash4/issues" target="_blank" rel="noreferrer">
						Github's ticketing system
					</a>
					.
				</p>

				<p>
					If there's any other feedback, or you'd like your character's confirm featured, feel free to contact me via{' '}
					<a href="https://twitter.com/JollusSSB" target="_blank" rel="noreferrer">
						Twitter
					</a>
					, or PM me on Discord at <strong>Jollus#6199</strong>. For now, only true kill confirms are being included,
					but 50/50's may be considered in future.
				</p>
			</div>
		</Modal>
	);
};

export default ModalAbout;
