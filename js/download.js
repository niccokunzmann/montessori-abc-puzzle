/* Parameters in the query:
   - filename
   - content
   - mimetype
   - to can be
     - "pdf"
 */

var PDF_CONVERTER_URL = "https://printathpi.quelltext.eu/topdf";
//var PDF_CONVERTER_URL = "http://localhost:8001/topdf"; // local version from https://github.com/niccokunzmann/printathpi


function download(filename, text, mimetype, charset) {
    var url = 'data:' + mimetype + ';charset=utf-8,' + encodeURIComponent(text);
    downloadUrl(filename, url);
}

function downloadUrl(filename, url) {
  // from https://stackoverflow.com/a/18197341/1320237
  var element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// convert to pdf
function pdf(filename, text, mimetype) {
    // from https://stackoverflow.com/a/2198524/1320237
    // Define a boundary, I stole this from IE but you can use any string AFAIK
    var boundary = "---------------------------7da24f2e50046";
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    console.log(text);
    var body = '--' + boundary + '\r\n'
             // Parameter name is "file" and local filename is "temp.txt"
             + 'Content-Disposition: form-data; name="files[]";'
             + 'filename="' + filename + '"\r\n'
             // Add the file's mime-type
             + 'Content-type: ' +  mimetype + '\r\n\r\n'
             + text + '\r\n'
             /*+ boundary + '--'/**/;

    xhr.open("POST", PDF_CONVERTER_URL, true);
    xhr.setRequestHeader(
        "Content-type", "multipart/form-data; boundary="+boundary

    );
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var pdfFilename = filename.replace(/\.[sS][vV][Gg]$/, ".pdf");
                // load blob from xhr from https://stackoverflow.com/a/17696608/1320237
                var blob = new Blob([xhr.response], {type: "application/pdf"});
                var objectUrl = URL.createObjectURL(blob);
                downloadUrl(pdfFilename, objectUrl);
            } else {
                alert("Could not convert to PDF.");
            }
        }
    }
    xhr.send(body);
}

window.addEventListener("load", function(){
  var query = getQuery(document.location.hash.substring(1));
  if (query.to == "pdf") {
    pdf(query.filename, query.content, query.mimetype);
  } else {
    download(query.filename, query.content, query.mimetype);
  }
  //setTimeout(window.close, 5000);
});
