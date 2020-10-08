import React, { EventHandler, FC, KeyboardEvent, useCallback, useEffect, useReducer, useRef, useState } from 'react';

import * as actionTypes from '@actions/actionTypes';
import MatrixCanvas from '@components/MatrixCanvas';
import Queue from '@components/Queue';
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH } from '@constants';
import { initialState, reducer } from '@reducers';
import { checkForCollision, checkForCompletedRows, rotateMatrix } from '@utils';
import { clearCanvas, drawGameOverScreen, drawPauseScreen, drawToCanvas } from '@utils/canvas';

import './Tetris.scss';

const Tetris: FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const tetrisContainerRef = useRef<HTMLDivElement>(null);
    const gameBoardCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const requestRef = useRef(0);
    const lastTick = useRef(0);
    const [frameCount, setFrameCount] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    const { gameBoard, player, queue } = state;

    // console.log('tetris render', gameBoard);

    const _movePlayerDown = useCallback(() => {
        if (player.y === player.placeholder.y) {
            if (player.y < 0) {
                setGameOver(true);
            }

            dispatch({ type: actionTypes.PLAYER_BLOCKED });
        } else {
            dispatch({ type: actionTypes.MOVE_PLAYER_DOWN });
        }
    }, [player.placeholder.y, player.y]);

    useEffect(() => {
        // Focuses the Tetris container on initial load
        if (tetrisContainerRef.current) {
            tetrisContainerRef.current.focus();
        }
    }, []);

    useEffect(() => {
        // Game loop
        if (!isPaused && !gameOver) {
            requestRef.current = requestAnimationFrame(() => {
                const now = performance.now();

                if (now - 500 >= lastTick.current) {
                    _movePlayerDown();

                    lastTick.current = now;
                    setFrameCount(0);
                } else {
                    setFrameCount(frameCount + 1);
                }
            });
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [_movePlayerDown, frameCount, gameOver, isPaused]);

    useEffect(() => {
        // Re-draw the game board and player position
        if (gameBoardCtxRef.current) {
            clearCanvas(gameBoardCtxRef.current);
            drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: gameBoard });
            drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: player.shape, x: player.x, y: player.y });
            drawToCanvas({ ctx: gameBoardCtxRef.current, matrix: player.shape, fill: false, ...player.placeholder });

            if (gameOver) {
                console.log('game over');
                drawGameOverScreen(gameBoardCtxRef.current);
            } else if (isPaused) {
                console.log('paused');
                drawPauseScreen(gameBoardCtxRef.current);
            }
        }
    }, [gameBoard, gameOver, isPaused, player.placeholder, player.shape, player.x, player.y]);

    useEffect(() => {
        const completedRows = checkForCompletedRows(gameBoard);

        if (completedRows.length) {
            dispatch({ type: actionTypes.UPDATE_GAME_BOARD, payload: completedRows });
        }
    }, [gameBoard]);

    const _handleOnKeyDown: EventHandler<KeyboardEvent> = (event) => {
        const { key } = event;
        console.log('keyDown', key);

        if (gameOver) {
            return;
        } else if (isPaused) {
            if (key === 'Escape') {
                setIsPaused(!isPaused);
            }

            return;
        }

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

                const rotatedShape = rotateMatrix(player.shape);
                const collision = checkForCollision({ gameBoard, ...player, shape: rotatedShape, x });

                if (!collision) {
                    dispatch({ type: actionTypes.ROTATE_PLAYER, payload: { shape: rotatedShape, x } });
                }
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
                _movePlayerDown();
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
                if (process.env.NODE_ENV === 'production') {
                    dispatch({ type: actionTypes.RESET_PLAYER });
                }
                break;
            }
            case 'Escape': {
                setIsPaused(!isPaused);
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
            onBlur={() => setIsPaused(true)}
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
