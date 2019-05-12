
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
 // location.replace("https://api.instagram.com/oauth/authorize/?client_id=d24f6b6b5992431fb90108cb528c5533&redirect_uri=http://localhost:3000&response_type=code");
  //console.log(curUser);
  location.replace('/authorize');
  localStorage.setItem('curUser', user);
}

function createAccount() {
  console.log("creating an account");
  //var user = document.getElementById("user").value;
  //var pass = document.getElementById("pass").value;
  location.replace("profile.html");
}

function searchFunc() {
    console.log("IN HERERE");
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    localStorage.setItem("filter" , filter);
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        }
        else
        {
            li[i].style.display = "none";
        }
  }

}

function search(filter){
    const curUser = localStorage.getItem('curUser');
    console.log(curUser);

    const reqURL = 'users/' + curUser; 
    console.log("requesting from", reqURL);

    var hashtag =""; 
    var venue = "";

    console.log("WE  IS  HERERERERERE", filter);
    $.ajax({
    url: reqURL,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      console.log('got some data ', data);
      if(data.bride){
         //const coupleName = data.bride + ' & ' + data.groom;
         //const dateVenue = data.date + ' - ' + data.venue;
         venue = data.venue;
         venue = venue.replace(/\s/g, '');
         //venue = venue.trim();
         console.log("venue ", venue);
         hashtag = venue+filter;
         console.log("hashtag" , hashtag);
      }
      else{
        console.log("boi this better not print");

        // inputted user that doesn't exist??
      }
    }
    }).then(function () {
        console.log("in the then");
        $.ajax({
	        url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent',
	        dataType: 'jsonp',
	        type: 'GET',
	        data: {access_token: token, count: 5},
	        success: function(data){
		        console.log(data);
		        for(x in data.data){
			        $('myUL').append('<li><img src="'+data.data[x].images.standard_resolution.url+'"></li>');  
		        }
	        },
	        error: function(data){
		        console.log(data);
	        }
       });
    });
    
}



