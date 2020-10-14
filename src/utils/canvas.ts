import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, COLOR_MAP } from '@constants';
import { PlayerPosition, TetrisMatrix } from '@types';

export const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const clearRows = (ctx: CanvasRenderingContext2D, rows: number[]): void => {
    // For animated row clearing
    for (const rowIdx of rows) {
        for (let colIdx = 0; colIdx < BOARD_WIDTH; colIdx++) {
            ctx.fillRect(colIdx * BLOCK_SIZE + 1, rowIdx * BLOCK_SIZE + 1, BLOCK_SIZE, BLOCK_SIZE);

            ctx.strokeStyle = '#0000001A';
            ctx.lineWidth = 1;
            ctx.beginPath();

            ctx.moveTo(colIdx * BLOCK_SIZE + 0.5, rowIdx * BLOCK_SIZE + 0.5);
            ctx.lineTo(colIdx * BLOCK_SIZE + 0.5, rowIdx * BLOCK_SIZE + BLOCK_SIZE + 0.5);
            ctx.lineTo(colIdx * BLOCK_SIZE + BLOCK_SIZE + 0.5, rowIdx * BLOCK_SIZE + BLOCK_SIZE + 0.5);
            ctx.lineTo(colIdx * BLOCK_SIZE + BLOCK_SIZE + 0.5, rowIdx * BLOCK_SIZE + 0.5);
            ctx.lineTo(colIdx * BLOCK_SIZE + 0.5, rowIdx * BLOCK_SIZE + 0.5);

            ctx.stroke();
        }
    }
};

interface DrawToCanvas extends Partial<PlayerPosition> {
    ctx: CanvasRenderingContext2D;
    fill?: boolean;
    matrix: TetrisMatrix;
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

export const drawGameOverScreen = (ctx: CanvasRenderingContext2D, finalScore: number): void => {
    ctx.fillStyle = '#000000f0';
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

    ctx.font = '35px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2);

    ctx.font = '16px sans-serif';
    ctx.fillText(`Final score: ${finalScore}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 35);
};

export const drawInitialScreen = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = '#000000f0';
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

    ctx.font = '35px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Welcome to Tetris', ctx.canvas.width / 2, ctx.canvas.height / 2);

    ctx.font = '16px sans-serif';
    ctx.fillText('Press any key to begin', ctx.canvas.width / 2, ctx.canvas.height / 2 + 35);
};

export const drawPauseScreen = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = '#000000f0';
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

    ctx.font = '35px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Paused', ctx.canvas.width / 2, ctx.canvas.height / 2);

    ctx.font = '16px sans-serif';
    ctx.fillText('Press escape to resume', ctx.canvas.width / 2, ctx.canvas.height / 2 + 35);
};
