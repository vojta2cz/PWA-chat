import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

function LoggedIn() {
    var isLoggedIn = false;
    if (cookies.get('tokenlogin')) {
        return <UserLogged />;
    }
    return <UserNotLogged />;
}

function UserLogged() {
    return <React.Fragment><Item>
            <Link to="/list" className="nav-link">
            Najít uživatele </Link>
        </Item>       
        <Item>
            <Link className="nav-link" to=""><span onClick={triggerRoom}>Odhlásit</span></Link>
        </Item>
        </React.Fragment>
}

function UserNotLogged() {
    return <React.Fragment><Item><Link to="/login" className="nav-link"><span onClick={triggerRoomLog}>Přihlásit</span></Link></Item>
        <Item>
            <Link to="/create" className="nav-link">
                Vytvořit uživatele</Link>
        </Item>
    </React.Fragment>
}

function triggerRoom() {
    cookies.remove('tokenlogin')
    window.location.href = `/login`
}
function triggerRoomLog() {
    window.location.href = `/login`
}

class Links extends Component {

    render() {
        return (
            <React.Fragment>
                <Link to="/chat" className="navbar-brand">
                    Chat
                </Link>
                <Collapse>
                    <List>
                        <LoggedIn/>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links