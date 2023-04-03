import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const Card = ({ loading, selectedKillConfirm, character }) => (
	<div className="col-sm-6 col-md-4 col-character-move-card">
		<div className="card">
			<div className="card-image" style={{ '--card-image-bg-color': 'rgb(' + character.cardColor + ')' }}>
				{loading ? (
					<Skeleton height={100} />
				) : (
					<>
						<img src={'/images/characters/webp/' + character.id + '.webp'} alt={character.name} />
						<h2 className={`card-title ${character.textScheme === 'light' ? 'text-light' : 'text-dark'}`}>
							{character.name}
						</h2>
					</>
				)}
			</div>
			<div className="card-body">
				{loading ? (
					<Skeleton count={3} />
				) : (
					<div className="btn-group">
						{character.moves.map((move) => (
							<Link
								to={`/${character.id}/${move.id}`}
								className={`btn btn-primary btn-sm ${selectedKillConfirm.id === move.id ? 'active' : ''}`}
								key={'card-' + move.id}
								style={{ '--btn-bg': character.btnColor }}
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

const CharacterMoveCards = ({ loading, killConfirms, selectedKillConfirm }) => {
	return (
		<div className="character-move-cards">
			<div className="row">
				{loading
					? Array.from({ length: 9 }, (_, index) => <Card loading={true} key={index} character={{}} />)
					: killConfirms.map((character) => (
							<Card
								loading={false}
								selectedKillConfirm={selectedKillConfirm}
								character={character}
								key={character.id}
							/>
					  ))}
			</div>
		</div>
	);
};

export default CharacterMoveCards;
