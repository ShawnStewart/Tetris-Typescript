import {
    JUMP_TO_PLACEHOLDER,
    MOVE_PLAYER_DOWN,
    MOVE_PLAYER_LEFT,
    MOVE_PLAYER_RIGHT,
    PLAYER_BLOCKED,
    RESET_PLAYER,
    ROTATE_PLAYER,
    UPDATE_GAME_BOARD,
} from '@/actions/actionTypes';
import { QUEUE_LENGTH } from '@/constants';
import { PlayerState, TetrisState } from '@/types';
import {
    clearMatrixRows,
    getNewPlayer,
    initializeBoard,
    initializeQueue,
    initializeStats,
    updateGameBoardWithPlayer,
    updatePlaceholder,
} from '@/utils';

type TetrisActions =
    | {
          type:
              | typeof MOVE_PLAYER_DOWN
              | typeof MOVE_PLAYER_LEFT
              | typeof MOVE_PLAYER_RIGHT
              | typeof PLAYER_BLOCKED
              | typeof RESET_PLAYER
              | typeof JUMP_TO_PLACEHOLDER;
      }
    | { type: typeof ROTATE_PLAYER; payload: Pick<PlayerState, 'shape' | 'x'> }
    | { type: typeof UPDATE_GAME_BOARD; payload: number[] };

export const initialState: TetrisState = {
    gameBoard: initializeBoard(),
    player: getNewPlayer(1),
    queue: initializeQueue(),
    stats: initializeStats(),
    tetrominoCount: QUEUE_LENGTH + 1,
};

export const reducer = (state: TetrisState, action: TetrisActions): TetrisState => {
    const { gameBoard, player, queue, stats, tetrominoCount } = state;

    switch (action.type) {
        case RESET_PLAYER: {
            const newPlayer = getNewPlayer(tetrominoCount);

            return {
                ...state,
                player: {
                    ...newPlayer,
                    placeholder: updatePlaceholder({ gameBoard, ...newPlayer }),
                },
            };
        }
        case MOVE_PLAYER_DOWN: {
            return {
                ...state,
                player: {
                    ...player,
                    y: player.y + 1,
                },
                stats: {
                    ...stats,
                    score: stats.score + 1,
                },
            };
        }
        case MOVE_PLAYER_LEFT: {
            const placeholder = updatePlaceholder({ gameBoard, ...player, x: player.x - 1 });

            return {
                ...state,
                player: {
                    ...player,
                    placeholder,
                    x: player.x - 1,
                },
            };
        }
        case MOVE_PLAYER_RIGHT: {
            const placeholder = updatePlaceholder({ gameBoard, ...player, x: player.x + 1 });

            return {
                ...state,
                player: {
                    ...player,
                    placeholder,
                    x: player.x + 1,
                },
            };
        }
        case PLAYER_BLOCKED: {
            const newGameBoard = updateGameBoardWithPlayer({ gameBoard, ...player });

            return {
                ...state,
                gameBoard: newGameBoard,
                player: {
                    ...queue[0],
                    placeholder: updatePlaceholder({ gameBoard: newGameBoard, ...queue[0] }),
                },
                queue: [...queue.slice(1), getNewPlayer(tetrominoCount + 1)],
                tetrominoCount: tetrominoCount + 1,
            };
        }
        case JUMP_TO_PLACEHOLDER: {
            const newGameBoard = updateGameBoardWithPlayer({ gameBoard, ...player, y: player.placeholder.y });
            const jumpDistance = player.placeholder.y - player.y;
            const pointsEarned = jumpDistance + jumpDistance * stats.level;

            return {
                ...state,
                gameBoard: newGameBoard,
                player: {
                    ...queue[0],
                    placeholder: updatePlaceholder({ gameBoard: newGameBoard, ...queue[0] }),
                },
                queue: [...queue.slice(1), getNewPlayer(tetrominoCount + 1)],
                stats: {
                    ...stats,
                    score: stats.score + pointsEarned,
                },
                tetrominoCount: tetrominoCount + 1,
            };
        }
        case ROTATE_PLAYER: {
            const updatedPlayer = { ...player, ...action.payload };

            return {
                ...state,
                player: {
                    ...updatedPlayer,
                    placeholder: updatePlaceholder({ gameBoard, ...updatedPlayer }),
                },
            };
        }
        case UPDATE_GAME_BOARD: {
            const newGameBoard = clearMatrixRows(gameBoard, action.payload);
            const numRowsCompleted = action.payload.length;
            const newLinesCount = stats.lines + numRowsCompleted;

            const standardPoints = numRowsCompleted * 100;
            const levelBonus = stats.level * 500;

            let pointsEarned = standardPoints + levelBonus;

            if (numRowsCompleted === 4) {
                pointsEarned *= 2;
            }

            return {
                ...state,
                gameBoard: newGameBoard,
                player: {
                    ...player,
                    placeholder: updatePlaceholder({ gameBoard: newGameBoard, ...player }),
                },
                stats: {
                    ...stats,
                    level: Math.floor(newLinesCount / 10),
                    lines: newLinesCount,
                    score: stats.score + pointsEarned,
                },
            };
        }
        default: {
            return state;
        }
    }
};
