import React, { FC } from 'react';

import { GameStats } from '@/types';

const Stats: FC<GameStats> = ({ level, lines, score }) => {
    return (
        <div id="tetris-game-stats">
            <div className="game-stat-section">
                <p className="game-stat-section-header">score</p>
                <p className="game-stat-section-value">{score}</p>
            </div>
            <div className="game-stat-section">
                <p className="game-stat-section-header">level</p>
                <p className="game-stat-section-value">{level}</p>
            </div>
            <div className="game-stat-section">
                <p className="game-stat-section-header">lines</p>
                <p className="game-stat-section-value">{lines}</p>
            </div>
        </div>
    );
};

export default Stats;
