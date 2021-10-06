export const MAZE_TYPES = {
    SET_DATA: 'maze/set_all_data',
    UNSET_DATA: 'maze/unset_all_data',
    UPDATE_POS: 'maze/update_position',
    UPDATE_DIR: 'maze/update_direction',
    SET_ERR: 'maze/set_error',
    UNSET_ERR: 'maze/unset_error',
    SET_STATE: 'maze/set_state',
    SUCCESS_MSG: 'maze/success_message',
    DISMISS_MODAL: 'maze/dismiss_modal'
}

export const setData = data => {
    return {
        type: MAZE_TYPES.SET_DATA,
        payload: data,
    };
};

export const unsetData = () => {
    return {
        type: MAZE_TYPES.UNSET_DATA
    }
};

export const updatePosition = (rowPos, colPos) => {
    return {
        type: MAZE_TYPES.UPDATE_POS,
        payload: {
            rowPos: rowPos,
            colPos: colPos,
        }
    };
};

export const updateDirection = newDir => {
    return {
        type: MAZE_TYPES.UPDATE_DIR,
        payload: {direction: newDir}
    };
};

export const setError = err => {
    return {
        type: MAZE_TYPES.SET_ERR,
        payload: {errorMessage: err}
    };
};

export const unsetError = () => {
    return {
        type: MAZE_TYPES.UNSET_ERR
    };
};

export const setState = (change) => {
    return {
        type: MAZE_TYPES.SET_STATE,
        payload: {change: change}
    }
}

export const successMessage = (succeeded, msg) => {
    return {
        type: MAZE_TYPES.SUCCESS_MSG,
        payload: {message: msg, succeeded: succeeded}
    }
}

export const dismissModal = () => {
    return {
        type: MAZE_TYPES.DISMISS_MODAL
    }
}