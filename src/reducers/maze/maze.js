import { MAZE_TYPES } from "./mazeActions";

const initialState = {
    rows: '',
    columns: '',
    coins: [],
    dir: 'down',
    home: [],
    obstacles: [],
    pen: 'down',
    row: '',
    column: '',
    statement: '',
    levelType: '',
    error_message: '',
    obstacleLoc: [],
    coinLoc: [],
    problemSpec: '',
    currentDirection: '',
    positionsSeen: [],
    coinSweeper: []
}

const mazeReducer = (state = initialState, action) => {
    switch (action.type) {
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
        };
        case MAZE_TYPES.SUCCESS_MSG: return {
            ...state,
            succeeded: action.payload.succeeded,
            message: action.payload.message
        };
        case MAZE_TYPES.DISMISS_MODAL: return {
            ...state,
            error_message: '',
            message: '',
            succeeded: '',
        };
        case MAZE_TYPES.UNSET_DATA: return initialState;
        default: return state;
    }
}

export default mazeReducer;
