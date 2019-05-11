
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
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
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


