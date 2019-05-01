
function login() {
  var user = document.getElementById("user").value;
  var pass = document.getElementById("pass").value;
  location.replace("index.html");
}

function createAccount() {
  console.log("creating an account");
  //var user = document.getElementById("user").value;
  //var pass = document.getElementById("pass").value;
  location.replace("profile.html");
}

function initializePhoto(){
}

function myFunction() {
  var, input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');

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


