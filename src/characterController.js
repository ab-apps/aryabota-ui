import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import './styles/characterController.css';
import { convertToContinuousNumbering } from './utils';
import UiConfigs from './uiConfigurations';
import Button from '@material-ui/core/Button';
import PlayArrowRounded from '@material-ui/icons/PlayArrowRounded';
import Maze from './mazeGenerator';
import LevelMap from './levelMap';
import { BASE_URL, environment } from './constants/routeConstants';
import { setData, setError, setState, successMessage } from './reducers/maze/mazeActions';
import { useDispatch } from 'react-redux';
import { setBotStatus } from './reducers/user/userActions';

/**
 * Component for controlling character/player
 * This component:
 * 1. take movement input to move player correctly
 * 2. take care of maze boundaries
 * 3. handles eating food 
 * 4. updates winning condition and score
 * @component
 * @example
 * <Controller />
 */
const Controller = () => {
    /**
    * Global context / state to manipulate character location, etc.
    * @const
    */
    const dispatch = useDispatch();
    const mazeData = useSelector(state => state.maze);
    const [editorFont, setEditorFont] = useState(14);
    const userEmail = useSelector((state) => state.user.email)
    const space = useSelector((state) => state.user.space)
    const currentLevel = useSelector((state) => state.user.currentLevel);
    const botStatus = useSelector((state) => state.user.botStatus);

    /**
     * local state to store interval id / game loop id
     * @const
     */
    const [control, setControl] = useState({
        changeInterval: null,
        forwardChangeInterval: null,
        pythonicCode: null,
        outputValue: [],
        steps: []
    });

    useEffect(() => {
        if (control.steps.length && control.changeInterval == null) {
            dispatch(setBotStatus("active"));
            control.changeInterval = setInterval(doChange, 600);
        }
    });

    function doChange() {
        if (control.steps.length > 0) {
            const currStep = control.steps[0]
            if (currStep?.stateChanges?.length > 0) {
                const change = currStep.stateChanges[0];
                dispatch(setState(change));
                currStep.stateChanges.shift()
            } else if (currStep.error_message) {
                dispatch(setError(currStep.error_message));
                control.steps.shift();
            } else if (currStep.message) {
                dispatch(successMessage(currStep.succeeded, currStep.message));
                control.steps.shift();
            }
            else {
                control.outputValue.push(currStep.outputValue)
                control.steps.shift()
            }
        } else {
            clearInterval(control.changeInterval)  
            clearInterval(control.forwardChangeInterval)
            dispatch(setBotStatus("paused"))
            setControl(prev => ({
                ...prev,
                changeInterval: null,
                forwardChangeInterval: null
            }))
        }

    }

    function parseResponse(response, currState) {
        setControl(prev => ({
            ...prev,
            pythonicCode: response.python
        }))
        let steps = [];
        response.response?.forEach(step => {
            if (step.error_message) {
                steps.push({
                    error_message: step.error_message
                });
                setControl(prev => ({
                    ...prev,
                    steps: steps
                }));
                /* eslint no-throw-literal: "off" */
                throw "obstacle/boundary error";
            }
            if ("value" in step) {
                let stepObj = {
                    outputValue: step.value
                };
                steps.push(stepObj)
                setControl(prev => ({
                    ...prev,
                    steps: steps
                }));
            } else if ("stateChanges" in step) {
                let stepObj = {
                    stateChanges: []
                };
                step.stateChanges?.forEach(change => {
                    const newPos = convertToContinuousNumbering(change.row, change.column, currState.columns);
                    const newDir = change.dir;
                    const newPositionsSeen = change.coloured?.map(trailObj => 
                        convertToContinuousNumbering(trailObj.position.row, trailObj.position.column, currState.columns)
                    );
                    currState = {
                        ...currState,
                        coinSweeper: newPos,
                        currentDirection: newDir,
                        positionsSeen: currState.positionsSeen.concat(newPositionsSeen)
                    };
                    stepObj.stateChanges.push(currState);
                });
                steps.push(stepObj);
                setControl(prev => ({
                    ...prev,
                    steps: steps
                }));
            }
            else if ("message" in step) {
                steps.push(step);
                setControl(prev => ({
                    ...prev,
                    steps: steps
                }));
            }
        })
    }

    function getSteps(code) {
        /**
         * making request to get initial state of the grid and robot 
         */
        fetch(`${BASE_URL[environment]}/api/problem?level=` + currentLevel, {
            crossDomain: true,
            method: 'GET',
            headers: {
            'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
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
                    statement: response?.statement,
                  }));
            });
        fetch(`${BASE_URL[environment]}/api/problem?level=` + currentLevel, {
            crossDomain: true,
            method: 'POST',
            body: JSON.stringify({ commands: code, level: currentLevel.toString(), email: userEmail, space: space}),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                setControl(prev => ({
                    ...prev,
                    outputValue: []
                }));
                parseResponse(response, mazeData)
            });
    }

    function getPythonicCode() {
        if (control.pythonicCode)
            return control.pythonicCode.replace(/,/g, '\n');
        else
            return null
    }

    function getOutputValue() {
        let output = control.outputValue.toString();
        //TODO: If someone can make this code better, pls do
        output = output.replace(/,/g, '\n');
        output = output.replace(/\n\n*/g, '\n');
        output = output.replace(/^\s*\n+|\s*\n+$/g, '');
        return output;
    }

    const submitCode = function (e) {
        e.preventDefault();
        if (botStatus === "inactive") {
            getSteps(editorValue);
        }
        else if (botStatus === "active") {
            clearInterval(control.changeInterval);
            control.forwardChangeInterval = setInterval(doChange, 0);
        }
        else if (botStatus === "paused") {
            fetch(`${BASE_URL[environment]}/api/problem?level=` + currentLevel, {
                crossDomain: true,
                method: 'GET',
                headers: {
                'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(response => {
                    dispatch(setBotStatus("inactive"))
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
    }

    let [editorValue, setEditorValue] = useState('');
    function onChange(newValue) {
        setEditorValue(newValue);
    }

    function getButtonText() {
        if (botStatus === "inactive")
            return "Run";
        else if (botStatus === "active")
            return "Forward";
        else if (botStatus === "paused")
            return "Reset";
    }

    return (
        <>
            <LevelMap />
            <UiConfigs
                onSizeChange={setEditorFont}
            />

            <div className="first-pane">
                <div className="problem-div">
                    <h3>Question</h3>
                    <p id="question">{mazeData.statement}</p>
                    <br />
                </div>
                <h3>Your code here</h3>
                <div className="input-div">
                    <form onSubmit={submitCode}>
                        <div style={{
                            marginRight: '50px'
                        }}>
                            <AceEditor
                                style={{
                                    width: '116%',
                                    height: '300px',
                                    fontFamily: 'monospace'
                                }}
                                classname="editor"
                                mode="python"
                                theme="github"
                                fontSize={editorFont}
                                onChange={onChange}
                                name="editor-div"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </div>

                        <div className="runButton">
                            <Button
                                style={{
                                    marginTop: '30px',
                                    float: 'right',
                                    width: 'fit-content',
                                    marginRight: '4%',
                                    color: 'black',
                                    backgroundColor: '#d5d5d5'
                                }}
                                type="submit"
                                variant="contained"
                                // color="primary"
                                
                                endIcon={<PlayArrowRounded />}
                            >
                                {getButtonText()}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="separator"></div>
            <div className="grid-div" width="200px">
                <Maze
                    x={mazeData.rows}
                    y={mazeData.columns}
                    coinLoc={mazeData.coinLoc}
                    obstacleLoc={mazeData.obstacleLoc}
                    coinSweeper={mazeData.coinSweeper}
                    currentDirection={mazeData.currentDirection}
                    positionsSeen={mazeData.positionsSeen}
                    home={mazeData.home}
                />
                <br />
                <div className="output-div">
                    <h3 className="output-title">Output</h3>
                    <AceEditor
                        style={{
                            width: '100%',
                            height: '100px'
                        }}
                        classname="editor"
                        mode="python"
                        theme="github"
                        value={getOutputValue()}
                        fontSize={editorFont}
                        readOnly={true}
                        name="output-div"
                        editorProps={{ $blockScrolling: true }}
                    />
                </div>
            </div>
            <div className="separator" id="separator-2"></div>
            <div className="python-div" id="python-pane">
                <h3>Translated Code: Python</h3>
                <AceEditor
                    style={{
                        width: '100%',
                        height: '300px'
                    }}
                    classname="editor"
                    mode="python"
                    theme="github"
                    value={getPythonicCode()}
                    fontSize={editorFont}
                    readOnly={true}
                    name="python-div"
                    editorProps={{ $blockScrolling: true }}
                />
            </div>
            <div className="controller"></div>
        </>
    );
}

export default Controller;