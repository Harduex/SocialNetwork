document.write(`<div class="topnav" id="myTopnav">
<a href="/">Posts</a>
<a href="/add">Add Post</a>
<a href="javascript:void(0);" class="icon" onclick="mobileView()">
  <b class="mobile">☰</b>
</a>
<a class="right" href="/login">Log In</a>
<a class="right" href="/register">Register</a>

<a class="right">
<form action="/logout?_method=DELETE" method="POST">
<button class="mobile" type="submit">Log out</button>
</form>

</a>

</div>`);

function mobileView() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}