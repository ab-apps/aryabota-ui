import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage'
import userReducer from './user/user';
import mazeReducer from './maze/maze';

const persistConfig = {
  key: 'root',
  storage: localStorage
}

const rootReducer = persistCombineReducers(persistConfig, {
  user: userReducer,
  maze: mazeReducer
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)
