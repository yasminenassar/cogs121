const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const apiKey = 'grXAywzfZVFDEfkdmjZY5XtYdcI5EdV_FY8eCImCYPDB16BIIR3GJt55f7bTiqTXm3xFx1porLG7sQQHMRMt_yO_JoLk2oGprROCzBr0TOnotEW1WYTksKU4IaXYXHYx';
const client = yelp.client(apiKey);
const ig = require('instagram-node').instagram();
//const axios = require('axios');

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
//
// http://localhost:3000/petsapp.html
// http://localhost:3000/cat.jpg
//
// will send the file static_files/cat.jpg to the user's web browser
//
// Learn more: http://expressjs.com/en/starter/static-files.html
app.use(express.static('static_files'));



const redirectUri = 'http://localhost:3000/handleAuth';
var accessToken = "";
// simulates a database in memory, to make this example simple and
// self-contained (so that you don't need to set up a separate database).
// note that a real database will save its data to the hard drive so
// that they become persistent, but this fake database will be reset when
// this script restarts. however, as long as the script is running, this
// database can be modified at will.
const fakeDatabase = {
  'chelsea@a.com': {img: 'pics/couple1.jpeg', bride: "Chelsea", groom: "Brad",
                    venue: "San Francisco, CA", date: "October 12, 2019" },
  'angie@a.com': {img: 'pics/couple2.jpeg', bride: "Angie", groom: "Derek",
                    venue: "Chula Vista, CA", date: "August 16, 2019"}
};


// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html

app.get('/authorize', function(req, res){
    // set the scope of our application to be able to access likes and public content
    res.redirect(ig.get_authorization_url(redirectUri) );
});

app.get('/search/:term/:loc', (req, res) => {
  const term = req.params.term;
  const loc = req.params.loc;
  console.log("here is the term: ", term, "and loc: " , loc);
  const searchReq = {
    term: term,
    location: loc
  };

  client.search(searchReq).then(response => {
    console.log("response: " , response);
    const results = response.jsonBody.businesses;
    const prettyJson = JSON.stringify(results, null, 4);
    console.log(prettyJson);
    res.send(prettyJson);
  }).catch(e => {
      console.log(e);
    });
  
  /*const URL = 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?access_token=' + accessToken + "&scope=public_content";
  console.log("url: ", URL);
  axios.get(URL , {
    params: {
      access_token: accessToken
    }
  }).then(response => {
      console.log("response from insta" + response.data);
      //res.send(response);
  }).catch(error => {
    console.log("Error" + error);
  });*/

});

app.get('/handleAuth', function(req, res){
    console.log("are u in handleAuth");
    //retrieves the code that was passed along as a query to the '/handleAuth' route and uses this code to construct an access token
    ig.authorize_user(req.query.code, redirectUri, function(err, result){
        if(err) res.send( err );
    // store this access_token in a global variable called accessToken
        accessToken = result.access_token;
        //localStorage.setItem('accessToken', accessToken);
        console.log(accessToken);
        //res.render('static_files/search.html', {'accessToken': accessToken});
        res.redirect('/');
    });
})


// GET a list of all usernames
//
// To test, open this URL in your browser:
//   http://localhost:3000/users
app.get('/users', (req, res) => {
  const allUsernames = Object.keys(fakeDatabase); // returns a list of object keys
  console.log('allUsernames is:', allUsernames);
  res.send(allUsernames);
});


// GET profile data for a user
//
// To test, open these URLs in your browser:
//   http://localhost:3000/users/Philip
//   http://localhost:3000/users/Carol
//   http://localhost:3000/users/invalidusername
app.get('/users/:userid', (req, res) => {
  const nameToLookup = req.params.userid; // matches ':userid' above
  const val = fakeDatabase[nameToLookup];
  console.log(nameToLookup, '->', val); // for debugging
  if (val) {
    res.send(val);
  } else {
    res.send({}); // failed, so return an empty object instead of undefined
  }
});

/*app.get('/handleAuth', function(req, res){
  const 
  });
//const code = req.url.split('code=')[1];
app.post({form: {'client_id': 'd24f6b6b5992431fb90108cb528c5533',
                   'client_secret': '5a575e21b176441781299c65455a6a6a',
                   'grant_type' : 'authorization_code',
                   'redirect_uri' : 'https://localhost:3000',
                   'code' : code},
                   url: 'https://api.instagram.com/oauth/access_token'}, 
                function (err, res, body) {
                  if(err){
                    console.log("Error in Post: ", err);
                  }
                  else{
                    console.log(JSON.parse(body));
                  }

});*/

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
