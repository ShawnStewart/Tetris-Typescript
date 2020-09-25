import { ColorCodes } from '@constants';
import { TetrominoId } from '@constants/tetrominos';

export type TetrisMatrix = ColorCodes[][];

export interface PlayerPosition {
    x: number;
    y: number;
}

export interface PlayerShapeAndPosition extends PlayerPosition {
    shape: TetrisMatrix;
}

export interface GameBoardAndPlayer extends PlayerShapeAndPosition {
    gameBoard: TetrisMatrix;
}

export interface PlayerState extends PlayerShapeAndPosition {
    placeholder: PlayerPosition;
    tetrominoId: TetrominoId;
    tetrominoNumber: number;
}

export interface TetrisState {
    gameBoard: TetrisMatrix;
    player: PlayerState;
    queue: PlayerState[];
    tetrominoCount: number;
}
