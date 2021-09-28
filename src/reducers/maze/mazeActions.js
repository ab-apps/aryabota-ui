export const MAZE_TYPES = {
    SET_DATA: 'maze/set_all_data',
    // UNSET_DATA: 'maze/unset_all_data',
    UPDATE_POS: 'maze/update_position',
    UPDATE_DIR: 'maze/update_direction',
}

export const setData = data => {
    return {
        type: MAZE_TYPES.SET_DATA,
        payload: data,
    };
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