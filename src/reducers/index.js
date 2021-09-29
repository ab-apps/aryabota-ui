import {createStore, combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage'
import userReducer from './user';

const persistConfig = {
    key: 'root',
    storage: localStorage
  }

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer)
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)
