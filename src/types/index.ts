import { ColorCodes } from 'constants';
import { TetrominoId } from 'constants/tetrominos';

export type TetrisMatrix = ColorCodes[][];

export interface PlayerPosition {
    x: number;
    y: number;
}

export interface PlayerState extends PlayerPosition {
    placeholder: PlayerPosition;
    shape: TetrisMatrix;
    tetrominoId: TetrominoId;
    tetrominoNumber: number;
}

export type PlayerShapeAndPosition = Pick<PlayerState, 'shape' | 'x' | 'y'>;

export interface TetrisState {
    gameBoard: TetrisMatrix;
    player: PlayerState;
    queue: PlayerState[];
    tetrominoCount: number;
}
