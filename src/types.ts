export interface Character {
	name: string;
	id: string;
	charIndex: number;
	weight: number;
	fallspeed: number;
	gravity: number;
	airdodgeStart: number;
	airdodgeEnd: number;
	charColor: string;
	textScheme: string;
	imagePosition: string;
	start: number;
	end: number;
}
export interface UpdatedCharacter extends Character {
	percents: {
		percDiff: number;
		start: number;
		end: number;
		difficultyText: DifficultyText;
		difficultyClass: DifficultyClass;
		distance: Distance;
	};
	rageModifiers: MoveRageModifier[];
	stageList: Stage[];
}
export interface SelectedCharacterModal extends UpdatedCharacter {}

export interface KillConfirm {
	characters: Character[];
	index: number;
	name: string;
	id: string;
	btnColor: string;
	cardColor: string;
	textScheme: 'light' | 'dark';
	moves: Move[];
}
export interface UpdatedKillConfirm extends KillConfirm {
	info: MoveInfo;
	stageList: Stage[];
}

export interface Move {
	index: number;
	name: string;
	id: string;
	info: MoveInfo;
	specialInfo: string;
	rageModifiers: MoveRageModifier[];
	stageList: MoveStageModifier[];
	characters: UpdatedCharacter[];
}
export interface SelectedKillConfirm extends Move {}

export interface MoveInfo {
	text: string[];
	giphy: {
		giphyUrl: string;
		youtubeUrl: string;
	};
	spreadsheetLink: string;
	spreadsheetMethod: string;
	creditLink: string;
	creditName: string;
}

export interface MoveRageModifier {
	id: string;
	amount: number;
	start: number;
	end: number;
}

export interface MoveStageModifier {
	id: string;
	name: string;
	stagePositionModifier: number;
}

export type ActiveRage = 'rage0' | 'rage50' | 'rage60' | 'rage80' | 'rage100' | 'rage125' | 'rage150';
export type DifficultyText = 'Very Hard' | 'Hard' | 'Average' | 'Easy' | 'Very Easy' | '';
export type DifficultyClass = 'very-hard' | 'hard' | 'average' | 'easy' | 'very-easy' | '';
export type Distance = 'Far' | 'Mid-Far' | 'Medium' | 'Mid-Close' | 'Close' | 'Instant' | '';

export interface Stage {
	id: string;
	name: string;
	imageFile: string;
	color: string;
	stagePositions: { id: string; stagePartName: string; min: number; max: number }[];
}

export interface AppSelections {
	selectedCharacter: UpdatedKillConfirm;
	selectedKillConfirm: SelectedKillConfirm;
	selectedCharacterModal: SelectedCharacterModal;
	hasSelectedCharacter: boolean;
	hasSelectedCharacterModal: boolean;
	hasSelectedKillConfirm: boolean;
	selectedCharacterModalValid: boolean;
	selectedCharacterValid: boolean;
	selectedKillConfirmValid: boolean;
}

export type SortingDirection = 'ascending' | 'descending' | null;
export type SortingParameter = 'name' | 'weight' | 'difficulty' | 'fallspeed' | 'gravity';
export interface Sort {
	id: string;
	name: string;
	sortingDirection: SortingDirection;
}
