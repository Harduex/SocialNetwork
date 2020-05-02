document.write(`
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<div class="topnav" id="myTopnav">
<a href="/">Profile</a>
<a href="/add">Add Post</a>

<a class="right-only" id="target" href="/logout?_method=DELETE" >Log out</a>

<a class="right">
  <form action="/search" method="get">
  <input type="text" class="mobile input-div-search" placeholder=" type username.. " name="search">
  <button type="submit" class="mobile input-div-button"><i class="fa fa-search"></i></button>
  </form>   
</a>

<a href="javascript:void(0);" class="icon" onclick="mobileView()">
  <b class="mobile">☰</b>
</a>

</div>
`);

function mobileView() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
