const users = {};

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  socket.on('signin', (data) => {
    users[data.username] = data.socketId;
    socket.emit('isOnline', { userId: data.userId, online: true });
  });

  console.log(`USERS: ${JSON.stringify(users)}`);

  // socket.on('join', (data) => {
  //   console.log(`JOIN: ${JSON.stringify(data)}`);
  //   socket.join(data.id);
  // });

  socket.on('private', (msg) => {
    console.log(`users[msg.toUser] ${users[msg.toUser]} === msg.socketId ${msg.socketId}`);
    if (users[msg.toUser] === msg.socketId) {
      console.log(msg);
      io.to(msg.socketId).emit('chat', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function Chat({ users }) {
    const [activeUser, setActiveUser] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const jwt = isAuthenticated().user;
        setCurrentUser(jwt);
        config.socket;
        config.socket.on('isOnline', (data) => {
            console.log(data);
        });
    }, []);

    useEffect(() => {
        const list = users.filter(user => currentUser ? user._id !== currentUser._id : user._id);
        setFilteredList(list);
    }, [currentUser]);

    useEffect(() => {
        config.socket.on('chat', (data) => {
            setChats([...chats, data]);
        });
    }, []);

    const changeActiveUser = (e, user) => {
        e.preventDefault();
        console.log(`changeActiveUser ${JSON.stringify(user)}`);
        setActiveUser(user);
    };

    const handleClick = e => {
        e.preventDefault();
        const msg = {
            socketId: activeUser.socketId,
            to: activeUser._id,
            toUser: activeUser.username,
            message: message,
            from: currentUser._id
        }
        // config.socket.emit('join', {id: activeUser.socketId, username: activeUser.username})
        console.log(`Private MSG ${JSON.stringify(msg)}`);
        config.socket.emit('private', msg);
        setMessage('');
    }


    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col-3 leftSide'>
                        {filteredList.map((user) => (
                            <li key={user._id} className={`list ${user._id === activeUser._id ? 'active' : ''}`} onClick={e => changeActiveUser(e, user)}>
                                <img className='userImg' src={user.gender === 'Female' ? '/female.jpg' : '/male.jpg'} /> {user.name} <small>&nbsp;({user.username})&nbsp;<span>{user.online ? 'online' : 'offline'}</span></small>
                            </li>
                        ))}
                    </div>
                    <div className='col-9 rightSide'>
                        <div className='row'>
                            <div className='col rightTop'>
                                <h1>{activeUser.username ? `${activeUser.username} (${activeUser._id})` : 'Start a chat!'}</h1>
                                <ul>
                                    {chats && chats.map((chat, i) => (
                                        <li key={i}>
                                            <span>{activeUser._id === chat.from ? <span style={{ float: 'left' }}>{`${activeUser.username}: ${chat.message}`}</span> : <span style={{ float: 'right' }}>{`Me: ${chat.message}`}</span>}</span>
                                            {/* <div>{activeUser._id === chat.to ? <div style={{ float: 'right' }}>{`Me: ${chat.message}`}</div> : ''}</div> */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <hr />
                        {activeUser && (
                            <div className='row rightBottomContainer'>
                                <div className='rightBottomInput'>
                                    <input value={message} type='text' onChange={(e) => setMessage(e.target.value)} placeholder=' Enter your chat...' />
                                </div>
                                <div className='rightBottomButton'>
                                    <button onClick={(e) => handleClick(e)} type='submit'>Send</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}