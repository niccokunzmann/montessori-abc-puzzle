
// Parameters: filename, content, mimetype

function download(filename, text, mimetype) {
  // from https://stackoverflow.com/a/18197341/1320237
  var element = document.createElement('a');
  element.setAttribute('href', 'data:' + mimetype + ';charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

window.addEventListener("load", function(){
  var query = getQuery(document.location.hash.substring(1));
  download(query.filename, query.content, query.mimetype);
  setTimeout(window.close, 5000);
});
