import React, { FC, memo, MutableRefObject, ReactElement, useEffect, useRef } from 'react';

import { TetrisMatrix } from '@/types';
import { clearCanvas, drawToCanvas } from '@/utils/canvas';

interface MatrixCanvasProps {
    id: string;
    ctxForwardRef?: MutableRefObject<CanvasRenderingContext2D | null>;
    matrix: TetrisMatrix;
    height: number;
    width: number;
}

const MatrixCanvas: FC<MatrixCanvasProps> = ({ id, ctxForwardRef, matrix, height, width }): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d');
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            if (ctxRef.current) {
                clearCanvas(ctxRef.current);
                drawToCanvas({ ctx: ctxRef.current, matrix });
            } else {
                ctxRef.current = canvasRef.current.getContext('2d');
            }
            if (ctxForwardRef && !ctxForwardRef.current) {
                ctxForwardRef.current = ctxRef.current;
            }
        }
    }, [ctxForwardRef, matrix]);

    return <canvas className="tetris-canvas" ref={canvasRef} id={id} height={height + 1} width={width + 1} />;
};

export default memo(MatrixCanvas);
