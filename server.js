/*
 * This file has all the server functionality, which allows us to make ajax
 * calls in our other files, which allows us to call to the Yelp APi to search
 * for makeup artists or photographers. 
 */
const express = require('express');
const app = express();
const yelp = require('yelp-fusion');
const apiKey = 'grXAywzfZVFDEfkdmjZY5XtYdcI5EdV_FY8eCImCYPDB16BIIR3GJt55f7bTiqTXm3xFx1porLG7sQQHMRMt_yO_JoLk2oGprROCzBr0TOnotEW1WYTksKU4IaXYXHYx';
const client = yelp.client(apiKey);
const ig = require('instagram-node').instagram();

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


// To learn more about server routing:
// Express - Hello world: http://expressjs.com/en/starter/hello-world.html
// Express - basic routing: http://expressjs.com/en/starter/basic-routing.html
// Express - routing: https://expressjs.com/en/guide/routing.html


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
  

});


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


// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
