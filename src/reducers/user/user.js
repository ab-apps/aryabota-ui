import { USER_TYPES } from './userActions';

const initialState = {
    email: '',
    fullName: '',
    currentLevel: 0.1,
    space: '',
    botStatus: 'inactive'
};

const userReducer = (state = initialState, action ) => {
    switch(action.type) {
        case USER_TYPES.SET_EMAIL: return {
            ...state,
            email: action.payload.email,
        };
        case USER_TYPES.UNSET_EMAIL: return {
            ...state,
            email: '',
        };
        case USER_TYPES.SET_LEVEL: return {
            ...state,
            currentLevel: action.payload.level
        };
        case USER_TYPES.SET_NAME: return {
            ...state,
            fullName: action.payload.fullName
        };
        case USER_TYPES.SET_SPACE: return {
            ...state,
            space: action.payload.space
        };
        case USER_TYPES.SET_BOT_STATUS: return {
            ...state,
            botStatus: action.payload.botStatus
        };
        case USER_TYPES.UNSET_ALL: return {
            ...state,
            space: '',
            email: '',
            fullName: '',
            currentLevel: 0.1
        };
        default: return state;
    }
}

export default userReducer;