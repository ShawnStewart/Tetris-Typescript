import React, { EventHandler, FC, KeyboardEvent, useEffect, useReducer, useRef } from 'react';

import MatrixCanvas from 'components/MatrixCanvas';
import Queue from 'components/Queue';
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from 'constants';
import { initialState, reducer } from 'reducer';
import * as actionTypes from 'reducer/actionTypes';
import { checkForCollision, rotateMatrix } from 'utils';
import { clearCanvas, drawToCanvas } from 'utils/canvas';
import './Tetris.scss';

const Tetris: FC = () => {
    // for (let i = 18; i < 20; i++) {
    //     for (let j = 0; j < 4; j++) {
    //         initialState.gameBoard[i][j] = 2;
    //         initialState.gameBoard[i][9 - j] = 2;
    //     }
    // }
    const [state, dispatch] = useReducer(reducer, initialState);
    const tetrisContainerRef = useRef<HTMLDivElement>(null);
    const gameBoardCtxRef = useRef<CanvasRenderingContext2D | null>(null);

    const { gameBoard, player, queue } = state;

    console.log('Tetris render', state);

    useEffect(() => {
        if (tetrisContainerRef.current) {
            // Focuses the Tetris container on initial load
            tetrisContainerRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (gameBoardCtxRef.current) {
            // Re-draw the game board and player position
            // clearCanvas(gameBoardCtxRef.current);
            // drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: gameBoard });
            drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: player.shape, x: player.x, y: player.y });
            drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: player.shape, fill: false, ...player.placeholder });
        }
    }, [gameBoard, player.placeholder, player.shape, player.x, player.y]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const randX = Math.floor(Math.random() * 10);
    //         const randY = Math.floor(Math.random() * 20);
    //         const randColor = (Math.floor(Math.random() * 7) + 2) as ColorCodes;
    //         const newMatrix = cloneMatrix(gameBoard);

    //         newMatrix[randY][randX] = randColor;

    //         dispatch({ type: 'rand', payload: newMatrix });
    //     }, 1);

    //     return () => clearInterval(interval);
    // }, [gameBoard]);

    const _handleOnKeyDown: EventHandler<KeyboardEvent> = (event) => {
        const { key, metaKey } = event;
        console.log('keyDown', key === ' ', /\s/.test(key), metaKey);

        switch (key) {
            case ' ': {
                dispatch({ type: actionTypes.JUMP_TO_PLACEHOLDER });
                break;
            }
            case 'w':
            case 'ArrowUp': {
                const maximumX = BOARD_WIDTH - player.shape.length;
                let x = player.x;

                if (x < 0) {
                    x = 0;
                } else if (x > maximumX) {
                    x = maximumX;
                }

                const payload = { shape: rotateMatrix(player.shape), x };

                dispatch({ type: actionTypes.ROTATE_PLAYER, payload });
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                const collision = checkForCollision({ gameBoard, ...player, x: player.x - 1 });

                if (!collision) {
                    dispatch({ type: actionTypes.MOVE_PLAYER_LEFT });
                }
                break;
            }
            case 's':
            case 'ArrowDown': {
                if (player.y === player.placeholder.y) {
                    dispatch({ type: actionTypes.PLAYER_BLOCKED });
                } else {
                    dispatch({ type: actionTypes.MOVE_PLAYER_DOWN });
                }
                break;
            }
            case 'd':
            case 'ArrowRight': {
                const collision = checkForCollision({ gameBoard, ...player, x: player.x + 1 });

                if (!collision) {
                    dispatch({ type: actionTypes.MOVE_PLAYER_RIGHT });
                }
                break;
            }
            case 'r': {
                dispatch({ type: actionTypes.RESET_PLAYER });
                break;
            }
        }
    };

    return (
        <div
            id="tetris"
            className="section"
            ref={tetrisContainerRef}
            role="button"
            tabIndex={0}
            onKeyDown={_handleOnKeyDown}
        >
            <div id="tetris-container">
                <MatrixCanvas
                    id="tetris-game-board"
                    ctxForwardRef={gameBoardCtxRef}
                    matrix={gameBoard}
                    height={BOARD_HEIGHT * BLOCK_SIZE}
                    width={BOARD_WIDTH * BLOCK_SIZE}
                />
                <Queue matrices={queue} />
            </div>
        </div>
    );
};

export default Tetris;
