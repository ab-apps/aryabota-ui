import React, { useContext } from 'react';
import Linkify from 'react-linkify';
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
function MessageModal(props) {
    /* eslint no-unused-vars:"off" */
    const [mazeData, setMazeData] = useContext(MazeState);

    const dismissModal = () => {
        setMazeData(prev => ({
            ...prev,
            error_message: null,
            message: null,
            succeeded: null,
        }))
    }
    return (
        <div className="modal" onClick={dismissModal}>
            <div className="modal-content">
                <Linkify>
                    <div>{props.error_message}</div>
                </Linkify>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={dismissModal}>
                    OK
                </Button>
            </div>
        </div>
    )
}

export default MessageModal;
