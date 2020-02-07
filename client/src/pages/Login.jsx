import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

import 'react-table/react-table.css'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mail: '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        api.loginUser(this.state).then(res => {
            if (res.status === 200) {
                cookies.set('tokenlogin', this.state.mail, { path: '/' });
                //this.props.history.push('/chat');
                window.location.href = '/chat'
            }
            else if (res.status === 201)
            {
                window.alert(res.data.message)
            }
            else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Špatné jméno nebo heslo');
            });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login Below!</h1>
                <input
                    type="text"
                    name="mail"
                    placeholder="Enter email"
                    value={this.state.mail}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}