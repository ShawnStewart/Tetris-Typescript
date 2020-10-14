export const BLOCK_SIZE = 30;

export const BOARD_HEIGHT = 20;
export const BOARD_WIDTH = 10;

export const QUEUE_LENGTH = 4;

export enum ColorCodes {
    transparent = 0,
    background = 1,
    lightBlue = 2,
    blue = 3,
    orange = 4,
    yellow = 5,
    green = 6,
    pink = 7,
    red = 8,
}

export const COLOR_MAP = {
    [ColorCodes.transparent]: '#ffffff00',
    [ColorCodes.background]: '#000000',
    [ColorCodes.lightBlue]: '#60d9f4',
    [ColorCodes.blue]: '#4051d3',
    [ColorCodes.orange]: '#e8b23f',
    [ColorCodes.yellow]: '#f7f75c',
    [ColorCodes.green]: '#35ac51',
    [ColorCodes.pink]: '#ee61a3',
    [ColorCodes.red]: '#ff4444',
} as const;
