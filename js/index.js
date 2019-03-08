
function updateImage() {
  var text = document.getElementById("user-text");
  var url = "drawing.svg?text=" + encodeURIComponent(text.value);
  var embed = document.getElementById("embed");
  embed.data = embed.src = url;
  var link = document.getElementById("link");
  link.href = url;
  var download = document.getElementById("download");
  download.href = url + "&download=true";
}

window.addEventListener("load", updateImage);
