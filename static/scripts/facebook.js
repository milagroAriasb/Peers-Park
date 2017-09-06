window.fbAsyncInit = function() {
    FB.init({
      appId      : '141998163057569',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();   
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     // connect.facebook.net/en_US/sdk.js from facebook documentation does not work
     js.src = "https://connect.facebook.net/en_US/sdk.js"; 
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   function checkLoginState(){
    FB.getLoginStatus(function(response) {
        console.log(response);
        userID = response.authResponse.userID;
        get_user_info(userID);
    }); 
  }


  function fb_login(){
      FB.login(function(response) {
          if (response.authResponse) {
              console.log('Welcome!  Fetching your information.... ');
              console.log(response); // dump complete info
              console.log('Status =  '+ response.status); // dump complete info
              var accessToken =   FB.getAuthResponse()['accessToken'];
              console.log('Access Token = '+ accessToken);
              var userID = FB.getAuthResponse()['userID']; //get FB UID
              console.log("userID: "+ userID);
              //refer to getData() function below
              getData(accessToken);
          } else {
              //user hit cancel button
              console.log('User cancelled login or did not fully authorize.');
          }
      }, {'scope': 'public_profile,email,user_friends,user_likes,user_location'});
  }


  // get user data from FB
  function getData(accessToken) {
    FB.api('/me', 'get', { access_token: accessToken, fields: 'id,name,gender,email,location,friends,likes,picture' }, function(response) {

      // Get user data from Fb and save it into variables 
      var name = response.name;
      var email = response.email;
      var location = response.location.name;
      // convert it into a dictionary like object to send to server.py
      var data = {
              "name": name,
              "email": email,
              "location": location
      };

      // console.log(data);
      $.post("/add_user", data, redirect_to_add_child);


      function redirect_to_add_child(result) {
          window.location.replace ('/');
         
      }

  });
    //check if the loginStatus works
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      // the user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid access token, a signed
      // request, and the time the access token 
      // and signed request each expire

      //redirect to start/location.ejs
      //window.location = "start/location";

    } else if (response.status === 'not_authorized') {
      // the user is logged in to Facebook, 
      // but has not authenticated your app
    } else {
      // the user isn't logged in to Facebook.
    }
  });
  }