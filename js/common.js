function getQuery(query) {
  // from http://stackoverflow.com/a/1099670/1320237
  var qs = query || document.location.search;
  var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
  var specification = {};
  qs = qs.split("+").join(" ");

  while (tokens = re.exec(qs)) {
    var id = decodeURIComponent(tokens[1]);
    var content = decodeURIComponent(tokens[2]);
    specification[id] = content;
  }
  return specification;
}
