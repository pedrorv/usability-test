function createVisProduction(userWindowWidth) {

  if (visConfig.productionData === undefined) {
    d3.json("js/ufs-count-data.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.productionData = json;
      d3.json("js/ufs-region-count-data.json", function(error, json) {
        if (error) return console.warn(error);
        visConfig.ufsData = json;
        visConfig.regionsData = returnRegionsData(visConfig.productionData);
        createVis();
      });
    });
  } else {
    createVis();
  }

  function createVis() {

    deleteVis();

    // Initial state of vis
    for (var uf in visConfig.proUfsFilter) {
      visConfig.proUfsFilter[uf] = false;
    }
    for (var region in visConfig.regionsFilter) {
      visConfig.regionsFilter[region] = true;
    }

    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);

    var superscription = vis.append("g")
      .attr("class", "superscription");

    superscription.append("text")
      .attr("class", "title")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisTitleSize)
      .attr("font-weight", "bold")
      .text("Produção nacional");

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("Participação na produção cinematográfica brasileira por UF");

    d3.select("div.visualization").style({
      width: (visConfig.width * ratio) + "px"
    });

    var ufs = d3.select("div.visualization").append("div")
      .attr("id", "word-cloud")
      .style({
        position: "absolute",
        top: ((visConfig.proMenuTextOptionsH/visConfig.height) * 100) + "%",
        left: ((visConfig.proMenuTextOptionsW/visConfig.width) * 100) + "%",
        width: ((visConfig.proMenuTextOptionsWTotal/visConfig.width) * 100) + "%",
        height: ((visConfig.proMenuTextOptionsHTotal/visConfig.height) * 100) + "%"
      });

    for (var uf in visConfig.ufsData) {
      ufs.append("p")
        .attr("class", "uf bold")
        .attr("id", uf)
        .attr("base-size", function() {
          var max = visConfig.ufsData['RJ']['Total'];
          var min = visConfig.ufsData['AM']['Total'];
          return visConfig.proMenuTextOptionsSmallerFont +
                 (visConfig.ufsData[uf]["Total"] - min) *
                 (visConfig.proMenuTextOptionsBiggerFont - visConfig.proMenuTextOptionsSmallerFont) /
                 (max - min);
        })
        .style({
          "font-size": function() {
            return (parseFloat(d3.select(this).attr("base-size")) * ratio) + "px";
          },
          color: "#000",
          display: "inline-block",
          margin: "0 5px 5px 0"
        })
        .text(visConfig.ufsData[uf]["Estado"].toUpperCase())
        .on("click", function() {
          var self = d3.select(this);
          var uf = self.attr("id");
          visConfig.proUfsFilter[uf] = !visConfig.proUfsFilter[uf];
          var region = visConfig.ufsData[uf]["Região"].toLowerCase();
          self.classed(region, !self.classed(region));
          updateGraph();
        })
        .on("mouseover", function() {
          var self = d3.select(this);
          var uf = self.attr("id");
          var region = visConfig.ufsData[uf]["Região"].toLowerCase();
          self.classed(region + "-hold", !self.classed(region + "-hold"));
        })
        .on("mouseout", function() {
          var self = d3.select(this);
          var uf = self.attr("id");
          var region = visConfig.ufsData[uf]["Região"].toLowerCase();
          self.classed(region + "-hold", !self.classed(region + "-hold"));
        });
    }

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.proMenuFirstTitleW)
      .attr("y", visConfig.proMenuFirstTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.proMenuTitleColor)
      .attr("font-size", visConfig.proMenuTitleSize)
      .attr("font-weight", "bold")
      .text("Produção por região");

    menuFilters.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.proMenuSecondTitleW)
      .attr("y", visConfig.proMenuSecondTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.proMenuTitleColor)
      .attr("font-size", visConfig.proMenuTitleSize)
      .attr("font-weight", "bold")
      .text("Estados brasileiros produtores");

    for (var i = 0; i < visConfig.regionsArr.length; i++) {
      menuFilters.append("rect")
        .attr("class", "region-selector")
        .attr("width", visConfig.proSquareOptionsSize)
        .attr("height", visConfig.proSquareOptionsSize)
        .attr("x", function () {
          return visConfig.proSquareOptionsW + ((i%2)*visConfig.proSquareOptionsWDistance);
        })
        .attr("y", function () {
          return visConfig.proSquareOptionsH + ((Math.floor(i/2)) * visConfig.proSquareOptionsHDistance);
        })
        .attr("i", i)
        .attr("fill", function () {
          return visConfig.regionsColors[visConfig.regionsArr[i]];
        })
        .attr("rx", visConfig.menusCheckBoxRadius)
        .attr("ry", visConfig.menusCheckBoxRadius)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("click", function() {
          var self = d3.select(this);
          var region = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? visConfig.regionsColors[visConfig.regionsArr[region]] : "white";
          });
          visConfig.regionsFilter[visConfig.regionsArr[region]] = !visConfig.regionsFilter[visConfig.regionsArr[region]];
          updateGraph();
        })
        .on("mouseover", function() {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("mouseout", function() {
          d3.selectAll("rect.region-selector").attr("stroke-width", 1);
        });

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.proFirstOptionsW + ((i%2)*visConfig.proCircleOptionsWDistance);
        })
        .attr("y", function() {
          return visConfig.proFirstOptionsH + ((Math.floor(i/2)) * visConfig.proCircleOptionsHDistance);
        })
        .attr("text-anchor", "start")
        .attr("fill", visConfig.proMenuTitleColor)
        .attr("font-size", visConfig.proFirstOptionsSize)
        .text(function() {
          return visConfig.regionsArr[i];
        });

    }

    // Start Drawing Axis Base

    var graph = vis.append("g")
      .attr("class", "graph")
      .append("g")
      .attr("class", "axis");

    d3.select("g.graph")
      .append("g")
      .attr("class", "paths");

    d3.select("g.graph")
      .append("g")
      .attr("class", "circles");


    graph.append("text")
      .attr("class", "graph-description")
      .attr("x", function() {
        return visConfig.proWMargin + visConfig.proProdLabelLeftMargin - visConfig.proLabelRightMargin;
      })
      .attr("y", function() {
        return visConfig.proProdLabelTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.natContinentColor)
      .attr("font-size", visConfig.proLabelSize)
      .text("Total produzido");

    graph.append("text")
      .attr("class", "graph-description")
      .attr("x", function() {
        return visConfig.proWMargin + visConfig.proYearsLabelLeftMargin - visConfig.proLabelRightMargin;
      })
      .attr("y", function() {
        return visConfig.proAxisStartH + visConfig.proYearsLabelTopMargin;
      })
      .attr("text-anchor", "start")
      .attr("fill", visConfig.natContinentColor)
      .attr("font-size", visConfig.proLabelSize)
      .text("Anos");

    graph.append("rect")
      .attr("x", (visConfig.proWMargin + visConfig.proAxisStartW))
      .attr("y", visConfig.proAxisStartH - visConfig.proYAxisH)
      .attr("width", visConfig.proXAxisW)
      .attr("height", visConfig.proYAxisH)
      .attr("fill", "white")
      .on("click", function() {
        d3.select("g.year-detail").remove();
      });

    // Drawing x axis

    graph.append("line")
      .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
      .attr("y1", function() {
        return visConfig.proAxisStartH;
      })
      .attr("x2", function() {
        return (visConfig.proWMargin + visConfig.proAxisStartW + visConfig.proXAxisW + 8);
      })
      .attr("y2", function() {
        return visConfig.proAxisStartH;
      })
      .attr("stroke", visConfig.proPathsColor)
      .attr("stroke-width", visConfig.proLinesWidth);


    // Draw y axis

    graph.append("line")
      .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
      .attr("y1", function() {
        return visConfig.proAxisStartH;
      })
      .attr("x2", function() {
        return (visConfig.proWMargin + visConfig.proAxisStartW);
      })
      .attr("y2", function() {
        return visConfig.proAxisStartH - visConfig.proYAxisH - 15;
      })
      .attr("stroke", visConfig.proPathsColor)
      .attr("stroke-width", visConfig.proLinesWidth);

    for (var i = 0; i <= visConfig.proYearsArr.length; i++) {
      graph.append("text")
        .attr("class", "xaxis-description label")
        .attr("x", function() {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("y", function() {
          return visConfig.proAxisStartH + visConfig.proYearsLabelTopMargin;
        })
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.proLabelSize)
        .text(function() {
          return visConfig.proYearsArr[i];
        });

      if (i > 0) {
        graph.append("line")
          .attr("class", "x-guidelines")
          .attr("x1", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
          })
          .attr("y1", function() {
            return visConfig.proAxisStartH;
          })
          .attr("x2", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
          })
          .attr("y2", function() {
            return visConfig.proAxisStartH - visConfig.proYAxisH - 15;
          })
          .attr("stroke", visConfig.proGuidelinesColor)
          .attr("stroke-width", visConfig.proGuidelinesWidth);
      }
    }

    for (var i = 1; i <= 10; i++) {
      graph.append("line")
        .attr("class", "y-guidelines")
        .attr("i", i)
        .attr("x1", (visConfig.proWMargin + visConfig.proAxisStartW))
        .attr("x2", (visConfig.proWMargin + visConfig.proAxisStartW + visConfig.proXAxisW + 8))
        .attr("y1", (visConfig.proAxisStartH - i * (visConfig.proYAxisH/10)))
        .attr("y2", (visConfig.proAxisStartH - i * (visConfig.proYAxisH/10)))
        .attr("stroke", visConfig.proGuidelinesColor)
        .attr("stroke-width", visConfig.proGuidelinesWidth)
    }

    drawGraph();

    function drawYAxisLabels(maxValue) {

      var graph = d3.select("g.axis");

      for (var i = 0; i <= 10; i++) {
        graph.append("text")
          .attr("class", "yaxis-description label")
          .attr("i", i)
          .attr("x", function() {
            return (visConfig.proWMargin + visConfig.proAxisStartW - visConfig.proLabelRightMargin);
          })
          .attr("y", function() {
            return visConfig.proAxisStartH - i * (visConfig.proYAxisH/10);
          })
          .attr("text-anchor", "end")
          .attr("fill", visConfig.natContinentColor)
          .attr("font-size", visConfig.proLabelSize)
          .text(function() {
            return i * (maxValue)/10;
          });
      }

    }

    function drawYAxisLabelsUpdate(maxValue) {

      d3.selectAll("text.yaxis-description")
        .transition()
        .duration(150)
        .attr("y", function() {
          var self = d3.select(this);
          return parseFloat(self.attr("y")) - 1280;
        })
        .each("end", function() {
          var self = d3.select(this);
          self.text(function() {
            var self = d3.select(this);
            return parseInt(self.attr("i")) * (maxValue)/10;
          });
          d3.selectAll("text.yaxis-description")
          .transition()
          .duration(150)
          .attr("y", function(d,i) {
            return visConfig.proAxisStartH - i * (visConfig.proYAxisH/10);
          });
        });

    }

    function updateLine(identifier, dataset) {

      var id = identifier.toLowerCase();

      d3.select("path#" + id).remove();

      var circles = d3.select("g.circles");
      var paths = d3.select("g.paths");

      circles.selectAll("circle#" + id)
        .data(dataset)
        .transition()
        .duration(150)
        .attr("cx", function(d,i) {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("cy", function(d,i) {
          var amount = d;
          var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
          return visConfig.proAxisStartH - y;
        });

      var lineFunction = d3.svg
                            .line()
                            .x(function(d, i) {
                              return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
                            })
                            .y(function(d, i) {
                              var amount = d;
                              var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
                              return visConfig.proAxisStartH - y;
                            })
                            .interpolate("linear");


      var lineGraph = paths.append("path")
                        .attr("id", id)
                        .attr("d", lineFunction(dataset))
                        .attr("stroke", function() {
                          if (id.length === 2) return visConfig.regionsColors[visConfig.ufsData[identifier]["Região"]];
                          return visConfig.regionsColors[identifier];
                        })
                        .attr("stroke-width", visConfig.proPathsWidth)
                        .attr("fill", "none")
                        .attr("opacity", 0)
                        .transition()
                        .duration(100)
                        .delay(150)
                        .attr("opacity", 1);

    }



    function drawLine(identifier, dataset) {

      var paths = d3.select("g.paths");
      var circles = d3.select("g.circles");

      var id = identifier.toLowerCase();

      var lineFunction = d3.svg
                            .line()
                            .x(function(d, i) {
                              return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
                            })
                            .y(function(d, i) {
                              var amount = d;
                              var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
                              return visConfig.proAxisStartH - y;
                            })
                            .interpolate("linear");

      var lineGraph = paths.append("path")
                        .attr("id", id)
                        .attr("d", lineFunction(dataset))
                        .attr("stroke", function() {
                          if (id.length === 2) return visConfig.regionsColors[visConfig.ufsData[identifier]["Região"]];
                          return visConfig.regionsColors[identifier];
                        })
                        .attr("stroke-width", visConfig.proPathsWidth)
                        .attr("fill", "none")
                        .attr("opacity", 0)
                        .transition()
                        .duration(100)
                        .delay(200)
                        .attr("opacity", function () {
                          return (id.length === 2) ? 0.6 : 1;
                        });

      if (!visConfig.regionsColors[identifier]) {
        var fill = visConfig.regionsColors[visConfig.ufsData[identifier]["Região"]];
      } else {
        var fill = visConfig.regionsColors[identifier];
      }

      circles.selectAll("circle#" + id)
        .data(dataset)
        .enter()
        .append("circle")
        .attr("id", id)
        .attr("class", "graph-points")
        .attr("cx", function (d,i) {
          return (visConfig.proWMargin + visConfig.proAxisStartW) + i*visConfig.proXAxisW/(visConfig.proYearsArr.length-1);
        })
        .attr("cy", function (d,i) {
          var amount = d;
          var y = amount * visConfig.proYAxisH / (visConfig.proMaxYValue);
          return visConfig.proAxisStartH - y;
        })
        .attr("r", function () {
          return (id.length === 2) ? visConfig.proMenuCirclesRadiusState : (visConfig.proMenuCirclesRadiusRegion);
        })
        .attr("fill", fill)
        .on("mouseover", function () {
          var self = d3.select(this);
          self
            .transition("grow")
            .duration(100)
            .attr("r", function () {
              return (self.attr("id").length === 2) ? visConfig.proMenuCirclesRadiusState +
                                                      visConfig.proMenuCirclesGrowFactor
                                                    : visConfig.proMenuCirclesRadiusRegion +
                                                      visConfig.proMenuCirclesGrowFactor;
            });
        })
        .on("mouseleave", function () {
          var allCircles = d3.selectAll("circle.graph-points");
          allCircles
            .transition("all-shrink")
            .duration(100)
            .attr("r", function () {
              var self = d3.select(this);
              return (self.attr('id').length === 2) ? visConfig.proMenuCirclesRadiusState
                                                    : visConfig.proMenuCirclesRadiusRegion;
            });
        })
        .on("click", function (d, i) {
          d3.select("g.year-detail").remove();

          var self = d3.select(this);
          var center = [parseFloat(self.attr("cx")), parseFloat(self.attr("cy"))];

          var details = circles.append("g")
            .attr("class", "year-detail");

          var background = details.append("rect")
            .attr("class", "details-background")
            .attr("x", center[0])
            .attr("y", center[1])
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("height", 0)
            .attr("width", 0)
            .attr("opacity", 0);


          var detailsText1 = details.append("text")
            .attr("class", "movie-detail bold")
            .attr("fill", "black")
            .attr("font-size", visConfig.recDetailsTextSize)
            .attr("opacity", 0)
            .text(function() {
              if (id.length === 2) {
                return id.toUpperCase() + ": " + d;
              }
              for (var region in visConfig.regionsFilter) {
                if (region.toLowerCase() === id) {
                  return region + ": " + d;
                }
              }
            });


          var w = detailsText1.node().getBBox().width;
          var h = detailsText1.node().getBBox().height;

          background.attr("x", function() {
                if (center[0] > (visConfig.proAxisStartW + visConfig.proXAxisW/2)) return center[0] - w - visConfig.proDetailsPadding;
                return center[0];
              })
              .attr("y", center[1] - (h + 7))
              .attr("width", w + visConfig.proDetailsPadding)
              .attr("height", (h + 7))
              .attr("fill", visConfig.recDetailsRectColor)
              .transition()
              .duration(100)
              .attr("opacity", 0.7);

           detailsText1.attr("y", function() {
             return center[1] - 7;
           })
           .attr("x", function() {
                 if (center[0] > (visConfig.proAxisStartW + visConfig.proXAxisW/2)) return center[0] - w - visConfig.proDetailsPadding/2;
                 return center[0] + visConfig.proDetailsPadding/2;
           })
           .transition()
           .duration(100)
           .delay(50)
           .attr("opacity", 1);
        })
        .attr("opacity", 0)
        .transition()
        .duration(150)
        .delay(function(d,i) {
          return i*10;
        })
        .attr("opacity", function() {
          return (id.length === 2) ? 0.6 : 1;
        });


    }

    function updateGraph() {
      setTimeout(drawGraph, 250);
    }

    function drawGraph() {

      d3.select("g.year-detail").remove();

      // Calculate Paramaters

      var dataHolder = visConfig.regionsData;
      var maxDataRegions = 0;
      var minDataRegions = Infinity;

      for (var region in dataHolder) {
        if (!visConfig.regionsFilter[region]) continue;
        for (var j = 0; j < dataHolder[region].length; j++) {
          if (dataHolder[region][j] > maxDataRegions) {
            maxDataRegions = dataHolder[region][j];
          }
          if (dataHolder[region][j] < minDataRegions) {
            minDataRegions = dataHolder[region][j];
          }
        }
      }

      // Calculate Paramaters 2

      var dataHolder2 = visConfig.productionData;

      for (var uf in dataHolder2) {
        if (!visConfig.proUfsFilter[uf]) continue;
        for (var j = 0; j < dataHolder2[uf].length; j++) {
          if (dataHolder2[uf][j] > maxDataRegions) {
            maxDataRegions = dataHolder2[uf][j];
          }
          if (dataHolder2[uf][j] < minDataRegions) {
            minDataRegions = dataHolder2[uf][j];
          }
        }
      }

      if (!visConfig.proMaxYValue) {

        visConfig.proMaxYValue = roundMultPowerTen(maxDataRegions);
        drawYAxisLabels(visConfig.proMaxYValue);

      } else if (visConfig.proMaxYValue != roundMultPowerTen(maxDataRegions)) {

        visConfig.proPreviousMaxYValue = visConfig.proMaxYValue;
        visConfig.proMaxYValue = roundMultPowerTen(maxDataRegions);

        if (d3.selectAll("text.yaxis-description").empty()) {
          drawYAxisLabels(visConfig.proMaxYValue);
        } else {
          drawYAxisLabelsUpdate(visConfig.proMaxYValue);
        }

      } else {

        visConfig.proPreviousMaxYValue = visConfig.proMaxYValue;
        if (d3.selectAll("text.yaxis-description").empty()) {
          drawYAxisLabels(visConfig.proMaxYValue);
        }

      }

      for (var region in visConfig.regionsData) {
        var id = region.toLowerCase();
        if (visConfig.regionsFilter[region]) {
          if (d3.selectAll("circle#" + id).empty()) {
            drawLine(region, visConfig.regionsData[region]);
          } else {
            if (visConfig.proMaxYValue !== visConfig.proPreviousMaxYValue) {
              updateLine(region, visConfig.regionsData[region]);
            }
          }
        }
        else {
          if (!d3.selectAll("circle#" + id).empty()) {
            d3.selectAll("circle#" + id).remove();
            d3.selectAll("path#" + id).remove();
          }
        }
      }

      for (var uf in visConfig.productionData) {
        var id = uf.toLowerCase();
        if (visConfig.proUfsFilter[uf]) {
          if (d3.selectAll("circle#" + id).empty()) {
            drawLine(uf, visConfig.productionData[uf]);
          } else {
            if (visConfig.proMaxYValue !== visConfig.proPreviousMaxYValue) {
              updateLine(uf, visConfig.productionData[uf]);
            }
          }
        }
        else {
          if (!d3.selectAll("circle#" + id).empty()) {
            d3.selectAll("circle#" + id).remove();
            d3.selectAll("path#" + id).remove();
          }
        }
      }

    }

    scaleVis(ratio);
  }

}
