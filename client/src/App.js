import React, {useState, useEffect} from 'react'
import './App.css'
import Messages from './components/Messages'

import socketClient from 'socket.io-client'
const socket = socketClient.connect('http://localhost/api')

/*
socket.on('newMsg', (msg) => {
   
    // console.log('on listen')
    console.log(msg)
})*/


function App() {
  /*  socket.on('newMsg', (msg) => {
   
        console.log('on listen')
        //console.log(msg)
    })*/
   

    return (
        <div className="container">
            <h1 id="title">My Message App</h1>
            <Messages socket={socket} />

           
           
        </div>
    )
}

export default App;
