import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class UsersInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            mail : '',
            name: '',
            password: '',
            password_again: '',
        }
    }

    handleChangeInputMail = async event => {
        const mail = event.target.value
        this.setState({ mail })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputPassword = async event => {
        const password = event.target.value
        
            this.setState({ password })
        
    }

    handleChangeInputPasswordAgain = async event => {
        const password_again = event.target.value
        this.setState({ password_again })
    }

    handleIncludeUser = async () => {
        const { mail, name, password, password_again } = this.state
        //const arrayTime = time.split('/')
        if (password.length > 3) {
            if (password == password_again) {
                const payload = { mail, name, password }
                await api.insertUser(payload).then(res => {
                    if (res.status === 201)
                        window.alert(res.data.message)
                    else {
                        window.alert(`Uživatel ${mail} byl pøidán`)
                        window.location.href = `/list`
                        this.setState({
                            mail: '',
                            name: '',
                            password: '',
                        })
                    }
                })
            }
            else
                window.alert("Hesla se neshodují")
        }
        else {
            window.alert("Heslo musí mít alespoò 4 znaky");
        }  
    }

    render() {
        const { mail, name, password, password_again } = this.state
        return (
            <Wrapper>
                <Title>Pøidat uživatele</Title>

                <Label>E-mail: </Label>
                <InputText
                    type="text"
                    value={mail}
                    onChange={this.handleChangeInputMail}
                />

                <Label>Jméno: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Heslo: </Label>
                <InputText
                    type="password"
                    step="0.1"
                    lang="en-US"
                    min="3"
                    max="50"
                    value={password}
                    onChange={this.handleChangeInputPassword}
                />

                <Label>Heslo znovu: </Label>
                <InputText
                    type="password"
                    value={password_again}
                    onChange={this.handleChangeInputPasswordAgain}
                />

                <Button onClick={this.handleIncludeUser}>Pøidat uživatele</Button>
                <CancelButton href={'/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default UsersInsert