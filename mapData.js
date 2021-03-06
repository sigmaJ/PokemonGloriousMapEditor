var mapData = {
  tileData: null, //column major
  addRowTop: function() {
    var numCols = this.tileData.length;
    for(var i = 0; i < numCols; i++) {
      this.tileData[i].unshift(new tile());
    }
  },
  addRowBot: function() {
    var numCols = this.tileData.length;
    for(var i = 0; i < numCols; i++) {
      this.tileData[i].push(new tile());
    }
  },
  addColLeft: function() {
    var numRows = this.tileData[0].length;
    this.tileData.unshift(new Array(numRows));

    for(var i = 0; i < numRows; i++) {
      this.tileData[0][i] = new tile();
    }
  },
  addColRight: function() {
    var numRows = this.tileData[0].length;
    var numCols = this.tileData.length;
    
    this.tileData.push(new Array(numRows));

    for(var i = 0; i < numRows; i++) {
      this.tileData[numCols][i] = new tile();
    }
  },
  init: function(data) {
    var numCols = data.length;
    var numRows;
    if(numCols == 0) {
    
      this.tileData = new Array(8);
      for(var i = 0; i < 8; i++) {
        this.tileData[i] = new Array(8);
        for(var j = 0; j < 8; j++) {
          this.tileData[i][j] = new tile();
        }
      }
      
      return;
      
    } else {
      numRows = data[0].length;
      
      this.tileData = new Array(numCols);
      for(var i = 0; i < numCols; i++) {
        this.tileData[i] = new Array(numRows);
        for(var j = 0; j < numRows; j++) {
          this.tileData[i][j] = new tile(data[i][j]);
        }
      }
    }
    
  },
  setRect: function(x, y, w, h) {
    var tiles = paletteModule.getCurrentSelection();
    var tileX = 0;
    var tileY = 0;
    var layer = layerModule.activeLayer;
    
    for(var i = 0; i < w; i++) {
      for(var j = 0; j < h; j++) {
//        console.log("input: \nid: " + tiles.id + "\nx: " + tiles.x + "\ny: " + tiles.y + "\nw: " + tiles.w + "\nh: " + tiles.h + "\ni: " + i + "\nj: " + j);
        this.tileData[x+i][y+j].data[layer][0] = tiles.id;
        var tileX = tiles.x + i % tiles.w;
        var tileY = tiles.y + j % tiles.h;
        console.log("tilevars:\nx: " + tileX + "\ny: " + tileY + "\ncomputed: " + tileY * 8 + tileX);
        this.tileData[x+i][y+j].data[layer][1] = tileY * 8 + tileX;
      }
    }
  },
  getTile: function(x, y, layer) {
    return tileData[x][y].getID(layer);
  },
  save: function() {
    var numCols = this.tileData.length;
    var numRows = this.tileData[0].length;
    
    var returnData = new Array(numCols);
    for(var i = 0; i < numCols; i++) returnData[i] = new Array(numRows);
    
    for(var col = 0; col < numCols; col++) {
      for(var row = 0; row < numRows; row++) {
        var str = "";
        for(var layer = 0; layer < 5; layer++) {
          str += this.tileData[col][row].data[layer][0] + ',' + this.tileData[col][row].data[layer][1] + '|';
        }
        returnData[col][row] = str + this.tileData[col][row].text;
      }
    }
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: getParameterByName('ssid'),
      range: 'Sheet1!C:ZZ',
      valueInputOption: "RAW", //Yeah I know this is insecure ITS JAVASCRIPT I DONT HAVE ANY FUCKS TO GIVE
      majorDimension: 'COLUMNS',
      values: returnData
    }).then(function(response) {
      console.log('response get');
      console.log(response);
    }, function(response) {
      console.log('Error: ' + response.result.error.message);
    });
  }
};

class tile {
  constructor(data) {
    if(arguments.length > 0) {
      var e = data.split("|");
      this.data = new Array(5);
      for(var k = 0; k < 5; k++) {
        var dk = e[k].split(",");
        this.data[k] = [parseInt(dk[0]), parseInt(dk[1])];
      }
      this.text = e[5];
    } else {
      this.data = new Array(5);
      for(var k = 0; k < 5; k++) {
        this.data[k] = [-1,-1];
      }
      this.text = "";
    }
  }
  
  getID(layer) {
    return data[layer];
  }
}
