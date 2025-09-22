
export enum GameState {
  SELECTING_IMAGE,
  SELECTING_OPTIONS,
  PLAYING,
  COMPLETED,
}

export enum GameMode {
  TRADITIONAL = 'TRADITIONAL',
  SLIDING = 'SLIDING',
}

export enum Language {
  EN = 'en',
  ZH = 'zh',
}

export type PuzzleOptions = {
  mode: GameMode;
  gridSize: number;
  timerEnabled: boolean;
};

export type TraditionalPiece = {
  id: number;
  imgUrl: string;
  width: number;
  height: number;
  correctIndex: number;
};

export type SlidingTile = {
  id: number;
  imgUrl: string;
  originalIndex: number;
  isEmpty?: boolean;
};
