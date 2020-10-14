import { BOARD_HEIGHT, BOARD_WIDTH, ColorCodes, QUEUE_LENGTH } from '@constants';
import { TETROMINO_IDS, TETROMINO_SHAPE_MAP } from '@constants/tetrominos';
import { GameBoardAndPlayer, GameStats, PlayerPosition, PlayerState, TetrisMatrix } from '@types';

export const isOutOfBoundsX = (x: number): boolean => x < 0 || x >= BOARD_WIDTH;

export const isOutOfBoundsY = (y: number): boolean => y >= BOARD_HEIGHT;

export const checkForCollision = ({
    gameBoard,
    shape: playerShape,
    x: playerX,
    y: playerY,
}: GameBoardAndPlayer): boolean => {
    return playerShape.some((row, rowIdx) => {
        const posY = rowIdx + playerY;

        if (posY < 0 && playerX >= 0 && playerX + playerShape.length - 1 < BOARD_WIDTH) {
            // Player above the game board, but still within x-boundaries
            // Entire row is safe from collision
            return false;
        }

        return row.some((col, colIdx) => {
            const posX = colIdx + playerX;

            return !!col && (isOutOfBoundsX(posX) || isOutOfBoundsY(posY) || (posY >= 0 && gameBoard[posY][posX] > 1));
        });
    });
};

export const checkForCompletedRows = (gameBoard: TetrisMatrix): number[] => {
    const result = [];

    for (let rowIdx = gameBoard.length - 1; rowIdx >= 0; rowIdx--) {
        if (gameBoard[rowIdx].every((n) => n > 1)) {
            result.push(rowIdx);
        }

        if (gameBoard[rowIdx].every((n) => n === 1)) {
            break;
        }
    }

    return result.reverse();
};

export const clearMatrixRows = (matrix: TetrisMatrix, rows: number[]): TetrisMatrix => {
    const result = cloneMatrix(matrix);

    for (const row of rows) {
        result.splice(row, 1);
        result.unshift(new Array(BOARD_WIDTH).fill(ColorCodes.background));
    }

    return result;
};

export const cloneMatrix = (matrix: TetrisMatrix): TetrisMatrix => {
    return matrix.map((row) => [...row]);
};

export const getNewPlayer = (tetrominoNumber: number): PlayerState => {
    const tetrominoId = TETROMINO_IDS[Math.floor(Math.random() * TETROMINO_IDS.length)];
    const shape = TETROMINO_SHAPE_MAP[tetrominoId];
    const x = BOARD_WIDTH / 2 - Math.floor(shape.length / 2);
    let y = 0 - shape.length;

    for (let i = shape.length - 1; i >= 0; i--) {
        if (shape[i].some((c) => c > 0)) {
            break;
        }

        y++;
    }

    const placeholder = { x, y: BOARD_HEIGHT + y };

    return { placeholder, shape, tetrominoId, tetrominoNumber, x, y };
};

export const initializeBoard = (): TetrisMatrix => {
    const board = new Array<ColorCodes[]>(BOARD_HEIGHT);

    for (let i = 0; i < BOARD_HEIGHT; i++) {
        board[i] = new Array<ColorCodes>(BOARD_WIDTH).fill(1);
    }

    return board;
};

export const initializeQueue = (): PlayerState[] => {
    const queue = [];

    for (let i = 0; i < QUEUE_LENGTH; i++) {
        queue.push(getNewPlayer(i + 2));
    }

    return queue;
};

export const initializeStats = (): GameStats => {
    return {
        level: 1,
        lines: 10,
        score: 0,
    };
};

export const rotateMatrix = (matrix: TetrisMatrix, counterclockwise = false): TetrisMatrix => {
    const result = cloneMatrix(matrix);

    for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
            [result[i][j], result[j][i]] = [result[j][i], result[i][j]];
        }
    }

    return counterclockwise ? result.reverse() : result.map((r) => r.reverse());
};

export const updateGameBoardWithPlayer = ({ gameBoard, shape, x, y }: GameBoardAndPlayer): TetrisMatrix => {
    const boundsX = x + shape.length;
    const boundsY = y + shape.length;

    return gameBoard.map((row, rowIdx) => {
        return row.map((col, colIdx) => {
            if (rowIdx >= y && rowIdx < boundsY && colIdx >= x && colIdx < boundsX) {
                return shape[rowIdx - y][colIdx - x] || col;
            }

            return col;
        });
    });
};

export const updatePlaceholder = ({ gameBoard, shape, x, y }: GameBoardAndPlayer): PlayerPosition => {
    const newPlaceholder = { x, y };

    while (!checkForCollision({ gameBoard, shape, x: newPlaceholder.x, y: newPlaceholder.y + 1 })) {
        newPlaceholder.y++;
    }

    return newPlaceholder;
};
