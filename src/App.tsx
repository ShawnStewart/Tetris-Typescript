import React, { ReactElement } from 'react';

import Tetris from 'components/Tetris';

import './app.scss';

const App = (): ReactElement => {
    return (
        <div id="App-template" data-testid="App-template">
            <Tetris />
        </div>
    );
};

export default App;
