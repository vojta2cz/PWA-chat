import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import withAuth from '../pages/WithAuth'
import { UsersList, UsersInsert, UsersUpdate, UserFind, UsersChat, UserLogin } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/chat" exact component={UsersChat} />
                <Route path="/list" exact component={UsersList} />
                <Route path="/create" exact component={UsersInsert} />
                <Route
                    path="/update/:mail"
                    exact component={UsersUpdate}
                />
                <Route path="/login" component={UserLogin} />
                <Route path="/secret" component={withAuth} />
            </Switch>
        </Router>
    )
}

export default App