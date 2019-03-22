var SYLLABLE_DIVIDER = "|";
var letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZzÄäÖöÜüß0123456789 +-?";
var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß0123456789 +-=?";

function getLayerNamed(name) {
  var layers = document.getElementsByTagName("g");
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    if (layer.getAttribute("inkscape:label") == name) {
      return layer;
    }
  }
  throw Error("Layer " + name + " not found.");
}

function letterToLayers(letter) {
  var index = letters.indexOf(letter);
  if (index < 0) {
    index = letters.indexOf(letter.toLowerCase());
    if (index < 0) {
      index = letters.indexOf(letter.toUpperCase());
      if (index < 0) {
        throw Error("Letter " + letter + " not found.");
      }
    }
  }
  // integer division, see http://stackoverflow.com/questions/4228356/ddg#4228376
  return [
    getLayerNamed("b1" + index % 8),
    getLayerNamed("b2" + Math.floor(index / 8))
  ];
}

/* Return the width of one letter tile. */
function getTileWidth() {
  // bBox, see https://stackoverflow.com/a/18148142
  return document.getElementById("tileWidth").getBBox().width;
}

function createMovedLayer(layer, xOffset) {
  var movedLayer = layer.cloneNode(true);
  movedLayer.setAttribute("transform", (movedLayer.getAttribute("transform") || "") + " translate(" + xOffset + ", 0)");
  document.rootElement.appendChild(movedLayer);
  return movedLayer;
}

/* This create a new puzzle piece by moving existing layers.
 * - letter is the letter to create, a string like "a"
 * - xOffset is the amount of units to move the layers.
 * - addDivider is a boolean whether to add a right border to the puzzle piece
 */
function createMovedTileLayers(letter, xOffset, addDivider) {
  var movedLayers = [];
  // create the move layer including the letter
  var letterBefore = document.getElementById("text").innerHTML;
  document.getElementById("text").innerHTML = letter;
  try {
    movedLayers.push(createMovedLayer(getLayerNamed("move"), xOffset));
  } finally {
    document.getElementById("text").innerHTML = letterBefore;
  }
  // add the layer which is used for dividing the puzzle pieces
  if (addDivider) {
    movedLayers.push(createMovedLayer(getLayerNamed("divide"), xOffset));
  }
  // add the puzzle layers which identify the letter
  letterToLayers(letter).forEach(function (layer) {
    layer.style.display = "inline";
    movedLayers.push(createMovedLayer(layer, xOffset));
    layer.style.display = "none";
  });
  return movedLayers;
}

function displayText(text) {
  var hasManualSyllableDivision = text.includes(SYLLABLE_DIVIDER);
  var puzzleIndex = 1;
  for (var i = 1; i < text.length; i++) {
    var letter = text[i];
    if (letter == SYLLABLE_DIVIDER) {
      continue;
    }
    var hasBorderToNextTile = i + 1 < text.length ?
      text[i+1] == SYLLABLE_DIVIDER || !hasManualSyllableDivision : true;
    var xOffset = getTileWidth() * puzzleIndex;
    createMovedTileLayers(letter, xOffset, hasBorderToNextTile);
    puzzleIndex++;
  }
  // set the first letter
  letterToLayers(text[0]).forEach(function(layer) {
    layer.style.display = "inline";
  });
  document.getElementById("text").innerHTML = text[0];
  if (text.length >= 2 && text[1] != SYLLABLE_DIVIDER && hasManualSyllableDivision) {
    getLayerNamed("divide").style.display = "none";
  }
  // set the dimenstions of the file
  var initialWidth = parseFloat(document.rootElement.getAttribute("width"));
  var newWidth = initialWidth + getTileWidth() * (text.length - 1);
  document.rootElement.setAttribute("width", newWidth);
}

function download(filename, text, to) {
  document.location = 'download.html#content=' + encodeURIComponent(text) +
    "&filename=" + encodeURIComponent(filename) +
    "&mimetype=" + encodeURIComponent("image/svg+xml") +
    "&to=" + encodeURIComponent(to);
}

window.addEventListener("load", function(){
  var query = getQuery();
  var text = query.text;
  displayText(text || "?");
  if (query.download) {
    var content = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
      '<!-- Created with Montessori ABC Puzzle (https://github.com/niccokunzmann/montessori-abc-puzzle) -->\n' +
      '<!-- Created with Inkscape (http://www.inkscape.org/) -->\n' +
      document.rootElement.outerHTML;
    download("puzzle-" + text + ".svg", content, query.download);
  }
});
