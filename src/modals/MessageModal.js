import React from 'react';
import Linkify from 'react-linkify';
import '../styles/ErrorModal.css';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { dismissModal } from '../reducers/maze/mazeActions';

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
    const dispatch = useDispatch();

    const dismiss_modal = () => {
        dispatch(dismissModal());
    }
    return (
        <div className="modal" onClick={dismiss_modal}>
            <div className="error-modal">
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
