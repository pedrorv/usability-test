// ----------------------------------------------------------------
//                        Useful functions
// ----------------------------------------------------------------

function deleteVis() {
  d3.select("g.vis").remove();
}

function formatNumber(number) {
  var numberStr = "" + number,
      newNumberStr = [],
      j = numberStr.length-1,
      i = 0;
  for (; j >= 0; j--) {
    newNumberStr.unshift(numberStr[j]);
    i++;
    if ((i%3 == 0) && j > 0) {
      newNumberStr.unshift(".");
    }
  }
  return newNumberStr.join("");
}
function scaleSvg(ratio) {
  d3.select("svg.vis")
    .attr("width", function() { return visConfig.width * ratio; })
    .attr("height", function() { return visConfig.height * ratio; });
}

function scaleRatio(windowWidth, visWidth, baseVisResolutionWidth) {
  var proportion = visWidth/baseVisResolutionWidth;
  var finalWidth = windowWidth * proportion;

  return finalWidth/visWidth;
}

function scaleVis(ratio) {
  d3.select("g.vis")
    .attr("transform", function() {
      return "scale(" + ratio + ")";
    });
}

function roundMultPowerTen(num) {
  var n = Math.floor(Math.log10(num));
  var power = Math.pow(10, (n<=1) ? 1 : n);

  return num + (power - (num % power));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// ----------------------------------------------------------------
//               Overview visualization functions
// ----------------------------------------------------------------

function returnCirclesData(dataset) {
    var newDataset = {};
    for (var year in dataset) {
      newDataset[year] = {};
      for (var title in dataset[year]) {
        if(!newDataset[year][dataset[year][title]["Mês"]]) {
          newDataset[year][dataset[year][title]["Mês"]] = {
            "Títulos": 1,
            "Público": dataset[year][title]["Público"],
            "Renda": dataset[year][title]["Renda"],
            "Gêneros": {
              "Ficção": 0,
              "Documentário": 0,
              "Animação": 0
            }
          };
          newDataset[year][dataset[year][title]["Mês"]]["Gêneros"][dataset[year][title]["Gênero"]]++;
        } else {
          newDataset[year][dataset[year][title]["Mês"]]["Títulos"] += 1;
          newDataset[year][dataset[year][title]["Mês"]]["Público"] += dataset[year][title]["Público"];
          newDataset[year][dataset[year][title]["Mês"]]["Renda"] += dataset[year][title]["Renda"];
          newDataset[year][dataset[year][title]["Mês"]]["Gêneros"][dataset[year][title]["Gênero"]]++;
        }
      }
    }
    return newDataset;
}

function returnMoviesData(dataset) {
    var newDataset = {};
    for (var year in dataset) {
      newDataset[year] = [[],[],[],[],[],[],[],[],[],[],[],[]];
      for (var title in dataset[year]) {
        newDataset[year][parseInt(dataset[year][title]["Mês"])-1].push(dataset[year][title]);
      }
      for (var month in newDataset[year]) {
        newDataset[year][month].sort(function(a,b) {
          return b["Público"] - a["Público"];
        });
      }
    }
    return newDataset;
}

function returnMaxDataCircles(dataset, property) {
  var max = 0;
  for (var year in dataset) {
    for (var month in dataset[year]) {
        if (dataset[year][month][property] > max)
          max = dataset[year][month][property];
    }
  }
  return max;
}

function returnMinDataCircles(dataset, property) {
  var min = Infinity;
  for (var year in dataset) {
    for (var month in dataset[year]) {
        if (dataset[year][month][property] < min)
          min = dataset[year][month][property];
    }
  }
  return min;
}

function returnXPosition(index) {
  return 64 + (index * ((visConfig.circleBiggerRadius * 2) + visConfig.wCircleMargin)) + visConfig.circleBiggerRadius;
}

function returnYPosition(index) {
  return visConfig.hMonthMargin + visConfig.hMonthBox + 4 + (index * ((visConfig.circleBiggerRadius * 2) + visConfig.hCircleMargin)) + visConfig.circleBiggerRadius;
}

function testXPosition(x) {
  var index = (x - 64 - visConfig.circleBiggerRadius) / ((visConfig.circleBiggerRadius * 2) + visConfig.wCircleMargin);

  return Math.floor(index + 0.5);
}

function testYPosition(y) {
  var index = (y - visConfig.hMonthMargin - visConfig.circleBiggerRadius - visConfig.hMonthBox - 4) / ((visConfig.circleBiggerRadius * 2) + visConfig.hCircleMargin);

  return Math.floor(index + 0.5);
}

function moveSelfY(position, currentValue, duration) {
  d3.selectAll("rect[currentyear='"+currentValue+"']")
    .transition('moveSelfY')
    .duration(duration)
    .attr("y", function() {
      return position + (visConfig.yearTextSize/3) - visConfig.yearTextSize;
    });

  d3.selectAll("text[currentyear='"+currentValue+"']")
    .transition('moveSelfY')
    .duration(duration)
    .attr("y", function() {
      return position + (visConfig.yearTextSize/3);
    });

  d3.selectAll("circle[currentyear='"+currentValue+"']")
    .transition('moveSelfY')
    .duration(duration)
    .attr("cy", function() {
      return position;
    });
}

function moveOthersY(indexShift, initialIndex, currentValue) {
  var shiftAux = d3.selectAll("[currentyear='"+initialIndex+"']");
  var selfCurrAux = d3.selectAll("[currentyear='"+currentValue+"']");

  d3.selectAll("rect[currentyear='"+initialIndex+"']")
    .transition("moveXall")
    .duration(visConfig.monthMovingDuration)
    .attr("y", function() {
      return returnYPosition(indexShift) + (visConfig.yearTextSize/3) - visConfig.yearTextSize;
    });

  d3.selectAll("text[currentyear='"+initialIndex+"']")
    .transition("moveYall")
    .duration(visConfig.monthMovingDuration)
    .attr("y", function() {
      return returnYPosition(indexShift) + (visConfig.yearTextSize/3);
    });

  d3.selectAll("circle[currentyear='"+initialIndex+"']")
    .transition("moveYall")
    .duration(visConfig.monthMovingDuration)
    .attr("cy", function() {
      return returnYPosition(indexShift);
    });

  shiftAux.attr("currentyear", indexShift);
  selfCurrAux.attr("currentyear", initialIndex);
}

function moveSelfX(position, currentValue, duration) {
  d3.selectAll("rect[currentmonth='"+currentValue+"']")
    .transition('moveSelfX')
    .duration(duration)
    .attr("x", function() {
      return position - visConfig.circleBiggerRadius - visConfig.wMonthBoxExtra;
    });

  d3.selectAll("text[currentmonth='"+currentValue+"']")
    .transition('moveSelfX')
    .duration(duration)
    .attr("x", function() {
      return position;
    });

  d3.selectAll("circle[currentmonth='"+currentValue+"']")
    .transition('moveSelfX')
    .duration(duration)
    .attr("cx", function() {
      return position;
    });
}

function moveOthersX(indexShift, initialIndex, currentValue) {
  var shiftAux = d3.selectAll("[currentmonth='"+initialIndex+"']");
  var selfCurrAux = d3.selectAll("[currentmonth='"+currentValue+"']");

  d3.selectAll("rect[currentmonth='"+initialIndex+"']")
    .transition("moveXall")
    .duration(visConfig.monthMovingDuration)
    .attr("x", function() {
      return returnXPosition(indexShift) - visConfig.circleBiggerRadius - visConfig.wMonthBoxExtra;
    });

  d3.selectAll("text[currentmonth='"+initialIndex+"']")
    .transition("moveXall")
    .duration(visConfig.monthMovingDuration)
    .attr("x", function() {
      return returnXPosition(indexShift);
    });

  d3.selectAll("circle[currentmonth='"+initialIndex+"']")
    .transition("moveXall")
    .duration(visConfig.monthMovingDuration)
    .attr("cx", function() {
      return returnXPosition(indexShift);
    });

  shiftAux.attr("currentmonth", (indexShift));
  selfCurrAux.attr("currentmonth", initialIndex);
}


// ----------------------------------------------------------------
//             Nationalities visualization functions
// ----------------------------------------------------------------

function returnNationsData(datasetMovies, datasetNations) {
  var newDataset = {};
  for (var year in datasetMovies) {
    newDataset[year] = {};
    for (var title in datasetMovies[year]) {
      var country = datasetMovies[year][title]["País"];
      if (country.indexOf("/") != -1) {
        var arr = country.split("/");
        country = arr[0];
      }
      var continent = datasetNations[country]["continente"];

      if(!newDataset[year][continent]) {
        newDataset[year][continent] = {};
      }

      if(!newDataset[year][continent][country]) {
        newDataset[year][continent][country] = {
          "Títulos": 1,
          "Público": datasetMovies[year][title]["Público"],
          "Renda": datasetMovies[year][title]["Renda"],
          "Gêneros": {
            "Ficção": 0,
            "Documentário": 0,
            "Animação": 0
          }
        };
        newDataset[year][continent][country]["Gêneros"][datasetMovies[year][title]["Gênero"]]++;
      }
      else {
        newDataset[year][continent][country]["Títulos"] += 1;
        newDataset[year][continent][country]["Público"] += datasetMovies[year][title]["Público"];
        newDataset[year][continent][country]["Renda"] += datasetMovies[year][title]["Renda"];
        newDataset[year][continent][country]["Gêneros"][datasetMovies[year][title]["Gênero"]]++;
      }
    }
  }
  return newDataset;
}

function returnGraphData(datasetGraph, continentFilter, publicFilter) {
  var newDataset = {};
  for (var year in datasetGraph) {
    newDataset[year] = [[],[],[],[],[],[]];
    for (var continent in datasetGraph[year]) {
      if (!continentFilter[continent]) continue;
      for (var country in datasetGraph[year][continent]) {
        var countryPublic = datasetGraph[year][continent][country]["Público"];
        var countryTitles = datasetGraph[year][continent][country]["Títulos"];
        var average = countryPublic/countryTitles;
        if (average >= publicFilter.min && average <= publicFilter.max) {
          newDataset[year][visConfig.continents[continent]].push(
            {
              "País": country,
              "Dados": datasetGraph[year][continent][country]
            }
          );
        }
        else continue;
      }
      for (var i = 0; i < newDataset[year][visConfig.continents[continent]].length; i++) {
        newDataset[year][visConfig.continents[continent]][i]["Dados"]["Média"] =
          newDataset[year][visConfig.continents[continent]][i]["Dados"]["Público"] /
          newDataset[year][visConfig.continents[continent]][i]["Dados"]["Títulos"];
      }
    }
  }
  return newDataset;
}

// ----------------------------------------------------------------
//             Recordists visualization functions
// ----------------------------------------------------------------



// ----------------------------------------------------------------
//             Production visualization functions
// ----------------------------------------------------------------

function returnRegionsData(dataset) {
  var newObj = {};
  for (var uf in dataset) {
    if (!newObj[visConfig.ufsData[uf]["Região"]]) {
      newObj[visConfig.ufsData[uf]["Região"]] = [];
    }
    for (var j = 0; j < dataset[uf].length; j++) {
      if (!newObj[visConfig.ufsData[uf]["Região"]][j] && newObj[visConfig.ufsData[uf]["Região"]][j] !== 0) {
        newObj[visConfig.ufsData[uf]["Região"]][j] = dataset[uf][j];
      } else  {
        newObj[visConfig.ufsData[uf]["Região"]][j] += dataset[uf][j];
      }
    }
  }
  return newObj;
}
