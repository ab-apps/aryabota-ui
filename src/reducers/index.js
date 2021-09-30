import {createStore, combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage'
import userReducer from './user/user';
import mazeReducer from './maze/maze';

const persistConfig = {
    key: 'root',
    storage: localStorage,
    blacklist: ['currentLevel']
  }

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
    maze: persistReducer(persistConfig, mazeReducer)
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)
