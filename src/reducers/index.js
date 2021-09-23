import {createStore, combineReducers} from 'redux';
import userReducer from './user';

const rootReducer = combineReducers({
    user: userReducer
});

export default createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
