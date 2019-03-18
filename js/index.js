
function updateImage() {
  var text = document.getElementById("user-text");
  var url = "drawing.svg?text=" + encodeURIComponent(text.value);
  var embed = document.getElementById("embed");
  embed.data = embed.src = url;
  var link = document.getElementById("link");
  link.href = url;
  var downloadSVG = document.getElementById("downloadSVG");
  downloadSVG.href = url + "&download=svg";
  var downloadPDF = document.getElementById("downloadPDF");
  downloadPDF.href = url + "&download=pdf";
}

window.addEventListener("load", updateImage);
