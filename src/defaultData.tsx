import { AppSelections, MoveInfo, Sort, UpdatedCharacter } from './types';

const moveInfo: MoveInfo = {
	text: [],
	giphy: {
		giphyUrl: '',
		youtubeUrl: ''
	},
	spreadsheetLink: '',
	spreadsheetMethod: '',
	creditLink: '',
	creditName: ''
};

export const defaultUpdatedCharacter: UpdatedCharacter = {
	name: '',
	id: '',
	charIndex: 0,
	weight: 0,
	fallspeed: 0,
	gravity: 0,
	airdodgeStart: 0,
	airdodgeEnd: 0,
	charColor: '',
	textScheme: '',
	imagePosition: '',
	start: 0,
	end: 0,
	rageModifiers: [],
	stageList: [],
	percents: {
		percDiff: 0,
		start: 0,
		end: 0,
		difficultyText: '',
		difficultyClass: '',
		distance: ''
	}
};

export const defaultAppSelections: AppSelections = {
	selectedCharacter: {
		characters: [],
		index: 0,
		name: '',
		id: '',
		btnColor: '',
		cardColor: '',
		textScheme: 'light',
		moves: [],
		info: { ...moveInfo },
		stageList: []
	},
	selectedKillConfirm: {
		characters: [],
		id: '',
		index: 0,
		info: { ...moveInfo },
		name: '',
		rageModifiers: [],
		specialInfo: '',
		stageList: []
	},
	selectedCharacterModal: {
		...defaultUpdatedCharacter
	},
	hasSelectedCharacter: false,
	hasSelectedKillConfirm: false,
	hasSelectedCharacterModal: false,
	selectedCharacterValid: true,
	selectedKillConfirmValid: true,
	selectedCharacterModalValid: true
};

export const defaultSorting: Array<Sort> = [
	{ id: 'name', name: 'Name', sortingDirection: 'descending' },
	{ id: 'weight', name: 'Weight', sortingDirection: null },
	{ id: 'difficulty', name: 'Difficulty', sortingDirection: null },
	{ id: 'fallspeed', name: 'Fallspeed', sortingDirection: null },
	{ id: 'gravity', name: 'Gravity', sortingDirection: null }
];
