import React, { useState, useEffect } from 'react';
import './styles/levelMap.css';
import { useDispatch, useSelector } from 'react-redux'
import { setLevel, setBotStatus, setLevels } from './reducers/user/userActions';
import { convertToContinuousNumbering } from './utils';
import { BASE_URL, environment } from './constants/routeConstants';
import { setData } from './reducers/maze/mazeActions';

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
    const dispatch = useDispatch();
    const space = useSelector((state) => state.user.space);
    const currentLevel = useSelector((state) => state.user.currentLevel);
    const [levelMap, setLevelMap] = useState(undefined)

    const fetchLevelMap = () => {
        if (levelMap === undefined) {
            fetch(`${BASE_URL[environment]}/api/level?space=` + space, {
                crossDomain: true,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    dispatch(setLevels(response));
                    setLevelMap(response.map(level => {
                        if(level === currentLevel.toString())
                            return <div className="levelList selectedLevel" onClick={(e) => getLevel(e)}>{level}</div>
                        else
                            return <div className="levelList" onClick={(e) => getLevel(e)}>{level}</div>
                    }))
                })
        }
    }

    useEffect(() => { fetchLevelMap() });

    const getLevel = (e) => {
        let level = e.target.textContent;
        fetch(`${BASE_URL[environment]}/api/problem?level=` + level, {
            crossDomain: true,
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                setLevelMap(levelMap);
                dispatch(setLevel(level));
                dispatch(setBotStatus("inactive"));
                dispatch(setData({
                    rows: response?.rows,
                    columns: response?.columns,
                    coinSweeper: convertToContinuousNumbering(response?.row, response?.column, response?.columns),
                    coinLoc: response?.coins?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    obstacleLoc: response?.obstacles?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    positionsSeen: response?.coloured?.map(trailObj => convertToContinuousNumbering(trailObj.position.row, trailObj.position.column, response?.columns)),
                    currentDirection: response?.dir,
                    levelType: response?.type,
                    home: response?.homes?.map(obj => convertToContinuousNumbering(obj?.position?.row, obj?.position?.column, response?.columns)),
                    statement: response?.statement
                }));
            });
    }

    return (
        <>
            <div className="levelMap">
                <p>LEVELS</p>
                {levelMap}
            </div>
        </>
    );
}

export default LevelMap;