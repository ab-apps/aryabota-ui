import React, { useContext, useState, useEffect } from 'react';
import './styles/levelMap.css';
import { useDispatch, useSelector } from 'react-redux'
import { setLevel, setLevels } from './reducers/actions';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
//GLOBAL CONTEXT / STATE
import { MazeState } from './globalStates';
import { convertToContinuousNumbering } from './utils';
import { BASE_URL, environment } from './constants/routeConstants';

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
    const mazeContext = useContext(MazeState);
    const setMazeData = mazeContext[1];
    const space = useSelector((state) => state.user.space);
    const [levelMap, setLevelMap] = useState(undefined)

    const RoundButton = styled(Button)({
        borderRadius: '100%',
        margin: '5px',
        backgroundColor: '#BDBDBD',
        color: '#212121',
        '&:hover': {
            backgroundColor: '#9E9E9E'
        }
    })

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
                    dispatch(setLevels(response))
                    setLevelMap(response.map(level => {
                        return <RoundButton onClick={(e) => getLevel(e)}>{level}</RoundButton>
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
                dispatch(setLevel(level));
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
                {levelMap}
            </div>
        </>
    );
}

export default LevelMap;