import { MAZE_TYPES } from "./mazeActions";

const initialState = {
    rows: '',
    columns: '',
    coins: [],
    coins_per_position: [],
    dir: 'down',
    homes: [],
    obstacles: [],
    obstacles_per_position: [],
    pen: 'down',
    row: '',
    rows: '',
    statement: '',
    trail: [],
    type: '',
}

const mazeReducer = (state = initialState, action) => {
    switch(action.type) {
        case MAZE_TYPES.SET_DATA: return {
            ...state,
            ...action.payload
        };
        case MAZE_TYPES.UPDATE_DIR: return {
            ...state,
            dir: action.payload.direction
        };
        case MAZE_TYPES.UPDATE_POS: return {
            ...state,
            row: action.payload.row_pos,
            column: action.payload.column
        };
        default: return state;
    }
}

export default mazeReducer;
