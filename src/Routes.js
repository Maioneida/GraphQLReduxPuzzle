import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import Home from './components/home/HomePage'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'

function RoutesRestringer({ loggedIn, path, component, ...rest}){

            //LocalStorage Method
    /*let storage = localStorage.getItem('storage');
    storage = JSON.parse(storage)
    if(storage && storage.user){
        return <Route path={path} component={component} {...rest} />
    }
    else{
        return <Redirect to="/login" {...rest} />
    }*/

            //Redux-Connect Method
    if(loggedIn.loggedIn){
        return <Route path={path} component={component} {...rest} />
    }
    else{
        return <Redirect to="/login" {...rest} />
    }
}

function Routes(loggedIn) {
    return (
        <Switch>
            <RoutesRestringer exact path="/" component={Home} loggedIn={loggedIn} />
            <RoutesRestringer path="/favs" component={FavPage} loggedIn={loggedIn} />
            <Route path="/login" component={LoginPage} />
        </Switch>
    )
}

function mapStateToProps({user:{loggedIn}}){
    return {loggedIn};
}

export default connect (mapStateToProps)(Routes);