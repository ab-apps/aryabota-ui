import React, { useContext, useEffect, useState } from 'react';
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
    const [question, showQuestion] = useState(true);

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
            // else {
            //     let stepObj = {
            //         python: step.python,
            //     };
            //     steps.push(stepObj)
            //     setControl(prev => ({
            //         ...prev,
            //         steps: steps
            //     }));
            // }
        })

    }

    function getSteps(code, currState) {
        fetch('https://aryabota.herokuapp.com/api/problem?level=0.1', {
            crossDomain: true,
            method: 'POST',
            body: JSON.stringify({commands: code, level: '0.1', email: 'abc@gmail.com'}),
            headers: {
                'Content-type': 'application/json',
                'Content-Security-Policy': 'upgrade-insecure-requests'
            }
        })
            .then(response => response.json())
            .then(response => {
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

    /* eslint no-unused-vars:"off" */
    const displayQuestion = function (e) {
        if (question) {
            document.getElementById('question').style.display = 'none';
            showQuestion(false);
        }
        else {
            document.getElementById('question').style.display = 'block';
            showQuestion(true);
        }
    }

    const submitCode = function (e) {
        e.preventDefault();
        getSteps(editorValue, mazeData)
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
    const submitButtonStyle = {
        marginTop: '30px',
        width: '110px',
        marginLeft: mazeData.levelType === 'value_match'
            ? '90px'
            : '65%'
    }

    return (
        <>
            <UiConfigs
                penLoc={mazeData.penLoc}
                onPenChange={setPenState}
                onSizeChange={setEditorFont}
            />
                {/* <LevelMap /> */}
                <div className="game-info">
                    <div className="problem-div">
                        <p id="question">{mazeData.statement}</p>
                        <br />
                    </div>
                    <h3>Enter your code here:</h3>
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
                <div width="200px">
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
                        <h3 className="output-title">Output:</h3>
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
                <div className="game-info" id="python-pane">
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
