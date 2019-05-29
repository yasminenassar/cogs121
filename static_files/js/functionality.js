/*$(document).ready(function() {
    initializePage();
      console.log("ARE U READY");
      const curUser = localStorage.getItem('curUser');
  console.log(curUser);

  const reqURL = 'users/' + curUser; 
  console.log("requesting from", reqURL);

  $.ajax({
    url: reqURL,
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      console.log('got some data ', data);
      if(data.bride){
         const coupleName = data.bride + ' & ' + data.groom;
         const dateVenue = data.date + ' - ' + data.venue;
         console.log(coupleName);
         console.log(dateVenue);
         // lol countdown??? 
         const image = data.img;
         console.log(image);
         $('#names').html(coupleName);
         $('#dateVenue').html(dateVenue);
         $('#couple').attr('src', image).attr('width', '300px');
      }
      else{
        console.log("boi this better not print");
         $('#couple').attr('src', '');
         $('#names').html("No couple found - log in!");
         $('#dateVenue').html('');

        // inputted user that doesn't exist??
      }
    }

    });
})*/

function readURL() {
  const database = firebase.database();
  var fileupload = $("#FileUpload1");
  var filePath = $("#spnFilePath");
  var button = $("#btnFileUpload");
    fileupload.click();
    fileupload.change(function () {
      var file = document.getElementById('FileUpload1').files[0];
      // some stuff that doesn't work
      //imgData = getBase64Image(file);
      //localStorage.setItem("imgData", imgData);
      console.log(file);
      if (file) {
        // create reader
        var reader = new FileReader();
        reader.onload = function(e) {
          // storing e.target.result, whatever that is
          localStorage.setItem("image",e.target.result);
          const user = localStorage.getItem('curUser');
          const userRef = 'users/' + user;
          database.ref(userRef).update({img: e.target.result});
          // browser completed reading file - display it
          $('#testImage')
              .attr('src', e.target.result)
              .width(75)
              .height(100);
          $('#testImage').show();
        };
        reader.readAsDataURL(file);
      }
      // this displays the file name
      var fileName = $(this).val().split('\\')[$(this).val().split('\\').length - 1];
      filePath.html("<b>Selected File: </b>" + fileName);
    });
}

function initializePage() {
  if(!localStorage.getItem('curUser') && location.href.includes("index.html")){
    location.replace('login.html');
  }
}
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
 // location.replace("https://api.instagram.com/oauth/authorize/?client_id=d24f6b6b5992431fb90108cb528c5533&redirect_uri=http://localhost:3000&response_type=code");
  //console.log(curUser);
  location.replace('/');
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

  const database = firebase.database();
    const reqURL = 'users/' + curUser + '/venue'; 
    console.log("requesting from", reqURL);

    var hashtag =""; 
    database.ref(reqURL).once('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data); 
      const venue = data;
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
              rateImg.setAttribute("class", "rating");
              var a = document.createElement('a');
              var linkText = document.createTextNode(name);
              a.appendChild(linkText);
              //a.title = "my title text";
              a.href = url;
              img.src = image;
              img.className = 'vendor_img';
              var vendorDiv = document.createElement('div');
              var emptyP = document.createElement('p');
              //vendorDiv.className = 'vendor';
              vendorDiv.append(a);
              var priceP = document.createElement('p');
              var node;
              if(price){
                node = document.createTextNode(price);
                priceP.appendChild(node);
              }

              vendorDiv.append(emptyP);
              vendorDiv.append(rateImg);
              vendorDiv.append(emptyP);
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

function signOut() {
  localStorage.removeItem('curUser');
}



var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) 
{
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
    var text = (String) (ev.target["innerText"]);
    text = text.substring(0, text.length-2);
    console.log("text:", text);
    const userChecks = 'users/' + localStorage.getItem('curUser') + '/checklist';

    const database = firebase.database();
    database.ref(userChecks).once('value', (snapshot) => {
        const data = snapshot.val();
        for (d in data){
        const curTaskRef = userChecks + '/' + d;
        console.log(curTaskRef);
        database.ref(curTaskRef).once('value', (snapshot) => {
            const curItem = snapshot.val();
            console.log("curItem.task",curItem.task);
            if(text == curItem.task){
            //if(text.includes(curItem.task)){
              console.log("WE FOUND THE DATABASE PART");
              if(snapshot.val().checked == 'yes'){
                snapshot.ref.update({checked: "no"});
              }
              else{
                snapshot.ref.update({checked: "yes"});
              }
              //snapshot.ref.remove();
            }
        });

        }
        });
  }
}, false);

function createChecklist() {
  const database = firebase.database();
  var list = document.getElementById("myUL");
  const user = localStorage.getItem('curUser');
  const userChecks = 'users/' + user + '/checklist';
  console.log(userChecks);
  database.ref(userChecks).once('value', (snapshot) => {
    const data = snapshot.val();
    for (d in data){
      console.log("checklist task: ", d);
      const curTaskRef = userChecks + '/' + d;
      console.log(curTaskRef);
      database.ref(curTaskRef).once('value', (snapshot) => {
        const curItem = snapshot.val();
        console.log(curItem);
        var t = document.createTextNode(curItem.task);
        var li = document.createElement("li");
        list.appendChild(li);
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        // if it's checked, we should toggle it
        if(curItem.checked == 'yes'){
          li.classList.toggle('checked');  
        }

        li.appendChild(t);
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
        for (i = 0; i < close.length; i++) {
          close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
            var text = div["innerText"];
            text = text.substring(0, text.length-1);
            console.log("text:", text);
            database.ref(userChecks).once('value', (snapshot) => {
              const data = snapshot.val();
              for (d in data){
              const curTaskRef = userChecks + '/' + d;
              console.log(curTaskRef);
              database.ref(curTaskRef).once('value', (snapshot) => {
                  const curItem = snapshot.val();
                  console.log(curItem);
                  if(curItem.task == text){
                    console.log("WE FOUND THE DATABASE PART");
                    snapshot.ref.remove();
                  }
              });

              }
            });
          }
        }
      });

    }

  });

}

function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  const database = firebase.database();
  const user = localStorage.getItem('curUser');
  const userChecks = 'users/' + user + '/checklist';
  console.log(userChecks);
  database.ref(userChecks).once('value', (snapshot) => {
    const data = snapshot.val();
    console.log("checklist: ", data);
    var numOfTasks = (data) ? Object.keys(data).length : 0;
    console.log("number of tasks",numOfTasks);
    const curCheck = userChecks + '/check' + numOfTasks;
    database.ref(curCheck).update({task: inputValue, 
                                     checked: "no"});
  });

  console.log("jerllyfish");
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

   var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}


