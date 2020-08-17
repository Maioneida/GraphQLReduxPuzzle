import { createStore, combineReducers, compose, applyMiddleware} from 'redux'
import userReducer, {restoreSessionAction} from './userDuck.js'
import charsReducer, {getCharactersAction} from './charDuck.js'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let rootReducer = combineReducers({
    user: userReducer,
    characters: charsReducer
})

export default function generateStore() {
    let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
    //get chars for first time
    getCharactersAction()(store.dispatch, store.getState)
    restoreSessionAction()(store.dispatch)
    return store;
}