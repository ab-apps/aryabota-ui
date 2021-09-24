import React, { useContext } from 'react';
import './styles/levelMap.css';
//GLOBAL CONTEXT / STATE
import { MazeState } from './globalStates';
import { convertToContinuousNumbering } from './utils';

/**
 * UI Configuration Toolbar Component
 * This component provides support for:
 * 1. Adjusting font size (s/m/l) ranges
 * 2. Changing webpage base colour
 * 3. Toggling levels
 * @component
 * @example
 * <UiConfigs />
 */
function LevelMap(props) {

    const mazeContext = useContext(MazeState);
    const setMazeData = mazeContext[1];

    const getLevel = (e) => {
        let level = e.target.textContent;
        console.log('level', level);

        fetch('https://aryabota.herokuapp.com/api/problem?level=' + level, {
            crossDomain: true,
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Content-Security-Policy': 'upgrade-insecure-requests'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('response:', response);
                setMazeData(mazeData => ({
                    ...mazeData,
                    rows: response?.rows,
                    columns: response?.columns,
                    coinSweeper: convertToContinuousNumbering(response?.row, response?.column, response?.columns),
                    coinLoc: response?.coins?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    obstacleLoc: response?.obstacles?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    positionsSeen: response?.trail?.map(trailObj => convertToContinuousNumbering(trailObj?.row, trailObj?.column, response?.columns)),
                    currentDirection: response?.dir,
                    levelType: response?.type,
                    home: response?.homes?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    statement: response?.statement,
                    problemSpec: response?.problem_spec,
                    //TODO: Might want to set these two values from backend
                    penLoc: [1],
                    prevSteps: 1
                }))
            });
    }

    return (
        <>
            <div className="levelMap">
                <p>LEVELS</p>
                <br />
                <div onClick={(e) => getLevel(e)}>0.1</div>
                <div onClick={(e) => getLevel(e)}>0.2</div>
            </div>
        </>
    );
}

export default LevelMap;