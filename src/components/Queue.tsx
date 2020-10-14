import React, { FC } from 'react';

import MatrixCanvas from '@components/MatrixCanvas';
import { BLOCK_SIZE } from '@constants';
import { PlayerState } from '@types';

interface QueueProps {
    matrices: PlayerState[];
}

const Queue: FC<QueueProps> = ({ matrices }) => {
    const queue = matrices.map(({ shape, tetrominoId, tetrominoNumber }) => {
        const id = `${tetrominoId}-${tetrominoNumber}`;

        return (
            <MatrixCanvas
                id={id}
                key={id}
                matrix={shape}
                height={shape.length * BLOCK_SIZE}
                width={shape.length * BLOCK_SIZE}
            />
        );
    });

    return <div id="tetris-queue">{queue}</div>;
};

export default Queue;
