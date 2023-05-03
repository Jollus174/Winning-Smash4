import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { KillConfirm, SelectedKillConfirm } from '../types';

interface CardTypes {
	loading: boolean;
	killConfirm: KillConfirm;
	selectedKillConfirm: SelectedKillConfirm;
}

const Card: React.FC<CardTypes> = ({ loading, selectedKillConfirm, killConfirm }) => {
	return (
		<div className="col-sm-6 col-md-4 col-character-move-card">
			<div className="card">
				<div className="card-image" style={{ ['--card-image-bg-color' as string]: `rgb(${killConfirm?.cardColor})` }}>
					{loading ? (
						<Skeleton height={100} />
					) : (
						<>
							<img src={`/images/characters/webp/${killConfirm?.id}.webp`} alt={killConfirm?.name} />
							<h2 className={`card-title ${killConfirm?.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
								{killConfirm?.name}
							</h2>
						</>
					)}
				</div>
				<div className="card-body">
					{loading ? (
						<Skeleton count={3} />
					) : (
						<div className="btn-group">
							{killConfirm?.moves.map((move) => (
								<Link
									to={`/${killConfirm?.id}/${move.id}`}
									className={`btn btn-primary btn-sm ${selectedKillConfirm.id === move.id ? 'active' : ''}`}
									key={`card-${move.id}`}
									style={{ ['--btn-bg' as string]: killConfirm?.btnColor }}
								>
									<span dangerouslySetInnerHTML={{ __html: move.name }} />
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

interface CharacterMoveCardsTypes {
	loading: boolean;
	killConfirms: Array<KillConfirm>;
	selectedKillConfirm: SelectedKillConfirm;
}

const CharacterMoveCards: React.FC<CharacterMoveCardsTypes> = ({ loading, killConfirms, selectedKillConfirm }) => {
	return (
		<div className="character-move-cards">
			<div className="row">
				{/* {loading
					? Array.from({ length: 9 }, (_, index) => (
							<Card loading={true} selectedKillConfirm={selectedKillConfirm} killConfirm={{}} key={index} />
					  ))
					: killConfirms.map((killConfirm) => (
							<Card
								loading={false}
								selectedKillConfirm={selectedKillConfirm}
								killConfirm={killConfirm}
								key={killConfirm.id}
							/>
							))} */}
				{killConfirms.map((killConfirm) => (
					<Card
						loading={false}
						selectedKillConfirm={selectedKillConfirm}
						killConfirm={killConfirm}
						key={killConfirm.id}
					/>
				))}
			</div>
		</div>
	);
};

export default CharacterMoveCards;
