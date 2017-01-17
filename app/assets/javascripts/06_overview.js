function createVisOverview(userWindowWidth) {

  if (visConfig.dataCircles === undefined) {
    d3.json("js/data.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.data = json;
      visConfig.dataCircles = returnCirclesData(visConfig.data);
      createVis();
      visConfig.dataHighlight = returnMoviesData(visConfig.data);
    });
  } else {
    createVis();
    visConfig.dataHighlight = returnMoviesData(visConfig.data);
  }

  function createVis() {

    deleteVis();

    var dragX = d3.behavior.drag()
        .on("drag", function() {
            var dx = d3.event.x,
                self = d3.select(this);

            self.attr('grab', 'yes');

            var index = testXPosition(dx);
            index = (index < 0) ? 0 : (index > 11) ? 11 : index;

            var selfCurrentMonth = parseInt(self.attr("currentmonth"));
            moveSelfX(dx, selfCurrentMonth, 0);

            if (index > selfCurrentMonth) {
              moveOthersX((index-1), index, selfCurrentMonth);
            } else if (index < selfCurrentMonth) {
              moveOthersX((index+1), index, selfCurrentMonth);
            }
          })
          .on("dragend", function() {

            var self = d3.select(this);
            self.attr('grab', 'no');
            var x = returnXPosition(parseInt(self.attr("currentmonth")));
            var selfCurrentMonth = self.attr("currentmonth");

            moveSelfX(x, selfCurrentMonth, visConfig.monthMovingDuration);

          });

      var dragY = d3.behavior.drag()
          .on("drag", function() {
              var dy = d3.event.y,
                  self = d3.select(this);

              var index = testYPosition(dy);
              index = (index < 0) ? 0 : (index > 5) ? 5 : index;

              var selfCurrentYear = parseInt(self.attr("currentyear"));

              moveSelfY(dy, selfCurrentYear, 0);

              if (index > selfCurrentYear) {
                  moveOthersY((index-1), index, selfCurrentYear);
              } else if (index < selfCurrentYear) {
                  moveOthersY((index+1), index, selfCurrentYear);
              }
          })
          .on("dragend", function() {

              var self = d3.select(this);
              var y = returnYPosition(parseInt(self.attr("currentyear")));
              var selfCurrentYear = self.attr("currentyear");

              moveSelfY(y, selfCurrentYear, visConfig.monthMovingDuration);
          });

    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var maxDataCirclesTitles = returnMaxDataCircles(visConfig.dataCircles, "Títulos"),
        minDataCirclesTitles = returnMinDataCircles(visConfig.dataCircles, "Títulos"),
        maxDataCirclesPublic = returnMaxDataCircles(visConfig.dataCircles, "Público"),
        minDataCirclesPublic = returnMinDataCircles(visConfig.dataCircles, "Público");

    var fillScale = d3.scale
      .linear()
      .domain([minDataCirclesPublic,
        ((maxDataCirclesPublic-minDataCirclesPublic)/2 + minDataCirclesPublic),
        maxDataCirclesPublic])
      .range([visConfig.scaleInitialColor,
              visConfig.scaleIntermColor,
              visConfig.scaleFinalColor]);

    var gradient = vis.append("linearGradient")
      .attr("id", "gradient")
      .attr("y1", "0%")
      .attr("y2", "0%")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("spreadMethod", "pad")

    gradient.append("stop")
        .attr("offset", "0")
        .attr("stop-color", visConfig.scaleInitialColor);

    gradient.append("stop")
      .attr("offset", "0.5")
      .attr("stop-color", visConfig.scaleIntermColor);

    gradient.append("stop")
        .attr("offset", "1")
        .attr("stop-color", visConfig.scaleFinalColor);

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
      .text("As variações do cinema no Brasil");

    superscription.append("text")
      .attr("class", "title-description")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("Público e número de títulos mensais");

    superscription.append("text")
      .attr("class", "title-description")
      .attr("x", function() {
        return returnXPosition(10);
      })
      .attr("y", function() {
        return visConfig.superHMargin + visConfig.superTextSize;
      })
      .attr("text-anchor", "middle")
      .attr("fill", visConfig.superSubSubTextColor)
      .attr("font-size", visConfig.superSubSubtextSize)
      .text("Títulos no mês");

    superscription.append("text")
      .attr("class", "title-description")
      .attr("x", function() {
        return returnXPosition(10);
      })
      .attr("y", function() {
        return visConfig.superHMargin/2 + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize;
      })
      .attr("text-anchor", "middle")
      .attr("fill", visConfig.superSubSubTextColor)
      .attr("font-size", visConfig.superSubSubtextSize)
      .text(function() {
        return minDataCirclesTitles + " a " + maxDataCirclesTitles;
      });

    superscription.append("text")
      .attr("class", "title-description")
      .attr("x", function() {
        return returnXPosition(11);
      })
      .attr("y", function() {
        return visConfig.superHMargin + visConfig.superTextSize;
      })
      .attr("text-anchor", "middle")
      .attr("fill", visConfig.superSubSubTextColor)
      .attr("font-size", visConfig.superSubSubtextSize)
      .text("Público no mês");

    superscription.append("text")
      .attr("class", "title-description")
      .attr("x", function() {
        return returnXPosition(11);
      })
      .attr("y", function() {
        return visConfig.superHMargin/2 + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize;
      })
      .attr("text-anchor", "middle")
      .attr("fill", visConfig.superSubSubTextColor)
      .attr("font-size", visConfig.superSubSubtextSize)
      .text(function() {
        var million = 1000000;
        return (minDataCirclesPublic/million).toFixed(1) + " a " + (maxDataCirclesPublic/million).toFixed(1) + " milhões";
      });

    superscription.append("circle")
      .attr("cx", function() {
        return returnXPosition(10) - visConfig.circleBiggerRadius/2;
      })
      .attr("cy", function() {
        return visConfig.superHMargin + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize + 15;
      })
      .attr("r", 4)
      .attr("fill", visConfig.monthBoxColor);

    superscription.append("circle")
      .attr("cx", function() {
        return returnXPosition(10);
      })
      .attr("cy", function() {
        return visConfig.superHMargin + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize + 15;
      })
      .attr("r", 6)
      .attr("fill", visConfig.monthBoxColor);

    superscription.append("circle")
      .attr("cx", function() {
        return returnXPosition(10) + visConfig.circleBiggerRadius/2;
      })
      .attr("cy", function() {
        return visConfig.superHMargin + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize + 15;
      })
      .attr("r", 8)
      .attr("fill", visConfig.monthBoxColor);

    superscription.append("rect")
      .attr("x", function() {
        return returnXPosition(11) - visConfig.circleBiggerRadius;
      })
      .attr("y", function() {
        return visConfig.superHMargin + visConfig.superHMargin + visConfig.superTextSize + visConfig.superSubSubtextSize + 7;
      })
      .attr("width", visConfig.circleBiggerRadius*2)
      .attr("height", 16)
      .attr("fill", "url(#gradient)");

    var visGuideLines = vis.append("g")
      .attr("class", "guidelines");

    for (var month in visConfig.months) {
      visGuideLines.append("line")
        .attr("x1", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y1", function() {
          return visConfig.hMonthMargin + 2*visConfig.hMonthBox;
        })
        .attr("x2", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y2", function() {
          return visConfig.height - visConfig.hBottomMargin;
        })
        .attr("stroke", visConfig.verticalGuidelineHexValue)
        .attr("stroke-width", visConfig.guidelineStrokeWidth)
        .attr("originalmonth", month)
        .attr("currentmonth", month);
    }

    for (var year in visConfig.dataCircles) {
      visGuideLines.append("line")
        .attr("x1", function() {
          return visConfig.wLeftMargin;
        })
        .attr("y1", function() {
          return returnYPosition(visConfig.years[year]);
        })
        .attr("x2", function() {
          return visConfig.width - visConfig.wRightMargin;
        })
        .attr("y2", function() {
          return returnYPosition(visConfig.years[year]);
        })
        .attr("stroke", visConfig.horizontalGuidelineHexValue)
        .attr("stroke-width", visConfig.guidelineStrokeWidth)
        .attr("originalyear", year)
        .attr("currentyear", year);
    }

    var visMonths = vis.append("g")
      .attr("class", "monthBoxes");

    for (var month in visConfig.months) {

      visMonths.append("rect")
        .attr("class", "month month-button")
        .attr("x", function() {
          return returnXPosition(parseInt(month)) - visConfig.circleBiggerRadius - visConfig.wMonthBoxExtra;
        })
        .attr("y", visConfig.hMonthMargin)
        .attr("rx", visConfig.monthBoxRadius)
        .attr("ry", visConfig.monthBoxRadius)
        .attr("width", (visConfig.circleBiggerRadius + visConfig.wMonthBoxExtra)*2)
        .attr("height", visConfig.hMonthBox)
        .attr("fill", visConfig.monthBoxColor)
        .attr("originalmonth", month)
        .attr("currentmonth", month);

      visMonths.append("text")
        .attr("class", "month bold")
        .attr("x", function() {
          return returnXPosition(parseInt(month));
        })
        .attr("y", function() {
          return visConfig.hMonthMargin + visConfig.hMonthBox - 5;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-size", visConfig.monthBoxTextSize)
        .text(visConfig.months[month])
        .attr("originalmonth", month)
        .attr("currentmonth", month);

      visMonths.append("rect")
        .attr("class", "month")
        .attr("x", function() {
          return returnXPosition(parseInt(month)) - visConfig.circleBiggerRadius - visConfig.wMonthBoxExtra;
        })
        .attr("y", visConfig.hMonthMargin)
        .attr("width", (visConfig.circleBiggerRadius*2))
        .attr("height", visConfig.hMonthBox)
        .attr("fill", "transparent")
        .attr("originalmonth", month)
        .attr("currentmonth", month)
        .on("mouseover", function() {
          d3.select("rect.month-button[currentmonth='" + d3.select(this).attr('currentmonth') + "']")
            .attr('fill', visConfig.monthBoxHoverColor);        
        })
        .on("mouseout", function() {
          d3.select("rect.month-button[currentmonth='" + d3.select(this).attr('currentmonth') + "']")
            .attr('fill', visConfig.monthBoxColor);          
        })
        .call(dragX);

    }

    for (var year in visConfig.dataCircles) {
      var visYear = vis.append("g")
        .attr("class", year);

      for (var month in visConfig.dataCircles[year]) {
        var cx, cy;
        visYear.append("circle")
          .attr("class", "year-month _" + month + year)
          .attr("cx", function () {
            return returnXPosition(parseInt(month) - 1);
          })
          .attr("cy", function() {
            return returnYPosition(visConfig.years[year]);
          })
          .attr("r", function() {
            var rangeVal = maxDataCirclesTitles - minDataCirclesTitles;
            var rangeRadius = visConfig.circleBiggerRadius - visConfig.circleSmallerRadius;
            return visConfig.circleSmallerRadius + (visConfig.dataCircles[year][month]["Títulos"] - minDataCirclesTitles)*rangeRadius/rangeVal;
          })
          .attr("titulos", visConfig.dataCircles[year][month]["Títulos"])
          .attr("publico", visConfig.dataCircles[year][month]["Público"])
          .attr("year", year)
          .attr("month", month)
          .attr("originalmonth", (month-1))
          .attr("currentmonth", (month-1))
          .attr("originalyear", visConfig.years[year])
          .attr("currentyear", visConfig.years[year])
          .attr("fill", fillScale(visConfig.dataCircles[year][month]["Público"]))
          .on("click", function() {
            var self = d3.select(this);
            monthHighlight(self.attr("month"), self.attr("year"));
          })
          .on("mouseover", function() {
            var self = d3.select(this);
            self.attr("stroke", visConfig.ovrStrokeCircleColor).attr("stroke-width", visConfig.ovrStrokeCircleW);
          })
          .on("mouseleave", function() {
            var self = d3.select(this);
            self.attr("stroke", "transparent").attr("stroke-width", 0);
          })
          .attr("opacity", 0)
          .transition("opacity")
          .duration(350)
          .delay((25 * 12 * visConfig.years[year]) + (25 * (parseInt(month) - 1)))
          .attr("opacity", 1);
      }

      visYear.append("rect")
        .attr("class", "year year-button")
        .attr("x", visConfig.wYearRectMargin)
        .attr("y", returnYPosition(visConfig.years[year]) + (visConfig.yearTextSize/3) - visConfig.yearTextSize)
        .attr("width", visConfig.yearRectWidth)
        .attr("height", visConfig.yearRectHeight)
        .attr("rx", visConfig.monthBoxRadius)
        .attr("ry", visConfig.monthBoxRadius)
        .attr("originalyear", visConfig.years[year])
        .attr("currentyear", visConfig.years[year])
        .attr("fill", visConfig.monthBoxColor);

      visYear.append("text")
        .attr("class", "year bold")
        .attr("x", function() {
          return visConfig.wYearMargin;
        })
        .attr("y", function() {
          return returnYPosition(visConfig.years[year]) + (visConfig.yearTextSize/3);
        })
        .attr("text-anchor", "middle")
        .attr("font-size", visConfig.yearTextSize)
        .attr("fill", "#FFFFFF")
        .text(year)
        .attr("originalyear", visConfig.years[year])
        .attr("currentyear", visConfig.years[year]);

      visYear.append("rect")
        .attr("class", "year")
        .attr("x", visConfig.wYearRectMargin)
        .attr("y", returnYPosition(visConfig.years[year]) + (visConfig.yearTextSize/3) - 16)
        .attr("width", visConfig.yearRectWidth)
        .attr("height", visConfig.yearRectHeight)
        .attr("rx", visConfig.monthBoxRadius)
        .attr("ry", visConfig.monthBoxRadius)
        .attr("originalyear", visConfig.years[year])
        .attr("currentyear", visConfig.years[year])
        .attr("fill", "transparent")
        .on("mouseover", function() {
          d3.select("rect.year-button[currentyear='" + d3.select(this).attr('currentyear') + "']")
            .attr('fill', visConfig.monthBoxHoverColor);        
        })
        .on("mouseout", function() {
          d3.select("rect.year-button[currentyear='" + d3.select(this).attr('currentyear') + "']")
            .attr('fill', visConfig.monthBoxColor);          
        })
        .call(dragY);

    }

    scaleVis(scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth));

  }

  function monthHighlight(month, year) {
    var visBox = d3.select("g.vis")
      .append("g")
      .attr("class", "lightbox");

    visBox.append("rect")
      .attr("id", "lightbox")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", visConfig.width)
      .attr("height", visConfig.height)
      .attr("fill", "black")
      .attr("opacity", 0)
      .on("click", removeHighlight)
      .transition()
      .duration(500)
      .attr("opacity", 0.3);

    visBox.append("rect")
      .attr("class", "highlight")
      .attr("x", function() {
        return visConfig.width/2 - visConfig.wMonthHighlight/2;
      })
      .attr("y", function() {
        return visConfig.height/2 - visConfig.hMonthHighlight/2;
      })
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("width", function() {
        return visConfig.wMonthHighlight;
      })
      .attr("height", function() {
        return visConfig.hMonthHighlight;
      })
      .attr("fill", "white")
      .attr("opacity", 0)
      .transition()
      .delay(300)
      .duration(500)
      .attr("opacity", 1);

    var visBoxX = parseFloat(d3.select("rect.highlight").attr("x"));
    var visBoxY = parseFloat(d3.select("rect.highlight").attr("y"));

    visBox.append("text")
      .attr("class", "header bold")
      .attr("id", "header1")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightTitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightTitleH;
      })
      .attr("font-size", visConfig.ovrHighlightTitleSize)
      .attr("text-anchor", "start")
      .text(function() {
        return visConfig.months[parseInt(month)-1] + " de " + year;
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "close")
      .attr("id", "close")
      .attr("x", function() {
        return visBoxX + visConfig.wMonthHighlight - visConfig.ovrHighlightTitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightTitleH;
      })
      .attr("font-size", visConfig.ovrHighlightTitleSize)
      .attr("text-anchor", "end")
      .text("x")
      .attr("opacity", 0)
      .on("click", function() {
        removeHighlight();
      })
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("line")
      .attr("class", "highlight-division")
      .attr("id", "line1")
      .attr("x1", function() {
        return visBoxX + visConfig.ovrHighlightLineW;
      })
      .attr("y1", function() {
        return visBoxY + visConfig.ovrHighlightLineH;
      })
      .attr("x2", function() {
        return visBoxX + visConfig.wMonthHighlight - visConfig.ovrHighlightLineW;
      })
      .attr("y2", function() {
        return visBoxY + visConfig.ovrHighlightLineH;
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightOvrDetail1W;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightOvrDetailH;
      })
      .attr("font-size", visConfig.ovrHighlightOvrDetailSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Total de público: " + formatNumber(visConfig.dataCircles[year][month]["Público"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightOvrDetail2W;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightOvrDetailH;
      })
      .attr("font-size", visConfig.ovrHighlightOvrDetailSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Total de renda: R$" + formatNumber(visConfig.dataCircles[year][month]["Renda"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "header bold")
      .attr("id", "header2")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightSubtitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightSubtitleH;
      })
      .attr("font-size", visConfig.ovrHighlightSubtitleSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Ranking dos mais vistos entre os " + visConfig.dataCircles[year][month]["Títulos"] + " lançados";
      })
      .attr("opacity", 0)
      .transition()
      .delay(700)
      .duration(300)
      .attr("opacity", 1);

    for (var i = 0; i < 5; i++) {
      visBox.append("circle")
        .attr("class", "movies-ranking")
        .attr("id", "ranked-movie-" + i)
        .attr("cx", function() {
          var position = (visConfig.wMonthHighlight - 2*visConfig.ovrHighlightTitleW - 2*visConfig.ovrHighlightBiggerRadius) / 4;
          return visBoxX + visConfig.wHighlightMargin + visConfig.circleRankingBiggerRadius + (position * i);
        })
        .attr("cy", function() {
          return visBoxY + visConfig.ovrHighlightCircleH;
        })
        .attr("r", function() {
          var max = visConfig.dataHighlight[year][parseInt(month)-1][0]["Público"];
          var min = visConfig.dataHighlight[year][parseInt(month)-1][4]["Público"];
          var rangeVal = max - min;
          var rangeRadius = visConfig.ovrHighlightBiggerRadius - visConfig.ovrHighlightSmallerRadius;
          return visConfig.ovrHighlightSmallerRadius + (visConfig.dataHighlight[year][parseInt(month)-1][i]["Público"] - min)*rangeRadius/rangeVal;
        })
        .attr("i", i)
        .attr("originalmonth", month)
        .attr("originalyear", year)
        .attr("fill", visConfig.ovrHighlightCircleColor)
        .attr("opacity", 0)
        .on("mouseover", function() {
          var self = d3.select(this);
          self.attr("stroke", visConfig.ovrStrokeCircleColor).attr("stroke-width", 5);
        })
        .on("mouseleave", function() {
          var self = d3.select(this);
          self.attr("stroke", "transparent").attr("stroke-width", 0);
        })
        .on("click", function() {
          var self = d3.select(this);
          var index = parseInt(self.attr("i"));
          showFilmDetail(index, self, self.attr("originalmonth"), self.attr("originalyear"));
        })
        .transition()
        .delay(700)
        .duration(300)
        .attr("opacity", 0.3)
        .each("end", function() {
          var index0 = d3.select("circle#ranked-movie-0");
          showFilmDetail(0, index0, index0.attr("originalmonth"), index0.attr("originalyear"));
        });
    }

  }

  function showFilmDetail(index, referenceCircle, month, year) {

    d3.select("g.movie-info").remove();

    d3.selectAll("circle.movies-ranking").attr("opacity", 0.3);
    referenceCircle.attr("opacity", 1);


    var visBox = d3.select("g.lightbox")
      .append("g")
      .attr("class", "movie-info");

    var visBoxX = parseFloat(d3.select("rect.highlight").attr("x"));
    var visBoxY = parseFloat(d3.select("rect.highlight").attr("y"));

    visBox.append("text")
      .attr("class", "header")
      .attr("id", "header3")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightMovieTitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightMovieTitleH;
      })
      .attr("font-size", visConfig.ovrHighlightInfoTitleSize)
      .attr("text-anchor", "start")
      .text(function() {
        return visConfig.dataHighlight[year][parseInt(month)-1][index]["Título"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightMovieTitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightMovieGenreH;
      })
      .attr("font-size", visConfig.ovrHighlightInfoSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Gênero: " + visConfig.dataHighlight[year][parseInt(month)-1][index]["Gênero"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightMovieTitleW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightMovieNationH;
      })
      .attr("font-size", visConfig.ovrHighlightInfoSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "País: " + visConfig.dataHighlight[year][parseInt(month)-1][index]["País"];
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightMoviePublicW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightMovieGenreH;
      })
      .attr("font-size", visConfig.ovrHighlightInfoSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Público: " + formatNumber(visConfig.dataHighlight[year][parseInt(month)-1][index]["Público"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);

    visBox.append("text")
      .attr("class", "info")
      .attr("x", function() {
        return visBoxX + visConfig.ovrHighlightMoviePublicW;
      })
      .attr("y", function() {
        return visBoxY + visConfig.ovrHighlightMovieNationH;
      })
      .attr("font-size", visConfig.ovrHighlightInfoSize)
      .attr("text-anchor", "start")
      .text(function() {
        return "Renda: R$" + formatNumber(visConfig.dataHighlight[year][parseInt(month)-1][index]["Renda"]);
      })
      .attr("opacity", 0)
      .transition()
      .delay(200)
      .duration(300)
      .attr("opacity", 1);


  }

  function removeHighlight() {
    d3.select("g.lightbox").remove();
  }

}
