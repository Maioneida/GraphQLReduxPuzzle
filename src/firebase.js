import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


let firebaseConfig = {
    apiKey: "AIzaSyA4GiGLzpNFKbc3gG_VlLeTeLsruIk2vrE",
    authDomain: "reactgraphqlpuzzle.firebaseapp.com",
    databaseURL: "https://reactgraphqlpuzzle.firebaseio.com",
    projectId: "reactgraphqlpuzzle",
    storageBucket: "reactgraphqlpuzzle.appspot.com",
    messagingSenderId: "77604538807",
    appId: "1:77604538807:web:46347b43b82eacd9f28032"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection('favs');

export function getFavsCharacters(uid){
    return db.doc(uid).get()
    .then(snap=>{

        //El if pregunta si el usuario ya tiene favs guardados, y el else devuelve un array vacio para evitar errores por "undefined"

        if(snap.data())
        {
            
            return snap.data().favorites
        }    
        else
            return []
    })
}

export function loginWithGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
        .then(snap=>snap.user)
}

export function updateDB(array, uid){
    return db.doc(uid).set({favorites:[...array]})
}

export function logoutGoogle(){
    firebase.auth().signOut();
}