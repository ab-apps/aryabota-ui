import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import './styles/characterController.css';
//GLOBAL CONTEXT / STATE
import { MazeState } from './globalStates';
import { convertToContinuousNumbering } from './utils';
import UiConfigs from './uiConfigurations';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import PlayArrowRounded from '@material-ui/icons/PlayArrowRounded';
import Maze from './mazeGenerator';
import LevelMap from './levelMap';
import {BASE_URL, environment} from './constants/routeConstants';

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
export default function Controller() {
    /**
     * Global context / state to manipulate character location, etc.
     * @const
     */
    const [mazeData, setMazeData] = useContext(MazeState);
    // const [pythonicCode, setPythonicCode] = useContext(PythonicCodeState);

    const [penState, setPenState] = useState("penDown");
    const [editorFont, setEditorFont] = useState(14);
    const userEmail = useSelector((state) => state.user.email)
    const currentLevel = useSelector((state) => state.user.currentLevel);

    /**
     * local state to store interval id / game loop id
     * @const
     */
    const [control, setControl] = useState({
        changeInterval: null,
        pythonicCode: null,
        outputValue: [],
        steps: []
    });

    useEffect(() => {
        if (control.steps.length && control.changeInterval == null) {
            control.changeInterval = setInterval(doChange, 600)
        }
    });

    function doChange() {
        if (control.steps.length > 0) {
            const currStep = control.steps[0]
            if (currStep?.stateChanges?.length > 0) {
                const change = currStep.stateChanges[0]
                setMazeData(prev => ({
                    ...prev,
                    ...change,
                    error_message: null,
                }))
                currStep.stateChanges.shift()
            } else if (currStep.error_message) {
                setMazeData(prev => ({
                    ...prev,
                    error_message: currStep.error_message
                }))
                control.steps.shift();
            } else if (currStep.message) {
                setMazeData(prev => ({
                    ...prev,
                    succeeded: currStep.succeeded,
                    message: currStep.message
                }))
                control.steps.shift();
            }
            else {
                control.outputValue.push(currStep.outputValue)
                control.steps.shift()
            }
        } else {
            clearInterval(control.changeInterval)
            setControl(prev => ({
                ...prev,
                changeInterval: null
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
                    // pen status from back-end (set via 'pen up' or 'pen down' commands)
                    const penStatusOnMove = change.pen;
                    if (penStatusOnMove === "up") setPenState("penUp")
                    else if (penStatusOnMove === "down") setPenState("penDown")
                    const newPositionsSeen = change.trail.map(trailObj => convertToContinuousNumbering(trailObj.row, trailObj.column, currState.columns));
                    currState = {
                        ...currState,
                        coinSweeper: newPos,
                        currentDirection: newDir,
                        positionsSeen: currState.positionsSeen.concat(newPositionsSeen),
                        penLoc: penState === "penDown"
                            ? currState.penLoc.concat(newPositionsSeen.slice(currState.prevSteps, newPositionsSeen.length - 1))
                            : currState.penLoc,
                        prevSteps: newPositionsSeen.length
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

    function getSteps(code, currState) {
        console.log('currlevel:', currentLevel);
        fetch(`${BASE_URL[environment]}/api/problem?level=` + currentLevel, {
            crossDomain: true,
            method: 'POST',
            body: JSON.stringify({ commands: code, level: currentLevel.toString(), email: userEmail }),
            headers: {
                'Content-type': 'application/json',
                'Content-Security-Policy': 'upgrade-insecure-requests'
            }
        })
            .then(response => response.json())
            .then(response => {
                setControl(prev => ({
                    ...prev,
                    outputValue: []
                }));
                parseResponse(response, currState)
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

    function resetGrid() {
        fetch('https://aryabota.herokuapp.com/api/problem?level=' + currentLevel, {
            crossDomain: true,
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Content-Security-Policy': 'upgrade-insecure-requests'
            }
        })
            .then(response => response.json())
            .then(response => {
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

    const submitCode = function (e) {
        e.preventDefault();
        getSteps(editorValue, mazeData);
        resetGrid();
    }

    const theme = createTheme({
        palette: {
            primary: blueGrey,
        },
    });

    let [editorValue, setEditorValue] = useState('');
    function onChange(newValue) {
        setEditorValue(newValue);
    }

    return (
        <>
            <LevelMap />
            <UiConfigs
                penLoc={mazeData.penLoc}
                onPenChange={setPenState}
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
                                    height: '300px'
                                }}
                                classname="editor"
                                mode="java"
                                theme="github"
                                fontSize={editorFont}
                                onChange={onChange}
                                name="editor-div"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </div>

                        <ThemeProvider theme={theme}>
                            <Button
                                style={{
                                    marginTop: '30px',
                                    float: 'right',
                                    marginRight: '4%'
                                }}
                                type="submit"
                                variant="contained"
                                color="primary"
                                endIcon={<PlayArrowRounded />}
                            >
                                Run
                            </Button>
                        </ThemeProvider>
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
                    penLoc={mazeData.penLoc}
                    prevSteps={mazeData.prevSteps}
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
                        mode="java"
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
                    mode="java"
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
