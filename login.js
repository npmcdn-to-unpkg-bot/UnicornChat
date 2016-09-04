$(document).ready(function () {
    if (firebase.auth().currentUser) {
        window.location.replace("chat.html");
    }
});

function login() {
    var email = $('#email').val();
    var password = $('#password').val();

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    }).then(function (user) {
        firebase.database().ref().child("users/" + user.uid).child('online').set(true).then(function () {
            window.location.replace("chat.html");
        });
    });
}

function signUp() {
    var email = $('#email').val();
    var password = $('#password').val();
    var userName = $('#username').val();

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    }).then(function (user) {
        user.updateProfile({ displayName: userName }).then(function () {
            firebase.database().ref().child('users').child(user.uid).set({ displayName: userName, online: true }).then(function () {
                window.location.replace("chat.html");
            });
        });
    });
}

function resetPassword() {

    var email = $('#email').val();

    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('Password Reset Email Sent!');
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
    });
}