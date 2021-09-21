import React, { useState, useEffect } from 'react'
import '../App.css'
//import socketClient from 'socket.io-client'



//const socket = socketClient.connect('http://localhost:5000')

//let income

/*socket.on('newMsg', (msg) => {
    /*setData((data) => {
         return [...data, msg]
     })*/
     //console.log('on listen')
     //console.log(msg)
    // income = 'arrived'
//})*/






export default function Messages(props) {
    console.log('rendered...')
 
    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')
   

    const [data, setData] = useState([])

    const userHandler = (e) => setUsername(e.target.value)
    const msgHandler = (e) => setMessage(e.target.value)
    
    const socket = props.socket


    const [recipients, setRecipients] = useState([])
    const [receiver, setReceiver] = useState('')

    useEffect(()=> {
        socket.on('getUsers', users => {
            console.log(users)
            setRecipients(users)
         
        })
    })
    const others = () => {
        return recipients.map((recipient, index) => {
            return (
                <div style={{backgroundColor: 'white', cursor: 'pointer'}} key={index} onClick={() => {
                  
                    setReceiver(recipient.username)
                    console.log('you are chating with = ' + receiver)

                }}>{recipient.username}</div>
            )
        })
    }


    const sendMsg = (e) => {
        e.preventDefault()
  
        if (username == '' || message == '') {
            console.log('please fill in fields')
        } else {
            setData((data) => {
                return [...data, {
                    me: true,
                    name: username,
                    msg: message
                }]
            })
            socket.emit('private', {
                from: username,
                to: receiver,
                msg: message
            })
        }
    }

    /*socket.on('newMsg', (msg) => {
        /* setData((data) => {
             return [...data, msg]
         })
         console.log('on listen')
         //console.log(msg)
     }) */
   
    useEffect(() => {
        socket.on('privateMsg', packet => {
            console.log(packet)

            setData((data) => {
                return [...data, {
                    me: false,
                    name: packet.from,
                    msg: packet.msg
                }]
            })
        })
    }, [])

   


    useEffect(() => {
        console.log('onMount')
        console.log(data)
    }, [data])

    // console.log(props)
    
    const connectSocket = () => {
        socket.emit('signin', {username: username})
    }
    const logout = () => {
        socket.emit('signout', username)
    }
    return (

        <div className="wrapper">
            <div className="messages">
                    {data.map(chat => {
                        if (chat.me) {
                            return (
                                <div>
                                    <div id="user">{chat.name}</div>
                                    <div id="msg">{chat.msg}</div>
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <div id="other">{chat.name}</div>
                                    <div id="msg2">{chat.msg}</div>
                                </div>
                            )
                        }
                    })}
            </div>

            <div className="form">
                <form onSubmit={sendMsg}>
                    <input
                        id="inpt1"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={userHandler}
                    /><br/>
                    <input
                        id="inpt2"
                        type="text"
                        name="message"
                        placeholder="Enter message..."
                        value={message}
                        onChange={msgHandler}
                    />
                    <button id="btn" type="submit">Send</button>
                </form>
            </div>

            <button onClick={connectSocket}>Connect Socket</button>



            <button onClick={logout}>Log Out</button>

            <div style={{backgroundColor: 'red', width: '100px', height: '200px'}}>
                {others()}
            </div>
        </div>
    )
}






