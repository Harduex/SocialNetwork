document.write(`<div class="topnav" id="myTopnav">
<a href="/">Posts</a>
<a href="/add">Add Post</a>

<a class="right" id="target" href="/logout?_method=DELETE" >Log out</a>

<a href="javascript:void(0);" class="icon" onclick="mobileView()">
  <b class="mobile">☰</b>
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

