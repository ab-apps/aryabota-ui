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
    column: '',
    statement: '',
    trail: [],
    type: '',
    error_message: ''
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
            row: action.payload.rowPos,
            column: action.payload.colPos
        };
        case MAZE_TYPES.SET_ERR: return {
            ...state,
            error_message: action.payload.errorMessage
        };
        case MAZE_TYPES.UNSET_ERR: return {
            ...state,
            error_message: ''
        };
        case MAZE_TYPES.SET_STATE: return {
            ...state,
            ...action.payload.change,
            error_message: ''
        }
        case MAZE_TYPES.SUCCESS_MSG: return {
            ...state,
            succeeded: action.payload.succeeded,
            message: action.payload.message
        }
        case MAZE_TYPES.DISMISS_MODAL: return {
            ...state,
            error_message: '',
            message: '',
            succeeded: '',
        }
        default: return state;
    }
}

export default mazeReducer;
