import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'
import Cookies from 'universal-cookie'

import { animateScroll } from "react-scroll"
import styled from 'styled-components'
//import '//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
//import '//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'
//import '//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js'

//import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css'

import '../style.css'
import 'react-table/react-table.css'
import { componentWillAppendToBody } from "react-append-to-body";
import { Redirect } from 'react-router-dom';

const cookies = new Cookies()
const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

const Select = styled.div`
    color: #33aa33;
    cursor: pointer;
`
/*const Room = styled.div`
    padding: 0 40px 40px 40px;
    cursor: pointer;
`
*/
var mail1 = ""
var ws
var URL = 'ws://localhost:3030'

var isLogged = false
function LoggedIn() {
    if (cookies.get('tokenlogin')) {
        mail1 = cookies.get('tokenlogin')
        isLogged = true
        URL = 'ws://localhost:3030/?name=' + mail1
        ws = new WebSocket(URL);
    }
    else {
        window.location.href = '/login'
    }
}

global.mailId = ''
//export default selectRoomButton


class DeleteRoom extends Component {
    deleteRoom = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Opravdu chcete odstranit tohoto uživatele: ${this.props.id} z přátel?`,
            )
        ) {
            const mail2 = this.props.id
            const payload = { mail1, mail2 }
            api.deleteRoom(payload)
            global.mailId = ''
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteRoom}>Odstranit</Delete>
    }
}


class NewMesssage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
        }
    }
    
    handleIncludeMessage() {
        //const arrayTime = time.split('/')
        const message = this.state.text
        const mail2 = global.mailId
        const payload = { mail1, mail2, message }
        updateLast(mail1, message)
        api.createMessage(payload).then(res => {
            this.setState({
                text: '',
            })
            ws.send(message + " " + mail2 + " " + mail1);            
        })
        
    }

    render() {
        return <Wrapper>
            
            <input
                type='text'
                className='write_msg'
                placeholder='Napiš zprávu'
                ref='myTextarea'
                value={this.state.text}
                onChange={(event) => {
                    this.setState({
                        text: event.target.value
                    });
                }}
            />
            <button className="msg_send_btn" type="button" onClick={this.handleIncludeMessage.bind(this)}>>></button>
        </Wrapper>
    }
}

global.msg = ''
global.first = true
class LastMessage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            author: '',
            message: '',
            aut: '',
            msg: '',
        }
        updateLast = updateLast.bind(this)
        global.msg = ''
    }
    
    componentDidMount() {
        this.scrollToBottom();
        
    }
    rerender() {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds
        var curretntTime = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec
        if (this.state.author == mail1) {
            this.state.aut = "outgoing_msg"
            this.state.msg = <div className="sent_msg">
                <p>{this.state.message}</p>
                <span className="time_date">{curretntTime}</span>
            </div>
        }
        else {
            this.state.aut = "incoming_msg"
            this.state.msg = <div className="received_msg">
                <div className="received_withd_msg">
                    <p>{this.state.message}</p>
                    <span className="time_date">{curretntTime}</span>
                </div>
            </div>
            
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "msg_history"
        });
    }   

    render()
    {
        console.log(global.first)
        if (global.first || (global.msg.length > 0 && !global.first)) {
            global.msg = ''
            global.first = false
        
            this.rerender()
            if (this.state.author.length > 0) {
                const str = <div className={this.state.aut} key={this.state.message}><div className="received_msg">{this.state.msg}</div></div>
                global.msg = [global.msg, str]
                return global.msg
                
            }
            else {
                global.msg = ''
                return ''
                
            }
        } 
        else {
            global.msg = ''
            return ''

        }
    }
}

function updateText(text) {
    global.msg = ''
    this.setState({ text })
}
function updateLast(author, message ) {
    this.setState({ author, message })
}



global.allMessages = []
class SelectRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            columns: [],
            isLoading: false,
        }
    }

    selectRoom = event => {
        event.preventDefault()
        global.msg = ''
        global.first = true
        const mail2 = this.props.id 
        const status = 0
        const payload = { mail1, mail2, status }
        global.mailId = this.props.id
        api.getAllMessages(payload).then(messages => {
             this.state = {
                 messages: messages.data,
                 isLoading: false,
            }
            
            global.allMessages = this.state.messages
            updateText([])
        })
        //console.log(global.mailId)
    }

    render() {
        return <Select onClick={this.selectRoom}>Napsat</Select>
    }
}
global.temp = []
function getAll() {
    let messages = []
    let author
    let msg
    if (global.allMessages[0]) {
        messages.push(<div id="chatName" className="chatName"><span>{global.mailId}</span></div>)
        for (var i = 0; i < global.allMessages.length; i++) {
        
            if (Object.values(global.allMessages[i])[0] == mail1) {
                author = "outgoing_msg"
                msg = <div className="sent_msg">
                    <p>{Object.values(global.allMessages[i])[1]}</p>
                    <span className="time_date">{Object.values(global.allMessages[i])[2]}</span>
                    </div>
            }
            else {
                author = "incoming_msg"
                msg = <div className="received_msg">
                    <div className="received_withd_msg">
                            <p>{Object.values(global.allMessages[i])[1]}</p>
                        <span className="time_date">{Object.values(global.allMessages[i])[2]}</span>
                        </div>
                    </div>
            }
            messages.push(
                <div className={author} key={i}>
                    <div className="received_msg">
                        {msg}
                    </div>
                </div>) 
        
        }
    }
    //messages = messages.concat(global.temp)
    //global.temp = messages
    return messages
}

class AllMessages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            time: Date.now()
        }
        updateText = updateText.bind(this)
  
    }
    componentDidMount() {
        //if (global.mailId.length > 0) {
            this.timer = this.interval = setInterval(() => {
                //
                this.getMes()
                this.setState({ messages: global.allMessages })
                global.msg = ''
                if (global.mailId.length > 0)
                    clearInterval(this.timer);
            }, 1000)

            ws.onmessage = evt => {
                // on receiving a message, add it to the list of messages
                const str = (evt.data).split(' ')
                global.msg = ''
                if (str[1] == global.mailId) {
                    const author = str[1]
                    const message = str[0]
                    updateLast(author, message)
                }
                //this.addMessage(message)
            }
       // }
    }


    async getMes() {
        const mail2 = global.mailId
        const status = 1
        const payload = { mail1, mail2, status }
        await api.getAllMessages(payload).then(messages => {
            this.state = {
                messages: messages.data,
            }

            global.allMessages = this.state.messages
            //console.log(global.allMessages)
        })
        
    }

     
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return getAll()
    }
}

class RoomList extends Component {
    constructor(props) {
        LoggedIn()
        super(props)
        this.state = {
            rooms: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllRooms(mail1).then(rooms => {
            this.setState({
                rooms: rooms.data,
                isLoading: false,
            })
        })
        //getAll()
        //global.mailId = ''
        updateText([])
    }

    render() {
        if (!isLogged)
            return <Redirect to="/login" />
        const { rooms, isLoading } = this.state
        //console.log('TCL: RoomList -> render -> rooms', rooms)

        let data = []
        for (var i = 0; i < rooms.length; i++) {

            data.push(
                
                <div className="chat_people" key={Object.values(rooms[i])[0]}>
                    <div key={Object.values(rooms[i])[1]} className="chat_img"><img id={Object.values(rooms[i])[0]} src={require("../img/profile.png")} alt="sunil" /></div>
                    <div key={Object.values(rooms[i])[2]} className="chat_ib">
                            <h5>{Object.values(rooms[i])[0]}</h5>
                            <SelectRoom id={Object.values(rooms[i])[0]}/>
                            <DeleteRoom id={Object.values(rooms[i])[0]}/>
                        </div>
                    </div>)

        }
        return (
            <div key="container" className="container">
                <div key="messaging" className="messaging">
                    <div key="inbox_msg" className="inbox_msg">
                        <div key="inbox_people" className="inbox_people">
                            <div key="inbox_chat" className="inbox_chat" key={i}>
                                    {data}
                                </div>
                        </div>
                        <div key="mesgs" className="mesgs">
                            <div key="msg_history" className="msg_history" id="msg_history">
                               
                                <AllMessages />
                                <LastMessage/>
                            </div>
                            <div key="type_msg" className="type_msg">
                                <div key="input_msg_write" className="input_msg_write">
                                    <NewMesssage>Odeslat</NewMesssage>
                                 </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RoomList