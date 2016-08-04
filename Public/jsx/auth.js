function auth() {
    $.getJSON('/auth/checklogin', function(data) {
        data = JSON.parse(data);
        if(!data.auth) {
            $('#twitchLogin').show();
            $('#twitchLogin').click(function() {
            window.location.href = 'https://api.twitch.tv/kraken/oauth2/authorize'+
            '?response_type=code'+
            '&client_id=cunpu7mzq6sedmgw50ekiw7ga4u8npo'+
            '&redirect_uri=https://voting-app-dzheky.c9users.io/auth/user'+
            '&scope=user_read'+
            '&state=test';
            });
        } else {
            return true;
        }
    });
}

module.exports=auth;

