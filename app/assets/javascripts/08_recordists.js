function createVisRecordists(userWindowWidth) {

  if (visConfig.recordistsData === undefined) {
    d3.json("js/recordists-vis-data.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.recordistsData = json;
      createVis();
    });
  } else {
    createVis();
  }

  function createVis() {

    deleteVis();

    visConfig.recModeSelected = "titles";
    visConfig.recMaxYAxisValue = undefined;

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
      .text("Filmes nacionais com mais de 500mil espectadores");

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("De 1970 a 2014");

    superscription.append("circle")
      .attr("class", "menu-option")
      .attr("cx", visConfig.recFirstOptionCircleW)
      .attr("cy", visConfig.recFirstOptionCircleH)
      .attr("r", visConfig.recOptionCircleRadius)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("stroke", visConfig.recOptionCircleFill)
      .attr("stroke-width", 1)
      .on("click", function() {
        d3.selectAll("circle.menu-option").attr("fill", "white");
        d3.select("text.public-info").attr("opacity", 0);
        d3.select("g.subtitle-graph").attr("opacity", 1);
        d3.select(this).attr("fill", visConfig.recOptionCircleFill);
        visConfig.recModeSelected = "titles";
        drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);
      });

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", visConfig.recFirstTextOptionW)
      .attr("y", visConfig.recFirstTextOptionH)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recOptionsTextSize)
      .text("Número de títulos");

    superscription.append("circle")
      .attr("class", "menu-option")
      .attr("cx", visConfig.recFirstOptionCircleW)
      .attr("cy", visConfig.recSecondOptionCircleH)
      .attr("r", visConfig.recOptionCircleRadius)
      .attr("fill", "white")
      .attr("stroke", visConfig.recOptionCircleFill)
      .attr("stroke-width", 1)
      .on("click", function() {
        d3.selectAll("circle.menu-option").attr("fill", "white");
        d3.select("text.public-info").attr("opacity", 1);
        d3.select("g.subtitle-graph").attr("opacity", 0);
        d3.select(this).attr("fill", visConfig.recOptionCircleFill);
        visConfig.recModeSelected = "public";
        drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);
      });

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", visConfig.recFirstTextOptionW)
      .attr("y", visConfig.recSecondTextOptionH)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recOptionsTextSize)
      .text("Público");

    superscription.append("text")
      .attr("class", "public-info bold")
      .attr("x", visConfig.recFirstTextOptionW)
      .attr("y", visConfig.recSecondTextOptionH + 20)
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recOptionsTextSize)
      .attr("opacity", 0)
      .text("(em milhões)");

    superscription.append("text")
      .attr("class", "menu-option")
      .attr("x", (visConfig.recOriginW))
      .attr("y", (visConfig.height - visConfig.recGraphXAxisLabelsBottomMargin))
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recGraphLabelsSize)
      .attr("text-anchor", "middle")
      .text("Décadas");

    var subtitleGraph = superscription.append("g")
      .attr("class", "subtitle-graph");

    subtitleGraph.append("text")
      .attr("class", "subtitle-title bold")
      .attr("x", (visConfig.recSubtitleTitleW))
      .attr("y", (visConfig.recSubtitleTitleH))
      .attr("fill", visConfig.recOptionCircleFill)
      .attr("font-size", visConfig.recSubtitleTitleSize)
      .attr("text-anchor", "start")
      .text("Faixa de Público");

    for (var i = 0; i < 5; i++) {

      subtitleGraph.append("circle")
        .attr("class", "circles-subtitles")
        .attr("cx", visConfig.recSubtitleCircleW)
        .attr("cy", visConfig.recSubtitleCircleH + i * visConfig.recSubtitleCircleDist)
        .attr("r", visConfig.recSubtitleCircleRadius)
        .attr("fill", visConfig.recordistsCategories[i].color);

      subtitleGraph.append("text")
        .attr("class", "circles-subtitles")
        .attr("x", (visConfig.recSubtitleTextW))
        .attr("y", (visConfig.recSubtitleTextH + i * visConfig.recSubtitleCircleDist))
        .attr("fill", visConfig.recOptionCircleFill)
        .attr("font-size", visConfig.recSubtitleText)
        .attr("text-anchor", "start")
        .text(visConfig.recordistsCategories[i].text);

    }


    // Start Drawing Axis Base

    var graph = vis.append("g")
      .attr("class", "graph")
      .append("g")
      .attr("class", "axis");

    d3.select("g.graph")
      .append("g")
      .attr("class", "data");

    graph.append("rect")
      .attr("x", visConfig.recOriginW)
      .attr("y", (visConfig.height - visConfig.recOriginBottomMargin - visConfig.recGraphH))
      .attr("width", visConfig.recGraphW)
      .attr("height", visConfig.recGraphH)
      .attr("fill", "white")
      .on("click", function() {
        d3.select("g.movie-detail").remove();
      });


    // Drawing x Axis

    graph.append("line")
      .attr("x1", visConfig.recOriginW)
      .attr("y1", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("x2", (visConfig.recOriginW + visConfig.recGraphW))
      .attr("y2", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("stroke", visConfig.recGraphColor)
      .attr("stroke-width", visConfig.recGraphThickness);


    // Draw y line

    graph.append("line")
      .attr("x1", visConfig.recOriginW)
      .attr("y1", (visConfig.height - visConfig.recOriginBottomMargin))
      .attr("x2", visConfig.recOriginW)
      .attr("y2", (visConfig.height - visConfig.recOriginBottomMargin - visConfig.recGraphH))
      .attr("stroke", visConfig.recGraphColor)
      .attr("stroke-width", visConfig.recGraphThickness);

    var decCount = 0;
    var maxMovieCount = 0;

    for (var decade in visConfig.recordistsData) {
      decCount++;
      for (var year in visConfig.recordistsData[decade]) {
        if (visConfig.recordistsData[decade][year].length > maxMovieCount) {
          maxMovieCount = visConfig.recordistsData[decade][year].length;
        }
      }
    }

    var graphLimit = roundMultPowerTen(maxMovieCount);
    var widthAvailable = visConfig.recGraphW - ((decCount - 1) * visConfig.recGraphDecadeSpacing);
    var widthForDec = widthAvailable / decCount;
    var moviesRadius = visConfig.recGraphH / graphLimit / 2;
    var moviesDistance = (widthForDec - 10*2*moviesRadius)/9;

    for (var decade in visConfig.recordistsData) {

      graph.append("text")
        .attr("class", "light label")
        .attr("x", function() {
          return visConfig.recOriginW + widthForDec/2 + visConfig.decadesIndex[decade] * (widthForDec + visConfig.recGraphDecadeSpacing);
        })
        .attr("y", (visConfig.height - visConfig.recGraphXAxisLabelsBottomMargin))
        .attr("fill", visConfig.recGraphColor)
        .attr("font-size", visConfig.recGraphLabelsSize)
        .attr("text-anchor", "middle")
        .text(function() {
          if (parseInt(decade) <= 20) return "20" + decade;
          return "19" + decade;
        });
        
  }

    function drawYAxisLabels(limit, radius) {

      for (var i = 0; i <= 10; i++) {
        graph.append("text")
          .attr("class", "yaxis-description label")
          .attr("i", i)
          .attr("x", visConfig.recOriginW - visConfig.recGraphYAxisWMargin)
          .attr("y", function() {
            return (visConfig.height - visConfig.recOriginBottomMargin) - i * (limit)/10 * (radius * 2);
          })
          .attr("text-anchor", "end")
          .attr("fill", visConfig.recGraphColor)
          .attr("font-size", visConfig.recGraphLabelsSize)
          .text(function() {
            return i * (limit)/10;
          });
      }

    }

    function drawYAxisLabelsUpdate(maxValue, radius) {

      if (visConfig.recModeSelected === "titles") {
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
              return formatNumber(parseInt(self.attr("i")) * (maxValue)/10);
            });
            d3.selectAll("text.yaxis-description")
            .transition()
            .duration(150)
            .attr("y", function(d,i) {
              return (visConfig.height - visConfig.recOriginBottomMargin) - i * (maxValue)/10 * (radius * 2);
            });
          });
      }

      else {
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
              return formatNumber(parseInt(self.attr("i")) * (maxValue)/10);
            });
            d3.selectAll("text.yaxis-description")
            .transition()
            .duration(150)
            .attr("y", function(d,i) {
              return visConfig.height - visConfig.recOriginBottomMargin - i * (visConfig.recGraphH/10);
            });
          });
      }

    }

    function checkYAxisUpdate(limit, radius) {
      if (!visConfig.recMaxYAxisValue) {

        visConfig.recMaxYAxisValue = limit;
        drawYAxisLabels(limit, radius);

      } else if (visConfig.recMaxYAxisValue != limit) {

        visConfig.recPreviousMaxYAxisValue = visConfig.recMaxYAxisValue;
        visConfig.recMaxYAxisValue = limit;

        drawYAxisLabelsUpdate(visConfig.recMaxYAxisValue, radius);

      } else {

        visConfig.recPreviousMaxYAxisValue = visConfig.recMaxYAxisValue;

      }
    }

    function drawGraph(limit, radius, movDist, decWidth) {

      d3.select("g.graph-draw").remove();

      // 
      function xPositionCirclesAndGuidelines(yearLastDigit, decade, radius, movDist, decWidth) {
        var decIndex = visConfig.decadesIndex[decade];
        var yearIndex = parseInt(yearLastDigit);
        return visConfig.recOriginW + radius +
                decIndex * (visConfig.recGraphDecadeSpacing + decWidth) +
                yearIndex * (movDist + radius*2);
      }

      var draw = d3.select("g.data")
        .append("g")
        .attr("class", "graph-draw");

      for (var decade in visConfig.recordistsData) {
          for (var i = 0; i < 10; i++) {
            draw.append("line")
                  .attr("class", "years-guidelines")
                  .attr("x1", xPositionCirclesAndGuidelines(i, decade, radius, movDist, decWidth))
                  .attr("x2", xPositionCirclesAndGuidelines(i, decade, radius, movDist, decWidth))
                  .attr("y1", visConfig.height - visConfig.recOriginBottomMargin + 10)
                  .attr("y2", visConfig.height - visConfig.recOriginBottomMargin - visConfig.recGraphH)
                  .attr("stroke", "#cccccc")
                  .attr("stroke-width", 0.5);

            draw.append("text")
                  .attr("class", "light label")
                  .attr("x", xPositionCirclesAndGuidelines(i, decade, radius, movDist, decWidth))
                  .attr("y", (visConfig.height - visConfig.recGraphXAxisLabelsBottomMargin - 20))
                  .attr("fill", visConfig.recGraphColor)
                  .attr("font-size", 11)
                  .attr("text-anchor", "middle")
                  .text(function() {
                    return decade[0] + '' + i;
                  });

          }
      }


      if (visConfig.recModeSelected === "titles") {

        var graphLimit = limit;
        checkYAxisUpdate(graphLimit, moviesRadius);

        for (var decade in visConfig.recordistsData) {
          for (var year in visConfig.recordistsData[decade]) {

            visConfig.recordistsData[decade][year].sort(function(a,b) {
              return a["Público"] - b["Público"];
            });
            visConfig.recordistsData[decade][year].forEach(function(movie, movieIndex) {

              draw.append("circle")
                .datum(movie)
                .attr("class", "movie-info")
                .attr("cx", xPositionCirclesAndGuidelines(year[3], decade, radius, movDist, decWidth))
                .attr("cy", function() {
                  return (visConfig.height - visConfig.recOriginBottomMargin - radius) -
                         (radius*2 * movieIndex);
                })
                .attr("r", radius)
                .attr("fill", function() {
                  var p = movie["Público"];
                  if (p > 10000000) {
                    return visConfig.recordistsCategories[0].color;
                  }
                  if (p > 5000000) {
                    return visConfig.recordistsCategories[1].color;
                  }
                  if (p > 2500000) {
                    return visConfig.recordistsCategories[2].color;
                  }
                  if (p > 1000000) {
                    return visConfig.recordistsCategories[3].color;
                  }
                  return visConfig.recordistsCategories[4].color;
                })
                .on("mouseover", function() {
                  var self = d3.select(this);
                  self
                    .transition("grow")
                    .duration(100)
                    .attr("r", radius + 2);
                })
                .on("mouseleave", function() {
                  var self = d3.selectAll("circle.movie-info");
                  self
                    .transition("all-shrink")
                    .duration(100)
                    .attr("r", radius);
                })
                .on("click", function() {
                  d3.select("g.movie-detail").remove();

                  var self = d3.select(this);
                  var center = [parseFloat(self.attr("cx")), parseFloat(self.attr("cy"))];

                  var details = draw.append("g")
                    .attr("class", "movie-detail");

                  var background = details.append("rect")
                    .attr("class", "details-background")
                    .attr("x", center[0])
                    .attr("y", center[1])
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("height", 0)
                    .attr("width", 0)
                    .attr("opacity", 0);

                  var maxWidth = 0;
                  var width,
                      height = 0;

                  var detailsText1 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("Título: " + movie["Título"]);

                  width = detailsText1.node().getBBox().width;
                  height += detailsText1.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  var detailsText2 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("UF: " + movie["UF"]);

                  width = detailsText2.node().getBBox().width;
                  height += detailsText2.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  var detailsText3 = details.append("text")
                    .attr("class", "movie-detail")
                    .attr("fill", "black")
                    .attr("font-size", visConfig.recDetailsTextSize)
                    .attr("opacity", 0)
                    .text("Público: " + formatNumber(movie["Público"]));

                  width = detailsText3.node().getBBox().width;
                  height += detailsText3.node().getBBox().height;
                  maxWidth = (width > maxWidth) ? width : maxWidth;

                  background.attr("x", function() {
                        if (center[0] > (visConfig.recOriginW + visConfig.recGraphW/2)) return center[0] - maxWidth - visConfig.recDetailsTotalPadding;
                        return center[0];
                      })
                      .attr("y", center[1] - (height + 2*visConfig.recDetailsTextMargin))
                      .attr("width", maxWidth + visConfig.recDetailsTotalPadding)
                      .attr("height", (height + 2*visConfig.recDetailsTextMargin))
                      .attr("fill", visConfig.recDetailsRectColor)
                      .transition()
                      .duration(100)
                      .attr("opacity", 0.7);


                   detailsText3.attr("y", center[1] - visConfig.recDetailsTextMargin - 0.7*visConfig.recDetailsTextMargin);
                   detailsText2.attr("y", function() {
                     return center[1] - visConfig.recDetailsTextMargin -
                            0.7*visConfig.recDetailsTextMargin -
                            detailsText3.node().getBBox().height;
                   });
                   detailsText1.attr("y", function() {
                     return center[1] - visConfig.recDetailsTextMargin -
                            0.7*visConfig.recDetailsTextMargin -
                            detailsText3.node().getBBox().height -
                            detailsText2.node().getBBox().height;
                   })

                   d3.selectAll("text.movie-detail").attr("class", "movie-detail bold").attr("x", function() {
                     if (center[0] > (visConfig.recOriginW + visConfig.recGraphW/2)) return center[0] - maxWidth - visConfig.recDetailsTotalPadding/2;
                     return center[0] + visConfig.recDetailsTotalPadding/2;
                   })
                   .transition()
                   .duration(100)
                   .delay(50)
                   .attr("opacity", 1);
                })
                .attr("opacity", 0)
                .transition()
                .duration(50)
                .delay(function() {
                  var yearIndex = parseInt(year[3]);
                  return 50 + movieIndex * 10;
                })
                .attr("opacity", 1);

            });
          }
        }

      } else {

        var maxPublic = 0;
        for (var decade in visConfig.recordistsData) {
          for (var year in visConfig.recordistsData[decade]) {
            var yearSum = 0;
            visConfig.recordistsData[decade][year].forEach(function(movie) {
              yearSum += movie["Público"];
            });
            if (maxPublic < yearSum) maxPublic = yearSum;

            var graphLimit = roundMultPowerTen(maxPublic);

            checkYAxisUpdate(graphLimit/1000000, radius);

            draw.append("rect")
              .attr("class", "year-info")
              .attr("x", function() {
                var decIndex = visConfig.decadesIndex[decade];
                var yearIndex = parseInt(year[3]);
                return visConfig.recOriginW +
                       decIndex * (visConfig.recGraphDecadeSpacing + decWidth) +
                       yearIndex * (movDist + radius*2);
              })
              .attr("width", (radius * 2))
              .attr("fill", "#46757F")
              .attr("y", function() {
                return (visConfig.height - visConfig.recOriginBottomMargin);
              })
              .attr("height", 0)
              .transition()
              .duration(600)
              .attr("y", function() {
                return (visConfig.height - visConfig.recOriginBottomMargin) - yearSum * visConfig.recGraphH / graphLimit;
              })
              .attr("height", function() {
                return yearSum * visConfig.recGraphH / graphLimit;
              });

          }
        }
      }

    }

    drawGraph(graphLimit, moviesRadius, moviesDistance, widthForDec);

    scaleVis(ratio);
  }

}
