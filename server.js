const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {cors: {
        origin: 'http://localhost:3000'
    }
})



const users = []


io.on('connection', socket => {
    console.log('user is connected')

    socket.on('signin', data => {
        //console.log(data)

        let notExisted = false
        users.forEach(user => {
            if(user.username == data.username){
                user.sid = socket.id
                notExisted = true
            }
        })
        if(!notExisted){
            users.push({username: data.username, sid: socket.id})
        }
        //users.push({username: data.username, sid: socket.id})

        // send all connected users
        const ready = users.filter(user => user.username !== data.username)
        socket.emit('getUsers', ready)
        console.log(users)
    })


    socket.on('private', (data) => {
        console.log('private room')
        users.forEach(user => {
            if(data.to === user.username){
                io.to(user.sid).emit('privateMsg', data)
            } else {
                console.log('user not connected')
            }
        });
    })




    socket.on('signout', (username) => {
        const newArr = users.filter(user => user.username !== username)
        console.log('user logged out')
        console.log(users)
        console.log(newArr)
        //users = newArr
        console.log(users)
    })
  /*  socket.on('msg', (msg) => {
        const packet = {
            me: false,
            name: msg.name,
            msg: msg.msg
        }
        socket.broadcast.emit('newMsg', packet)
    })*/
})

httpServer.listen(5000, () => console.log('server is listening on port 5000'))
