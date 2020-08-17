import {loginWithGoogle, logoutGoogle} from '../firebase.js'
import {retrieveFavs } from './charDuck'

//constants
let initialData = {
    loggedIn: false,
    fetching: false
}
let LOGIN = "LOGIN"
let LOGIN_SUCCES = "LOGIN_SUCCES"
let LOGIN_ERROR = "LOGIN_ERROR"

let LOGOUT = "LOGOUT"

//reducer
export default function reducer(state = initialData, action) {
    switch (action.type) {
        case LOGOUT:
            return{...initialData}
        case LOGIN_ERROR:
            return {...state, fetching:false, error:action.payload}
        case LOGIN_SUCCES:
            return {...state, fetching:false, ...action.payload, loggedIn: true}
        case LOGIN:
            return {...state, fetching: true}
        default:
            return state;
    }
}

//aux
function saveStorage(storage){
    localStorage.storage = JSON.stringify(storage)
}

//actions
export let doLogoutAction = () => (dispatch, getState) => {
    logoutGoogle();
    dispatch({
        type:LOGOUT
    })
    localStorage.removeItem('storage')
    localStorage.removeItem('favsChars')
}

export let restoreSessionAction = () => dispatch =>{
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    if(storage && storage.user)
        dispatch({
            type:LOGIN_SUCCES,
            payload: storage.user
        })
}

export let doGoogleLoginAction = () => (dispatch, getState) =>{
    dispatch({
        type: LOGIN
    })
    return loginWithGoogle()
        .then(user => {
            dispatch({
                type:LOGIN_SUCCES,
                payload:{
                    uid:user.uid,
                    displayName:user.displayName,
                    email:user.email,
                    photoURL:user.photoURL
                }
            })
            saveStorage(getState())
            retrieveFavs()(dispatch, getState)
        })
        .catch(e=>{
            console.log(e)
            dispatch({
                type:LOGIN_ERROR,
                payload:e.message
            })
        })
    }