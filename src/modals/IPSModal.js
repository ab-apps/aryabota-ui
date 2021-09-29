import React, { useContext } from 'react';
import Linkify from 'react-linkify';
import '../styles/ErrorModal.css';
import { MazeState } from '../globalStates';
import Button from '@material-ui/core/Button';
import { TOP_LEVEL_PATHS } from '../constants/routeConstants';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	useHistory
} from "react-router-dom";

/**
 * UI Configuration Toolbar Component
 * This component provides support for:
 * 1. Adjusting font size (s/m/l) ranges
 * 2. Changing webpage base colour
 * 3. Toggling pen status (up/down)
 * @component
 * @example
 * <UiConfigs />
 */
function IPSModal(props) {
    /* eslint no-unused-vars:"off" */
    const [mazeData, setMazeData] = useContext(MazeState);

    const dismissModal = () => {
        // <Link className="router" to={`/${TOP_LEVEL_PATHS.GRID}`} style={{color: 'white'}}>Game</Link>
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={(e) => props.onClick(this, e)}>
                    <label>Roll No:</label>
                    <input type="text" name="rollno" id="rollno"></input>
                    <br /><br />
                    <label>Password:</label>
                    <input type="password" name="pwd" id="pwd"></input>
                    <br /><br />
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        >
                        OK
                    </Button>
                </form>

            </div>
        </div>
    )
}

export default IPSModal;
