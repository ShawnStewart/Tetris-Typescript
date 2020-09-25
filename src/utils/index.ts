import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, COLOR_MAP } from 'constants';

import { ColorCodes, TetrisMatrix } from 'types';

export const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

interface DrawToCanvas {
    ctx: CanvasRenderingContext2D;
    fill?: boolean;
    matrix: TetrisMatrix;
    x?: number;
    y?: number;
}

export const drawToCanvas = ({ ctx, fill = true, matrix: m, x = 0, y = 0 }: DrawToCanvas): void => {
    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[0].length; j++) {
            const posX = (j + x) * BLOCK_SIZE;
            const posY = (i + y) * BLOCK_SIZE;
            const colorCode = m[i][j];

            ctx.fillStyle = COLOR_MAP[colorCode];

            // If fill === false, add 30% opacity
            if (!fill && colorCode) {
                ctx.fillStyle = `${ctx.fillStyle}48`;
            }

            ctx.fillRect(posX + 1, posY + 1, BLOCK_SIZE, BLOCK_SIZE);

            if (!fill) {
                // If fill === false, draw a colored border
                ctx.strokeStyle = COLOR_MAP[colorCode];
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(posX + 1.5, posY + 1.5);
                ctx.lineTo(posX + 1.5, posY + BLOCK_SIZE - 0.5);
                ctx.lineTo(posX + BLOCK_SIZE - 0.5, posY + BLOCK_SIZE - 0.5);
                ctx.lineTo(posX + BLOCK_SIZE - 0.5, posY + 1.5);
                ctx.lineTo(posX + 1.5, posY + 1.5);
                ctx.stroke();
            }

            // Draw square border
            if (colorCode) {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1;
                ctx.beginPath();

                ctx.moveTo(posX + 0.5, posY + 0.5);
                ctx.lineTo(posX + 0.5, posY + BLOCK_SIZE + 0.5);
                ctx.lineTo(posX + BLOCK_SIZE + 0.5, posY + BLOCK_SIZE + 0.5);
                ctx.lineTo(posX + BLOCK_SIZE + 0.5, posY + 0.5);
                ctx.lineTo(posX + 0.5, posY + 0.5);

                ctx.stroke();
            }
        }
    }
};

export const initializeBoard = (): TetrisMatrix => {
    const board = new Array<ColorCodes[]>(BOARD_HEIGHT);

    for (let i = 0; i < BOARD_HEIGHT; i++) {
        board[i] = new Array<ColorCodes>(BOARD_WIDTH).fill(1);
    }

    return board;
};
