import { TetrisMatrix } from 'types';
import { initializeBoard } from 'utils';

export * as actionTypes from './actionTypes';

interface TetrisState {
    gameBoard: TetrisMatrix;
}

type TetrisActions = { type: string };

export const initialState: TetrisState = {
    gameBoard: initializeBoard(),
};

export const reducer = (state: TetrisState, action: TetrisActions): TetrisState => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};
