import React from 'react'
import Card from '../card/Card'
import styles from './home.module.css'
import {connect} from 'react-redux'
import { addFavoriteCharacterAction, removeCharactersAction } from '../../redux/charDuck'

function Home({chars, removeCharactersAction, addFavoriteCharacterAction}) {
    function renderCharacter() {
        let char = chars[0]
        return (
            <Card rightClick={addFavoriteCharacter} leftClick={nextCharacter} {...char} />
        )
    }

    function nextCharacter(){
        removeCharactersAction();
    }

    function addFavoriteCharacter(){
        addFavoriteCharacterAction();
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

function mapStateToProps(state){
    return{
        chars:state.characters.array
    }

}

export default connect(mapStateToProps, {removeCharactersAction, addFavoriteCharacterAction})(Home);