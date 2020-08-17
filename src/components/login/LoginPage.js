import React from 'react'
import styles from './login.module.css'
import {connect} from 'react-redux'
import { doGoogleLoginAction, doLogoutAction } from '../../redux/userDuck'

function LoginPage( {loggedIn, fetching, doGoogleLoginAction, doLogoutAction}) {
    
    function doLogin(){
        doGoogleLoginAction();
    }

    function doLogout(){
        doLogoutAction();
    }
    
    if(fetching)
        return <h2>Cargando...</h2> 
    return (
        <div className={styles.container}>
            { loggedIn ?    <div>
                                <h1>
                                    Cierra tu sesión
                                </h1>
                                <button onClick={doLogout}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        :      <div>
                                    <h1>
                                        Inicia Sesión con Google
                                    </h1>
                                    <button onClick ={doLogin}>
                                        Iniciar Sesion
                                    </button>
                                </div>
            }
        </div>
    )
}

function mapStateToProps({user:{fetching, loggedIn}}){
    return{
        fetching,
        loggedIn
    }
}

export default connect(mapStateToProps, {doGoogleLoginAction, doLogoutAction})(LoginPage);