import React, { useContext } from 'react';
import '../styles/ErrorModal.css';
import { MazeState } from '../globalStates';
import Button from '@material-ui/core/Button';

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

    const submitForm = event => {
        const password = document.getElementById('pwd').value;
        const roll_number = document.getElementById('rollno').value;
        props.onClick(password, roll_number);
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <div>
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
                        onClick={(e) => submitForm(e)}
                        >
                        OK
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default IPSModal;
