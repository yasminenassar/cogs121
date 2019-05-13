
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
        const reqSearchURL = 'search/' + filter + '/' + venue ;
        $.ajax({
          url: reqSearchURL,
          type: 'GET',
          dataType: 'json',
          success: (data) => {
            var div = $('#searchResults');
            div.html("");
            console.log('got some data ', data);
            var i = 0;
            data.forEach(vendor => {
              const name = vendor.name;
              const image = vendor.image_url;
              const img = document.createElement("img");
              const url = vendor.url;
              const price = vendor.price;
              const rating = vendor.rating;
              const rateImg = document.createElement("img");
              rateImg.setAttribute("src", "ratings/" + rating + ".png");
              var a = document.createElement('a');
              var linkText = document.createTextNode(name);
              a.appendChild(linkText);
              //a.title = "my title text";
              a.href = url;
              img.src = image;
              img.className = 'vendor_img';
              var vendorDiv = document.createElement('div');
              vendorDiv.className = 'vendor';
              vendorDiv.append(a);
              var priceP = document.createElement('p');
              var node;
              if(price){
                node = document.createTextNode(price);
                priceP.appendChild(node);
              }

              vendorDiv.append(rateImg);
              vendorDiv.append(priceP);
              vendorDiv.append(img);
              console.log(vendorDiv);
              div.append(vendorDiv);
              div.append("<p> </p>");
            });
            
              
          }
        });
    });
    
}



