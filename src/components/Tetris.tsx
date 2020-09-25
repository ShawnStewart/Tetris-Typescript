import React, { EventHandler, FC, KeyboardEvent, useEffect, useReducer, useRef } from 'react';

import MatrixCanvas from 'components/MatrixCanvas';
import { BOARD_HEIGHT, BOARD_WIDTH } from 'constants';
import { initialState, reducer } from 'reducer';

const Tetris: FC = () => {
    const [state] = useReducer(reducer, initialState);
    const tetrisContainerRef = useRef<HTMLDivElement>(null);
    const gameBoardRef = useRef<HTMLCanvasElement>(null);

    const { gameBoard } = state;

    useEffect(() => {
        // Focuses the Tetris container on initial load
        if (tetrisContainerRef.current) {
            tetrisContainerRef.current.focus();
        }
    }, [tetrisContainerRef]);

    const _handleOnKeyDown: EventHandler<KeyboardEvent> = (event) => {
        const { key, metaKey } = event;
        console.log(key, metaKey);
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
            <MatrixCanvas
                id="tetris-game-board"
                forwardRef={gameBoardRef}
                matrix={gameBoard}
                height={BOARD_HEIGHT}
                width={BOARD_WIDTH}
            />
        </div>
    );
};

export default Tetris;
