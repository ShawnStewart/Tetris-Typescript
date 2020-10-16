import { TetrisMatrix } from '@/types';

export const TETROMINO_SHAPE_MAP = {
    I: [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ] as TetrisMatrix,
    J: [
        [3, 0, 0],
        [3, 3, 3],
        [0, 0, 0],
    ] as TetrisMatrix,
    L: [
        [0, 0, 4],
        [4, 4, 4],
        [0, 0, 0],
    ] as TetrisMatrix,
    O: [
        [5, 5],
        [5, 5],
    ] as TetrisMatrix,
    S: [
        [0, 0, 0],
        [0, 6, 6],
        [6, 6, 0],
    ] as TetrisMatrix,
    T: [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
    ] as TetrisMatrix,
    Z: [
        [0, 0, 0],
        [8, 8, 0],
        [0, 8, 8],
    ] as TetrisMatrix,
} as const;

export type TetrominoId = keyof typeof TETROMINO_SHAPE_MAP;
export const TETROMINO_IDS = Object.keys(TETROMINO_SHAPE_MAP) as TetrominoId[];
