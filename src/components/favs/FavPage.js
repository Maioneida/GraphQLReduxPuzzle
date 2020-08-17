import React from 'react'
import styles from './favs.module.css'
import Card from '../card/Card'
import {connect} from 'react-redux'

function FavPage({ characters = [0] }) {
    function renderCharacter(char, i) {
        return (
            <Card {...char} key={i} hideButtons />
        )
    }
    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {characters.map(renderCharacter)}
            {!characters.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

function mapStateToProps({characters}){
    //si el fetching es true hay error en localStorage, por lo que siempre q el fetching sea true se muestra por reduxe
    //pero si el fetching es false y los favs de reduxe estan vacios muestra por localStorage
    if(characters.fetching || characters.favorites.length){
        return {
            characters:characters.favorites
       }}
    else{
        return {characters: JSON.parse(localStorage.favsChars)}
    }
}

export default connect(mapStateToProps)(FavPage)