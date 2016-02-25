$('#login-form').submit(function (event) {
    var username = $('#username').val(),
        password = $('#password').val();
    var user = new Kinvey.User();
    var promise = user.login(username, password);
    promise.then(function (user) {
        showHideLogin(false);

        $('#login-form').each(function () {
            this.reset();
        });
    }).catch(function (err) {
        console.log("login failed " + JSON.stringify(err));
        alert("Error: " + err.description);
    });
    event.preventDefault();
});

$('#logout-btn').click(function () {
    Kinvey.User.getActiveUser().then(function (user) {
        user.logout().then(function () {
            showHideLogin(true);
        }).catch(function (err) {
            console.log("logout failed " + JSON.stringify(err));
        });
    });
});

$('#mic-login-btn').click(function () {
    //TODO fix callbackURL
    var user = new Kinvey.User();
    var promise = user.loginWithMIC('https://console.kinvey.com');
    promise.then(function (user) {
        console.log("user " + JSON.stringify(user));
        showHideLogin(false);
    }).catch(function (err) {
        console.log("login failed " + JSON.stringify(err));
    });
});


function showHideLogin(show) {
    if (show) {
        $('#login-view').show();
        $('#logout-view').hide();
    } else {
        $('#login-view').hide();
        $('#logout-view').show();
    }
}