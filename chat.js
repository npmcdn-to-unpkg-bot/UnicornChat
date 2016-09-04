var email, displayName, user, users;

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (currentUser) {
        if (currentUser) {
            console.log(currentUser)
            user = currentUser;
            displayName = currentUser.displayName;
            email = currentUser.email;
        } else {
            window.location.replace("login.html");
        }

        $('#user-name').text(displayName);
        $('#email-address').text(email);
    });

    firebase.database().ref('users').on('value', function (dataSnapshot) {
        users = dataSnapshot.val();
        // console.log('users: ', users, ', snapshot: ', dataSnapshot);
        // dataSnapshot.forEach(function (user) {
        //     console.log('child: ', user, user.displayName);
        //     $('.user-list').append('<li>' + user.displayName + '</li>');
        // });
        console.log(users);
        $('.users-list').empty();
        var i = 1;
        for (var key in users) {
            if (users.hasOwnProperty(key)) {
                console.log(users[key].displayName);
                var onlineSign = users[key].online ? '*' : '';
                $('.users-list').append('<li>' + users[key].displayName + onlineSign + '</li>');
                var li = $('.users-list li:nth-child(' + i + ')');
                console.log(li);
                li.on('click', function () {
                    console.log('whoptidoo', users[key].displayName);
                });
                i++;
            }
        }
    });
});

function signOut() {
    firebase.database().ref().child("users/" + user.uid).child('online').set(false);
    firebase.auth().signOut();
}

function whoptidoo(user) {
}