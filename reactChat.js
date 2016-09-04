var email, displayName, user, users;

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (currentUser) {
        if (currentUser) {
            this.setState({ userName: currentUser.displayName });
            console.log(currentUser)
            user = currentUser;
            displayName = currentUser.displayName;
            email = currentUser.email;
        } else {
            window.location.replace("login.html");
        }
    });
});

var ChatView = React.createClass({
    componentWillMount: function () {
        var me = this;
      //  var currentUser = '';
        var currentReciever = this.state.currentReciever;
        firebase.auth().onAuthStateChanged(function (currentUser) {
            if (currentUser) {
                console.log('jepp?')
                // me.setState({ displayName: currentUser.displayName });
                // me.setState({ email: currentUser.email });
                // me.setState({ uid: currentUser.uid });
                currentUser = currentUser;
                me.setState({ currentUser: currentUser })
            }

            firebase.database().ref('users/' + currentUser.uid).child('chats').on('value', function (dataSnapshot) {
                var chatsObject = dataSnapshot.val();
                var chatsArray = [];
                for (var key in chatsObject) {
                    if (chatsObject.hasOwnProperty(key)) {
                        firebase.database().ref('chats/' + chatsObject[key]).on('value', function (chat) {
                            chatsArray.push(chat);
                        })
                    }
                }
                console.log('chats: ', chatsArray);
                me.setState({ chats: chatsArray });
            });
        });
        firebase.database().ref('users').on('value', function (dataSnapshot) {
            var usersObject = dataSnapshot.val();
            var usersArray = [];
            for (var key in usersObject) {
                if (usersObject.hasOwnProperty(key)) {
                    usersObject[key].uid = key;
                    usersArray.push(usersObject[key]);
                }
            }
            me.setState({ users: usersArray });

            
        });



        // firebase.database().ref('chats').orderByChild('participants/' + currentUser.uid).on('value', function (dataSnapshot) {
        //     console.log(dataSnapshot);
        // });

        //if(currentReciever){
        // firebase.database().ref('chats').on('value', function (dataSnapshot) {
        //     var chatsObject = dataSnapshot.val();
        //     var chatsArray = [];
        //     var participantsObject = chatsArray.participants;
        //     var participantsArray = []
        //     for (var key in chatsObject) {
        //         if (chatsObject.hasOwnProperty(key)) {
        //             chatsObject[key].uid = key;
        //             for (var key2 in participantsObject) {
        //                 if (participantsObject.hasOwnProperty(key2)) {
        //                     participantsArray.push(participantsObject[key2]);
        //                 }
        //             }
        //             chatsObject[key].participants = participantsArray;
        //             chatsArray.push(chatsObject[key]);
        //         }
        //     }

        //     console.log(chatsArray);



        // var selectedChat;
        // chatsArray.forEach(function () {
        //     if($().inArray(currentUser.uid, participants)){

        //     }
        // })
        // me.setState({ users: chatsArray });
        // });
        //    }
    },

    setCurrentReciever: function (user) {
        console.log('You can now chat with ' + user.displayName);
        this.setState({ currentReciever: user });
    },

    getInitialState: function () {
        return { currentUser: { displayName: '', email: '', uid: '' }, email: '', users: [], currentReciever: null };  //{ currentUser: { displayName: 'Pernille', email: 'aøoldkgf@alksdf.com' } };
    },

    render: function () {
        return <div className="whoptidoo">
            <UserInfo currentUser={this.state.currentUser} /> {/*userName={this.state.currentUser.displayName} email={this.state.currentUser.email} uid={this.state.currentUser.uid} /> */}
            <UserList users={this.state.users} setCurrentReciever={this.setCurrentReciever}/>
            <Chat currentReciever={this.state.currentReciever} currentUser={this.state.currentUser}/>
        </div>;
    }
})

var Hello = React.createClass({
    render: function () {
        return <div>Hello {this.props.name}</div>;
    }
});

var Chat = React.createClass({
    render: function () {
        return <section className="chat">
            <MessageInput currentReciever={this.props.currentReciever} currentUser={this.props.currentUser} />
        </section>;
    }
});

//    <MessageField messages={this.props.messages} />
var MessageField = React.createClass({
    render: function () {
        return
    }
});

var Message = React.createClass({
    render: function () {
        return
    }
});

var MessageInput = React.createClass({
    sendMessage: function () {
        var fromId = this.props.currentUser.uid;
        var toId = this.props.currentReciever.uid;
        var message = this.state.message;
        var chat = this.state.chat;

        var participants = {};
        participants[fromId] = true;
        participants[toId] = true;

        var chatObject = {};

        console.log('from: ', fromId, ', to: ', toId, ', message: ', message);
        console.log('currentReciever: ', this.props.currentReciever);
        // firebase.database().ref().child('messages').push({ sender: fromId, message: message }).then(function (message) {
        //     firebase.database().ref().child('chats').push({ message: message.key, participants: participants }).then(function (chat) {
        //         chatObject[chat.key] = true;
        //         firebase.database().ref().child('users/' + fromId).child('chats').update(chatObject);
        //         firebase.database().ref().child('users/' + toId).child('chats').update(chatObject);
        //     });

        // });

        firebase.database().ref('chats').push({ participants: participants, messages: { sender: fromId, message: message } }).then(function (chat) {
            chatObject[chat.key] = true;
            firebase.database().ref().child('users/' + fromId).child('chats').update(chatObject);
            firebase.database().ref().child('users/' + toId).child('chats').update(chatObject);
        });
    },

    getInitialState: function () {
        return { value: 'Hello!' };
    },

    handleMessageChanged: function (event) {
        this.setState({ message: event.target.value });
    },

    render: function () {
        return <div>
            <textarea onChange={this.handleMessageChanged}></textarea>
            <button onClick={this.sendMessage}>Send</button>
        </div>
    }
});

var UserInfo = React.createClass({
    render: function () {
        return <section className="user-info">
            <span> {this.props.currentUser.userName} </span>
            <span> {this.props.currentUser.email} </span>
            <SignOut uid={this.props.currentUser.uid}/>
        </section>;
    }
});

var SignOut = React.createClass({
    signOut: function () {
        firebase.database().ref().child("users/" + this.props.uid).child('online').set(false);
        firebase.auth().signOut();
    },

    render: function () {
        return <button onClick={this.signOut}> Sign out </button>;
    }
});

var UserList = React.createClass({

    render: function () {
        var userItems = [];
        var callback = this.props.setCurrentReciever;
        return <ul>
            {this.props.users.map(function (user) {
                return <UserListItem key={user.uid} setCurrentReciever={callback} user={user}/>;
            }) }
        </ul>
    }
});

var UserListItem = React.createClass({
    doSomethingAwesome: function () {
        console.log('lets chat!', this.props.user);
    },

    render: function () {
        var online = this.props.user.online ? '*' : '';
        var user = this.props.user;
        return <li onClick={this.props.setCurrentReciever.bind(null, user) } >{this.props.user.displayName} {online}</li>
    }
});

ReactDOM.render(
    <ChatView />,
    $('#content')[0]
);