/*
 * This file contains most of the functions we use throughout our application.
 * It does everything from displaying the main home page, to processing users'
 * login information, and much more. Read the high level description above each
 * function to get a gist of what it does.
 */


// reads the URL for the image that the user selected
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

// if the user isn't logged in, then reroute them to the login page
function initializePage() {
  if(!localStorage.getItem('curUser') && location.href.includes("index.html")){
    location.replace('login.html');
  }
}

//if the user logs in with the wrong username or password, alert them
function login() {
  const database = firebase.database();
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  const userRef = "users/" + user;
  database.ref(userRef).once("value", snapshot => {
    //checks to see if user already exists
    if(!snapshot.exists()){
      alert("That username does not exist!");
    }
    else{
      database.ref(userRef + "/password").once("value", snapshot => {
        if(pass != snapshot.val()){
          alert("Wrong password! Please try again.");
        }
        //password and username are correct here
        else{
          location.replace('/');
          localStorage.setItem('curUser', user);
        }
      });
    }
  });
}


// queries to yelp for the filter requested
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
              vendorDiv.appendChild(document.createElement("br"));
              vendorDiv.appendChild(document.createElement("br"));
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
              vendorDiv.setAttribute("style", "padding-top: 30px;");
              div.append(vendorDiv);
              div.append("<p> </p>");
            });
            
              
          }
        });
    
    });
}

//signs the user out
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

var list = document.getElementById('myUL');
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

//create the checklist for the user when they first go on the checklist page
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

// create a new checklist element
function newElement() {
      const user = localStorage.getItem('curUser');
    var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  const database = firebase.database();
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

//update the remaining cost on the budget page
function updateRemaining(){
  const database = firebase.database();
  const user = localStorage.getItem('curUser');
  const totalBudgetRef = 'users/' + user + '/totalBudget';
  var alreadySet = false; 
    var allBudgets;
    database.ref(totalBudgetRef).once('value', (snapshot) => {
        console.log("eat my butthole");
        totalBudget = snapshot.val();
        allBudgets = 'users/' + user + '/budget';

      }).then(() => {
        var remaining = parseInt(totalBudget);
        database.ref(allBudgets).on('value', (snapshot) => {
          console.log("ON UPDATE!!!!!");
          const data = snapshot.val();
          const length = (data == null) ? 0 : Object.keys(data).length;
          var i = 0;
          for(d in data){
            console.log("budgetTTTT:", d);
            const curBudget = allBudgets + '/' + d;
            console.log("cur budget ref", curBudget);
            database.ref(curBudget).once('value', (snapshot) => {
              const curBudget = snapshot.val();
              remaining = remaining - parseInt(curBudget.price);
              console.log("i: ", i, "length: ", length);
              if(i == length - 1 && !alreadySet){
                console.log("REMAINING cuz i == length-1:", remaining);
                const existingRemain = document.getElementById("remain");
                if(existingRemain != null){
                  existingRemain.innerHTML = "";
                }
                const remainElem = document.createElement('h2');
                var remainText = document.createTextNode("Remaining Budget: " + remaining);
                if(remaining <= 0){
                  remainElem.setAttribute("style", "color: red;");
                }
                else{
                  remainElem.setAttribute("style", "color: green;");
                }
                remainElem.appendChild(remainText);
                existingRemain.append(remainElem);
                alreadySet = true;
              }
              i++;
            });
          }
        });
      });
}

//creates a new budget element 
function newBudgetElement() {
  var li = document.createElement("li");
  var vendorI = document.getElementById("vendorInput").value;
  var priceI = document.getElementById("priceInput").value;
  const database = firebase.database();
  const user = localStorage.getItem('curUser');
  const totalBudgetRef = 'users/' + user + '/totalBudget';
  const userBudget = 'users/' + user + '/budget';
  console.log(userBudget);
  database.ref(userBudget).once('value', (snapshot) => {
    const data = snapshot.val();
    console.log("budget: ", data);
    var numOfBudget = (data) ? Object.keys(data).length : 0;
    console.log("number of budgets",numOfBudget);
    const curBudget = userBudget + '/budget' + numOfBudget;
    database.ref(curBudget).update({vendor: vendorI, 
                                    price: priceI});
  });

  var t = document.createTextNode(vendorI + " : " + priceI);
  li.appendChild(t);
  document.getElementById("vendorInput").value = "";
  document.getElementById("priceInput").value = "";

  document.getElementById("budgetUL").appendChild(li);
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
    
    // update remaining budget right here
    updateRemaining();

}

//intiialize budget list
function createBudget() {
  const database = firebase.database();
  var list = document.getElementById("budgetUL");
  const user = localStorage.getItem('curUser');
  const userBudget = 'users/' + user + '/budget';
  console.log(userBudget);
  database.ref(userBudget).once('value', (snapshot) => {
    const data = snapshot.val();
    for (d in data){
      console.log("budget: ", d);
      const curBudgetRef = userBudget + '/' + d;
      console.log(curBudgetRef);
      database.ref(curBudgetRef).once('value', (snapshot) => {
        const curItem = snapshot.val();
        console.log(curItem);
        var t = document.createTextNode(curItem.vendor + " : " + curItem.price);
        var li = document.createElement("li");
        list.appendChild(li);
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");

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
            database.ref(userBudget).once('value', (snapshot) => {
              const data = snapshot.val();
              for (d in data){
              const curBudgetRef = userBudget + '/' + d;
              console.log(curBudgetRef);
              database.ref(curBudgetRef).once('value', (snapshot) => {
                  const curItem = snapshot.val();
                  console.log(curItem);
                  if(text.includes(curItem.vendor)){
                    console.log("WE FOUND THE DATABASE PART");
                    //also update the remaining budget
                    snapshot.ref.remove();
                    updateRemaining();
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
