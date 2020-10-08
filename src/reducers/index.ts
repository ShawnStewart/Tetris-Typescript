import {
    JUMP_TO_PLACEHOLDER,
    MOVE_PLAYER_DOWN,
    MOVE_PLAYER_LEFT,
    MOVE_PLAYER_RIGHT,
    PLAYER_BLOCKED,
    RESET_PLAYER,
    ROTATE_PLAYER,
    UPDATE_GAME_BOARD,
} from '@actions/actionTypes';
import { QUEUE_LENGTH } from '@constants';
import { PlayerState, TetrisState } from '@types';
import {
    clearMatrixRows,
    getNewPlayer,
    initializeBoard,
    initializeQueue,
    updateGameBoardWithPlayer,
    updatePlaceholder,
} from '@utils';

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
    tetrominoCount: QUEUE_LENGTH + 1,
};

export const reducer = (state: TetrisState, action: TetrisActions): TetrisState => {
    const { gameBoard, player, queue, tetrominoCount } = state;

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

            return {
                gameBoard: newGameBoard,
                player: {
                    ...queue[0],
                    placeholder: updatePlaceholder({ gameBoard: newGameBoard, ...queue[0] }),
                },
                queue: [...queue.slice(1), getNewPlayer(tetrominoCount + 1)],
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

            return {
                ...state,
                gameBoard: newGameBoard,
                player: {
                    ...player,
                    placeholder: updatePlaceholder({ gameBoard: newGameBoard, ...player }),
                },
            };
        }
        default: {
            return state;
        }
    }
};
