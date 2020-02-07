import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'
import Cookies from 'universal-cookie'


import 'react-table/react-table.css'

const cookies = new Cookies()
const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Add = styled.div`
    color: #33aa33;
    cursor: pointer;
`
/*const Room = styled.div`
    padding: 0 40px 40px 40px;
    cursor: pointer;
`
*/

/*
class DeleteUser extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Opravdu chcete odstranit tohoto uživatele ${this.props.id}?`,
            )
        ) {
            api.deleteUserById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Odstranit</Delete>
    }
}
*/

var mail1 = ""
function LoggedIn() {
    if (cookies.get('tokenlogin')) {
        mail1 = cookies.get('tokenlogin')
    }
    else {
        window.location.href = '/login'
    }
}

class AddUser extends Component {
    addUser = event => {
        event.preventDefault()

        if (window.confirm(`Opravdu chcete pøidat tohoto uživatele ${this.props.id}?`))
        {
            const mail2 = this.props.id
            const payload = { mail1, mail2 }
            api.createRoom(payload)
            window.location.reload()
        }
    }
    
    render() {
        return <Add onClick={this.addUser}>Pøidat</Add>
    }
}

class UsersList extends Component {
    constructor(props) {
        LoggedIn()
        super(props)
        this.state = {
            users: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllUsers(mail1).then(users => {
            this.setState({
                users: users.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { users, isLoading } = this.state
        console.log('TCL: UsersList -> render -> users', users)

        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Email',
                accessor: 'mail',
                filterable: true,
            },
            {
                Header: 'Pøidat',
                accessor: '',
                Cell: function (props) {
                    return (
                        <span>
                            <AddUser id={props.original.mail} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!users.length) {
            //showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={users}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
                
            </Wrapper>
        )
    }
}

export default UsersList