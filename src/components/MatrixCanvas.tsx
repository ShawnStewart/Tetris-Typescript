import React, { FC, ReactElement, RefObject, useEffect } from 'react';

import { TetrisMatrix } from 'types';
import { drawToCanvas } from 'utils';
import './canvas.scss';

interface IMatrixCanvas {
    id: string;
    forwardRef: RefObject<HTMLCanvasElement>;
    matrix: TetrisMatrix;
    height: number;
    width: number;
}

const MatrixCanvas: FC<IMatrixCanvas> = (props): ReactElement => {
    const { children, id, forwardRef, height, matrix, width } = props;

    useEffect(() => {
        if (forwardRef.current) {
            const canvas = forwardRef.current;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const ctx = canvas.getContext('2d')!;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawToCanvas({ ctx, matrix });
        }
    }, [forwardRef, matrix]);

    return (
        <canvas ref={forwardRef} id={id} height={height} width={width} style={{ border: '2px solid black' }}>
            {children}
        </canvas>
    );
};

export default MatrixCanvas;
