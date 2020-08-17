//import axios from 'axios'
import {updateDB, getFavsCharacters} from '../firebase' 
import ApolloClient, {gql} from 'apollo-boost'

//constants
let initialData = {
    fetching: false,
    array:["asd"],
    current:{},
    favorites:[],
    nextPage: 1
};
            //Axios URL
//let URL = "https://rickandmortyapi.com/api/character"

let client = new ApolloClient({
    uri:"https://rickandmortyapi.com/graphql"
})

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCCES = "GET_CHARACTERS_SUCCES"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

let UPDATE_PAGE = "UPDATE_PAGE"

let REMOVE_CHARACTER = "REMOVE_CHARACTER";

let ADD_TO_FAVORITES = "ADD_TO_FAVORITES"

let GET_FAVS = "GET_FAVS"
let GET_FAVS_ERROR = "GET_FAVS_ERROR"
let GET_FAVS_SUCCES = "GET_FAVS_SUCCES"

//reducer
export default function reducer (state = initialData, action){
    switch(action.type){
        case UPDATE_PAGE:
            return{...state,nextPage:action.payload}

        case GET_FAVS:
            return {...state, fetching:true}
        case GET_FAVS_ERROR:
            return {...state, fetching:false, error: action.payload}
        case GET_FAVS_SUCCES:
            return {...state, fetching:false, favorites: action.payload}

        case ADD_TO_FAVORITES:
            return {...state, ...action.payload}

        case REMOVE_CHARACTER:
            return {...state, array: action.payload}
    
        case GET_CHARACTERS:
            return {...state, fetching: true}
        case GET_CHARACTERS_ERROR:
            return {...state, fetching:false, error:action.payload}
        case GET_CHARACTERS_SUCCES:
            return { ...state, array: action.payload, fetching:false}

        default:
            return state
    }
}

//actions (thunks)
export let retrieveFavs = () => (dispatch, getState) => {
    dispatch({
        type:GET_FAVS
    })
    let {uid} = getState().user
    return getFavsCharacters(uid)
    .then(arrayFavs=>{
        localStorage.favsChars = JSON.stringify([...arrayFavs])
        dispatch({
            type:GET_FAVS_SUCCES,
            payload:[...arrayFavs]
        })
    })
    .chatch(e=>{
        console.log(e)
        dispatch({
            type:GET_FAVS_ERROR,
            payload:e.message
        })
    })
}

export let addFavoriteCharacterAction = () => (dispatch, getState) => {
    let {array, favorites} = getState().characters;
    let {uid} = getState().user;
    let char = array.shift();
    favorites.push(char)
    updateDB(favorites, uid);
    
    //funcion updateLocalStorage mas bonito
    let storage = JSON.parse(localStorage.getItem('favsChars'))
    storage.push(char)
    localStorage.favsChars = JSON.stringify(storage)
    
    dispatch({
        type:ADD_TO_FAVORITES,
        payload: {array:[...array], favorites:[...favorites]}
    })
}

export let removeCharactersAction = () => (dispatch, getState) => { 
    let {array} = getState().characters;
    array.shift();
    if(!array.length){
        getCharactersAction()(dispatch, getState)
        return
    }
    dispatch({
        type: REMOVE_CHARACTER,
        payload:[...array]
    })
}

export let getCharactersAction = () => (dispatch, getState) => { 
            //Apollo Api Method
    let query = gql`
    query ($page:Int){
        characters(page:$page){
            info{
                next
            }
            results{
                name
                image
            }
        }
    }
    `
    dispatch({
        type:GET_CHARACTERS
    })
    let {nextPage} = getState().characters
    return client.query({
        query,
        variables: {page : nextPage}
    })
        .then(( {data, error} ) => {
            if(error) {
                dispatch({
                    type:GET_CHARACTERS_ERROR,
                    payload:error
                })
            }
        dispatch({
            type:GET_CHARACTERS_SUCCES,
            payload:data.characters.results
        })
        dispatch({
            type:UPDATE_PAGE,
            payload:data.characters.info.next ? data.characters.info.next : 1
        })
    })
    .catch({

    })

            //Axios Api Method
    // dispatch({
    //     type:GET_CHARACTERS
    // })    
    // return axios.get(URL)
    //     .then (res => {
    //         dispatch ({
    //             type: GET_CHARACTERS_SUCCES,
    //             payload:res.data.results
    //         })
    //     })
    //     .catch(err=> {
    //         dispatch({
    //             type:GET_CHARACTERS_ERROR,
    //             payload: err.response.message
    //         })
    //     })
    }