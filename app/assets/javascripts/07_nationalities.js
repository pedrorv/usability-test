function createVisNationalities(userWindowWidth) {

  if (visConfig.countries === undefined) {
    d3.json("js/countries-and-continents.json", function(error, json) {
      if (error) return console.warn(error);
      visConfig.countries = json;

      d3.json("js/nationalities-vis-data.json", function(error2, json2) {
        if (error2) return console.warn(error2);
        visConfig.datasetGraphAux = json2;
        createVis();
      });

    });
  } else {
    createVis();
  }

  function createVis() {

    deleteVis();

    // Initial state of vis
    for (var continent in visConfig.continentsFilter) {
      visConfig.continentsFilter[continent] = true;
    }

    visConfig.natYearSelected = "2009";
    visConfig.publicFilter = {
      min: 0,
      max: Infinity
    };
    visConfig.natPreviousYearSelected = undefined;
    visConfig.natCountrySelected = undefined;


    var vis = d3.select("svg.vis")
      .append("g")
      .attr("class", "vis");

    var ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);

    // Rect used to set all opacities to 1 
    vis.append("rect")
       .attr("x", 0)
       .attr("y", 0)
       .attr("width", visConfig.width)
       .attr("height", visConfig.height)
       .attr("fill", "#FFFFFF")
       .on("click", function() {
         d3.selectAll("path.country-path").attr("opacity", 1);
         d3.selectAll("rect.country-bar").attr("opacity", 1);
         removeTextsCountry();
         visConfig.natCountrySelected = undefined;
       });

    var superscription = vis.append("g")
      .attr("class", "superscription");

    // Vis Title

    superscription.append("text")
      .attr("class", "title")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisTitleSize)
      .attr("font-weight", "bold")
      .text("Nacionalidades exibidas no Brasil");

    // Vis Subtitle

    superscription.append("text")
      .attr("class", "subtitle")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.baseHMarginVisSubTitle)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisTitlesColors)
      .attr("font-size", visConfig.baseVisSubtitle)
      .text("De 2009 a 2014");

    var menuFilters = vis.append("g")
      .attr("class", "menu-filters");

    // Fist menu filter title

    menuFilters.append("text")
      .attr("class", "subtitle bold")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.natMenuFirstTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisMenusColors)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Selecionar continentes");

    // Second menu filter title

    menuFilters.append("text")
      .attr("class", "subtitle bold")
      .attr("x", visConfig.baseWMargin)
      .attr("y", visConfig.natMenuSecondTitleH)
      .attr("text-anchor", "start")
      .attr("fill", visConfig.baseVisMenusColors)
      .attr("font-size", visConfig.natMenuTitlesSize)
      .text("Filtrar por média de público");


    // Filter Menu

    for (var i = 0; i < 6; i++) {

      // Squares for first selection

      menuFilters.append("rect")
        .attr("class", "continent-selector light")
        .attr("r", visConfig.natMenuCirclesRadius)
        .attr("i", i)
        .attr("x", function() {
          return visConfig.baseWMargin + (i*visConfig.natMenuWDistance);
        })
        .attr("y", (visConfig.natOptionsSquareH - visConfig.natOptionsSquareSide))
        .attr("width", visConfig.natOptionsSquareSide)
        .attr("height", visConfig.natOptionsSquareSide)
        .attr("fill", function() {
          return visConfig.continentsColors[visConfig.continentsArr[i]];
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("rx", visConfig.menusCheckBoxRadius)
        .attr("ry", visConfig.menusCheckBoxRadius)
        .on("click", function() {
          var self = d3.select(this);
          var continent = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? visConfig.continentsColors[visConfig.continentsArr[continent]] : "white";
          });
          visConfig.continentsFilter[visConfig.continentsArr[continent]] = !visConfig.continentsFilter[visConfig.continentsArr[continent]];
          
          configuration = calculateParameters();

          try {
            if (visConfig.countries[visConfig.natCountrySelected]['continente'] === visConfig.continentsArr[continent] && !visConfig.continentsFilter[visConfig.continentsArr[continent]]) {
              visConfig.natCountrySelected = undefined;
              removeTextsCountry();
              removeWarning();
            }
          } catch (e) {}

          updateGraph();
        })
        .on("mouseover", function() {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("mouseout", function() {
          d3.selectAll("rect.continent-selector").attr("stroke-width", 1);
        });

      // Texts for first selection

      menuFilters.append("text")
        .attr("class", "subtitle")
        .attr("x", function() {
          return visConfig.natFirstOptionsTextW + (i*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natFirstOptionsTextH)
        .attr("text-anchor", "start")
        .attr("fill", visConfig.baseVisMenusColors)
        .attr("font-size", visConfig.natFirstOptionsTextSize)
        .text(visConfig.continentsArr[i]);


      // Circles for second selection

      menuFilters.append("circle")
        .attr("class", "value-selector")
        .attr("i", i)
        .attr("r", visConfig.natOptionsCircleRadius)
        .attr("cx", function() {
          return visConfig.natOptionsCircleCenterW + (i*visConfig.natMenuWDistance);
        })
        .attr("cy", visConfig.natOptionsCircleCenterH)
        .attr("fill", function() {
          if (i !== 5) return "white";
          return "black";
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .on("click", function() {
          d3.selectAll("circle.value-selector").attr("fill", "white");
          var self = d3.select(this);
          var publicFilter = parseInt(self.attr("i"));
          self.attr("fill", function() {
            return (self.attr("fill") == "white") ? "black" : "white";
          });
          visConfig.publicFilter.min = visConfig.publicFilterOptions[publicFilter].min;
          visConfig.publicFilter.max = visConfig.publicFilterOptions[publicFilter].max;

          configuration = calculateParameters();
          updateGraph();
        })
        .on("mouseover", function() {
          d3.select(this).attr("stroke-width", 2);
        })
        .on("mouseout", function() {
          d3.selectAll("circle.value-selector").attr("stroke-width", 1);
        });

      // Texts for second selection

      menuFilters.append("text")
        .attr("class", "subtitle light")
        .attr("x", function() {
          return visConfig.natSecondOptionsTextW + (i*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natSecondOptionsTextH)
        .attr("text-anchor", "start")
        .attr("fill", visConfig.baseVisMenusColors)
        .attr("font-size", visConfig.natFirstOptionsTextSize)
        .text(function() {
          return visConfig.publicFilterOptions[i].text;
        });

    }

    for (var year in visConfig.years) {

      menuFilters.append("text")
        .attr("class", function() {
          if (year == 2009) return "year-selector bold";
          return "year-selector light";
        })
        .attr("id", "y" + year)
        .attr("year", year)
        .attr("x", function() {
          return visConfig.natMenuYearsW + (visConfig.years[year]*visConfig.natMenuWDistance);
        })
        .attr("y", visConfig.natMenuYearsH)
        .attr("text-anchor", "middle")
        .attr("fill", function() {
          if (year == 2009) return visConfig.natMenuYearsColorSelected;
          return visConfig.natMenuYearsColorNotSelected;
        })
        .attr("font-size", visConfig.natMenuYearsSize)
        .text(year)
        .on("click", function() {
          d3.selectAll("text.year-selector").classed("bold", false).classed("light", true).attr("fill", visConfig.natMenuYearsColorNotSelected);

          var self = d3.select(this);
          self.classed("light", false).classed("bold", true).attr("fill", visConfig.natMenuYearsColorSelected);

          visConfig.natPreviousYearSelected = visConfig.natYearSelected;
          visConfig.natYearSelected = self.attr("year");
          moveYearIndicator();

          configuration = calculateParameters();
          updateGraph();
        })

    }

    // Continent line

    menuFilters.append("line")
      .attr("x1", visConfig.natDivisionLineW)
      .attr("y1", visConfig.natDivisionLineH)
      .attr("x2", visConfig.natDivisionLineW + visConfig.natDivisionLineSize)
      .attr("y2", visConfig.natDivisionLineH)
      .attr("stroke", visConfig.natDivisionLineColor)
      .attr("stroke-width", visConfig.natDivisionLineThickness);

    menuFilters.append("rect")
      .attr("class", "year-indicator")
      .attr("x", visConfig.natYearIndicatorW - visConfig.natYearIndicatorSize/2)
      .attr("y", visConfig.natYearIndicatorH)
      .attr("width", visConfig.natYearIndicatorSize)
      .attr("height", visConfig.natYearIndicatorThickness)
      .attr("fill", visConfig.natYearIndicatorColor);


    // Play/Pause Controllers

    menuFilters.append("path")
      .attr("class", "play-button")
      .attr("d", function() {
        var str = "";
        str += "M " + visConfig.baseWMargin + " " + visConfig.natPlayButtonStartH + " ";
        str += "L " + (visConfig.baseWMargin + (Math.cos(toRadians(30)) * visConfig.natPlayButtonSize)) + " " +
                      (visConfig.natPlayButtonStartH - (Math.cos(toRadians(60)) * visConfig.natPlayButtonSize)) + " ";
        str += "L " + visConfig.baseWMargin + " " + (visConfig.natPlayButtonStartH - visConfig.natPlayButtonSize) + " Z";
        return str;
      })
      .attr("fill", visConfig.natPlayButtonColor)
      .attr("stroke", visConfig.natPlayButtonColor)
      .attr("stroke-width", 0)
      .attr("opacity", visConfig.natAnimationNotSelectedOpacity)
      .on("click", timeAnimation)
      .on("mouseover", function() {
        d3.select(this).attr("stroke-width", 2);
      })
      .on("mouseout", function() {
        d3.select("path.play-button").attr("stroke-width", 0);
      });

    menuFilters.append("rect")
      .attr("class", "pause-button pause-visible")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", visConfig.natPauseButtonW)
      .attr("stroke", visConfig.natPlayButtonColor)
      .attr("stroke-width", 0)
      .attr("width", visConfig.natPauseButtonWidthSize)
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", visConfig.natPlayButtonColor);

    menuFilters.append("rect")
      .attr("class", "pause-button pause-visible")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", (visConfig.natPauseButtonW + visConfig.natPauseButtonWidthSize + visConfig.natPauseButtonDivision))
      .attr("stroke", visConfig.natPlayButtonColor)
      .attr("stroke-width", 0)
      .attr("width", visConfig.natPauseButtonWidthSize)
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", visConfig.natPlayButtonColor);

    menuFilters.append("rect")
      .attr("class", "pause-button")
      .attr("y", visConfig.natPauseButtonH)
      .attr("x", visConfig.natPauseButtonW)
      .attr("width", (2*visConfig.natPauseButtonWidthSize + visConfig.natPauseButtonDivision))
      .attr("height", visConfig.natPauseButtonHeight)
      .attr("fill", "transparent")
      .on("click", function() {
        clearInterval(visConfig.animationTimer);
        d3.select("path.play-button").attr("opacity", visConfig.natAnimationNotSelectedOpacity);
        d3.selectAll("rect.pause-button").attr("opacity", 1);
        moveYearIndicator();
      })
      .on("mouseover", function() {
        d3.selectAll("rect.pause-visible").attr("stroke-width", 2);
      })
      .on("mouseout", function() {
        d3.selectAll("rect.pause-visible").attr("stroke-width", 0);
      });

    var configuration = calculateParameters();

    drawGraph();
    
    function timeAnimation() {
      clearInterval(visConfig.animationTimer);
      d3.select("path.play-button").attr("opacity", 1);
      d3.selectAll("rect.pause-button").attr("opacity", visConfig.natAnimationNotSelectedOpacity);

      visConfig.animationTimer = setInterval(function () {
        var year = parseInt(visConfig.natYearSelected) + 1;
        year = (year === 2015) ? 2009 : year;
    
        visConfig.natPreviousYearSelected = visConfig.natYearSelected;
        visConfig.natYearSelected = "" + year;
        d3.selectAll("text.year-selector").classed("bold", false);
        d3.select("#y" + year).classed("light", false).classed("bold", true);

        
        moveYearIndicator();

        configuration = calculateParameters();
        updateGraph();
      }, 6000);
    }

    function moveYearIndicator() {
      d3.select("rect.year-indicator")
        .transition('changing-year')
        .duration(300)
        .attr("x", function() {
          return visConfig.natYearIndicatorW + 
                 visConfig.years[visConfig.natYearSelected] * visConfig.natYearIndicatorDistance -
                 visConfig.natYearIndicatorSize/2
        })
    }

    function calculateParameters() {

      visConfig.datasetGraph = returnGraphData(visConfig.datasetGraphAux, visConfig.continentsFilter, visConfig.publicFilter);

      var dataHolder = visConfig.datasetGraph[visConfig.natYearSelected];
      var countriesSum = 0;
      var continentsSum = 0;
      var titlesSum = 0;
      var spacingSum = 0;
      var maxDataNations = 0;
      var minDataNations = Infinity;
      var finalData = [];

      dataHolder.forEach(function(continent) {
        continent.sort(function(a, b){return b["Dados"]["Títulos"]-a["Dados"]["Títulos"]});
        if (continent.length > 0) {
          continentsSum++;
          countriesSum += continent.length;
          if (continent.length > 1) spacingSum += continent.length - 1;
        }
        continent.forEach(function(country) {
          titlesSum += country["Dados"]["Títulos"];
          if (country["Dados"]["Média"] > maxDataNations) {
            maxDataNations = country["Dados"]["Média"];
          }
          if (country["Dados"]["Média"] < minDataNations) {
            minDataNations = country["Dados"]["Média"];
          }
        })
        finalData = finalData.concat(continent);
      });

      if (visConfig.publicFilter.max === Infinity) {
        maxDataNations = roundMultPowerTen(maxDataNations);
      } else {
        maxDataNations = visConfig.publicFilter.max;
      }

      var totalWidthAvailable = visConfig.natGraphXAxisW - ((visConfig.natGraphCountrySpacing * spacingSum)
        + ((continentsSum-1) * visConfig.natGraphContinentSpacing));

      var totalAxisWidth = visConfig.natGraphXAxisW;

      var accumulator = visConfig.baseWMargin;
      var calculatePositions = finalData.map(function(el, country) {
        var x = accumulator;
        var width = (el["Dados"]["Títulos"] * totalWidthAvailable)/titlesSum;

        accumulator += width;

        if ((country !== finalData.length-1) && (visConfig.countries[finalData[country]["País"]]["continente"] === visConfig.countries[finalData[country+1]["País"]]["continente"])) {
          accumulator += visConfig.natGraphCountrySpacing;
        } else {
          accumulator += visConfig.natGraphContinentSpacing;
        }

        return {
          x: x,
          width: width
        };
      });

      return {
        dataHolder: dataHolder,
        titlesSum: titlesSum,
        maxDataNations: maxDataNations,
        totalWidthAvailable: totalWidthAvailable,
        finalData: finalData,
        positions: calculatePositions
      };
    }

    function updateGraph() {

      // Remove warning text

      removeWarning();

      // Remove graph paths

      removePaths();

      // Ajusting graph labels

      d3.selectAll('text.axis-description.label')
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphXAxisLabelColor)
        .attr("font-size", visConfig.natGraphXAxisLabelsSize)
        .text(function(d, i) {
          return formatNumber((visConfig.publicFilter.min + i*(configuration.maxDataNations - visConfig.publicFilter.min)/10));
        });

      
      var countriesRects = d3.select('g.graph')
                             .selectAll('rect.country-bar')
                             .data(configuration.finalData, function(d) { return d["País"]; });
      
      var countriesPaths = d3.select('g.graph')
                             .selectAll('path.country-path')
                             .data(configuration.finalData, function(d) { return d["País"]; });

      if (visConfig.natCountrySelected !== undefined) {
        var selectedCountryWasInTheVis,
            selectedCountryIsInTheVis;
        try {
          selectedCountryWasInTheVis = countryWasInTheVis(visConfig.natCountrySelected);
        } catch (e) {
        }

        try {
          selectedCountryIsInTheVis = countryIsInTheVis(visConfig.natCountrySelected);
        } catch (e) {
        }

        if (!selectedCountryIsInTheVis) {
          removeTextsCountry();
          alertCountryIsNotPresent();
        }
      }

      countriesRects.exit().remove();

      countriesRects
          .enter()
          .append('rect')
          .attr("class", "country-bar")
          .attr("fill", function(d, country) {
            return visConfig.continentsColors[visConfig.countries[d["País"]]["continente"]];
          })
          .attr("x", function(d, country) {
            return configuration.positions[country].x;
          })
          .attr("y", function() {
            return visConfig.height - visConfig.natGraphRectBottomMargin;
          })
          .attr("height", visConfig.natGraphRectH)
          .attr("width", function(d, country) {
            return configuration.positions[country].width;
          })
          .on("click", function() {
            countryClickInteration(d3.select(this));
          })
          .on("mouseover", function() {
            countryMouseoverInteration(d3.select(this));
          })
          .on("mouseleave", function() {
            countryMouseleaveInteration(d3.selectAll("rect.country-bar"));
          })
          .attr("stroke-width", 0)
          .attr("stroke", "transparent")
          .attr("opacity", 0)
          .transition('new-rect-appearing')
          .duration(300)
          .attr("opacity", function(d) {
            if (visConfig.natCountrySelected === undefined || visConfig.natCountrySelected === d['País']) return 1;

            return visConfig.natGraphNotSelectedOpacity;
          });

      countriesRects
          .transition('old-rect-moving-and-resizing')
          .duration(300)
          .attr("x", function(d, country) {
            return configuration.positions[country].x;
          })
          .attr("width", function(d, country) {
            return configuration.positions[country].width;
          })
          .attr("opacity", function(d) {
            if (visConfig.natCountrySelected === undefined || visConfig.natCountrySelected === d['País']) return 1;

            return visConfig.natGraphNotSelectedOpacity;
          });

      countriesPaths
          .enter()
          .append('path')
          .attr("class", "country-path")
          .attr("d", function(d, country) {
            var startingX = configuration.positions[country].x;
            var width = configuration.positions[country].width;
            var startingY = visConfig.height - visConfig.natGraphRectBottomMargin + visConfig.natGraphRectH;
            var endingY = visConfig.height - visConfig.natGraphXAxisBottomMargin;
            var avrg = d["Dados"]["Média"];
            var endingX = (avrg - visConfig.publicFilter.min) * visConfig.natGraphXAxisW / (configuration.maxDataNations - visConfig.publicFilter.min) + visConfig.baseWMargin;
             
            return "M" + startingX + " " +
                    startingY +
                    " L" + (startingX + width) + " " + startingY +
                    " L" + endingX + " " + endingY + " Z";
          })
          .attr("fill", function(d, country) {
            return visConfig.continentsColors[visConfig.countries[d["País"]]["continente"]];
          })
          .attr("stroke-width", 0)
          .attr("stroke", "transparent")
          .on("click", function() {
            countryClickInteration(d3.select(this));            
          })
          .attr("opacity", 0)
          .transition('updated-paths-showing')
          .duration(300)
          .delay(300)
          .attr("opacity", function(d) {
            if (visConfig.natCountrySelected === undefined || visConfig.natCountrySelected === d['País']) return 1;

            return visConfig.natGraphNotSelectedOpacity;
          });

      if (selectedCountryIsInTheVis) {
        d3.selectAll('rect.country-bar')
          .filter(function(d) {
            if (d['País'] === visConfig.natCountrySelected) updateTextsCountry(d);
          });
      }
      
      if (configuration.finalData.length === 0) {
        d3.select("text.warning-description").text(function() {
          return "Não há filmes desse(s) continente(s) com essa média de público selecionada.";
        });
      }
    }

    function removePaths() {
      d3.selectAll('path.country-path').remove();
    }

    function alertCountryIsNotPresent() {
      d3.select("text.warning-description").text("O país selecionado não se encontra nesse ano e/ou com essas condições.");
    }

    function countryWasInTheVis(country) {
      return visConfig.datasetGraphAux[visConfig.natPreviousYearSelected][visConfig.countries[country]['continente']][country] !== undefined;
    }

    function countryIsInTheVis(country) {
      return visConfig.datasetGraphAux[visConfig.natYearSelected][visConfig.countries[country]['continente']][country] !== undefined &&
             visConfig.datasetGraphAux[visConfig.natYearSelected][visConfig.countries[country]['continente']][country]['Média'] >= visConfig.publicFilter.min &&
             visConfig.datasetGraphAux[visConfig.natYearSelected][visConfig.countries[country]['continente']][country]['Média'] <= visConfig.publicFilter.max;
    }

    function removeWarning() {
      d3.select("text.warning-description").text("");
    }

    function removeTextsCountry() {
      d3.selectAll("text.description-texts").text("");
    }

    function updateTextsCountry(data) {
      d3.select("text.country-description").text(data["País"]);
      d3.select("text.titles-description").text(function() {
        if (data["Dados"]["Títulos"] > 1) return data["Dados"]["Títulos"] + " filmes lançados";
        return data["Dados"]["Títulos"] + " filme lançado";
      });
      d3.select("text.public-description").text(function() {
        return formatNumber(parseInt(data["Dados"]["Média"])) + " espectadores em média";
      });
    }

    function countryClickInteration(self) {
      removeWarning();

      var data = self.data()[0];
      visConfig.natCountrySelected = data['País'];
      updateTextsCountry(data);
      d3.selectAll("rect.country-bar").attr("opacity", function(d) { return (d['País'] === visConfig.natCountrySelected) ? 1 : visConfig.natGraphNotSelectedOpacity; } );
      d3.selectAll("path.country-path").attr("opacity", function(d) { return (d['País'] === visConfig.natCountrySelected) ? 1 : visConfig.natGraphNotSelectedOpacity; } );
    }

    function countryMouseoverInteration(self) {
      self
        .transition((self.datum()["País"] + "up"))
        .duration(100)
        .attr("y", (visConfig.height - visConfig.natGraphRectBottomMargin) - 10)
        .attr("height", visConfig.natGraphRectH + 10);
    }

    function countryMouseleaveInteration(all) {
      all
        .transition("all-down")
        .duration(100)
        .attr("y", (visConfig.height - visConfig.natGraphRectBottomMargin))
        .attr("height", visConfig.natGraphRectH);
    }

    function drawGraph() {

      // Start Drawing

      var graph = vis.append("g")
        .attr("class", "graph");

      // Messages to user

      graph.append("text")
        .attr("class", "description-texts country-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "bold")
        .text("");

      graph.append("text")
        .attr("class", "description-texts titles-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + 2*deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      graph.append("text")
        .attr("class", "description-texts public-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/4;
          return visConfig.baseWMargin + 3*deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      graph.append("text")
        .attr("class", "description-texts warning-description")
        .attr("x", function() {
          var deslc = (visConfig.natGraphXAxisW)/2;
          return visConfig.baseWMargin + deslc;
        })
        .attr("y", (visConfig.height - visConfig.natGraphTextDescriptionBottomMargin))
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphTextDescriptionColor)
        .attr("font-size", visConfig.natGraphTextDescriptionSize)
        .attr("font-weight", "lighter")
        .text("");

      // Axis labels

      graph.append("text")
        .attr("class", "graph-description")
        .attr("x", visConfig.baseWMargin)
        .attr("y", (visConfig.height - visConfig.natGraphXAxisLabelH))
        .attr("text-anchor", "start")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.natSubTitleSize)
        .text("Média de Público");

      graph.append("text")
        .attr("class", "graph-description")
        .attr("x", visConfig.natGraphAxisLabelsW)
        .attr("y", (visConfig.height - visConfig.natGraphYAxisLabelH))
        .attr("text-anchor", "start")
        .attr("fill", visConfig.natContinentColor)
        .attr("font-size", visConfig.natSubTitleSize)
        .text("Títulos");


      // Drawing Axis

      graph.append("line")
        .attr("x1", visConfig.baseWMargin)
        .attr("y1", function() {
          return visConfig.height - visConfig.natGraphXAxisBottomMargin;
        })
        .attr("x2", function() {
          return visConfig.baseWMargin + visConfig.natGraphXAxisW;
        })
        .attr("y2", function() {
          return visConfig.height - visConfig.natGraphXAxisBottomMargin;
        })
        .attr("stroke", visConfig.natDivisionLineColor)
        .attr("stroke-width", visConfig.natDivisionLineThickness);

      for (var i = 0; i <= 10; i++) {
        graph.append("line")
          .attr('class', 'label')
          .attr("x1", function() {
            return visConfig.baseWMargin + i * (visConfig.natGraphXAxisW/10);
          })
          .attr("y1", function() {
            return visConfig.height - visConfig.natGraphXAxisBottomMargin - visConfig.natGraphXAxisDivisionH;
          })
          .attr("x2", function() {
            return visConfig.baseWMargin + i * (visConfig.natGraphXAxisW/10);
          })
          .attr("y2", function() {
            return visConfig.height - visConfig.natGraphXAxisBottomMargin + visConfig.natGraphXAxisDivisionH;
          })
          .attr("stroke", visConfig.natDivisionLineColor)
          .attr("stroke-width", visConfig.natDivisionLineThickness);

      graph.append("text")
        .attr("class", "axis-description label")
        .attr("x", function() {
          return visConfig.baseWMargin + i * ((visConfig.natGraphXAxisW)/10);
        })
        .attr("y", function() {
          return visConfig.height - visConfig.natGraphXAxisLabelsH;
        })
        .attr("text-anchor", "middle")
        .attr("fill", visConfig.natGraphXAxisLabelColor)
        .attr("font-size", visConfig.natGraphXAxisLabelsSize)
        .text(function() {
          return formatNumber((visConfig.publicFilter.min + i*(configuration.maxDataNations - visConfig.publicFilter.min)/10));
        });
      }

      // Drawing Graph

      var accumulator = visConfig.baseWMargin;
      graph.selectAll('rect.country-bar')
            .data(configuration.finalData, function(d) { return d["País"]; })
            .enter()
            .append('rect')
            .attr("class", "country-bar");

      d3.selectAll("rect.country-bar")
        .attr("x", function(d, country) {
          return configuration.positions[country].x;
        })
        .attr("y", function() {
          return visConfig.height - visConfig.natGraphRectBottomMargin;
        })
        .attr("width", function(d, country) {
          return configuration.positions[country].width;
        })
        .attr("height", visConfig.natGraphRectH)
        .attr("fill", function(d, country) {
          return visConfig.continentsColors[visConfig.countries[configuration.finalData[country]["País"]]["continente"]];
        })
        .attr("stroke-width", 0)
        .attr("stroke", "transparent")
        .on("click", function() {
          countryClickInteration(d3.select(this));
        })
        .on("mouseover", function() {
          countryMouseoverInteration(d3.select(this));
        })
        .on("mouseleave", function() {
          countryMouseleaveInteration(d3.selectAll("rect.country-bar"));
        })
        .attr("opacity", 0)
        .transition('initial-rects-showing')
        .duration(300)
        .attr("opacity", 1);

        // Drawing Paths

        graph
          .selectAll('path.country-path')
          .data(configuration.finalData, function(d) { return d["País"]; })
          .enter()
          .append('path')
          .attr("class", "country-path")
          .attr("d", function(d, country) {
            var startingX = configuration.positions[country].x;
            var width = configuration.positions[country].width;
            var startingY = visConfig.height - visConfig.natGraphRectBottomMargin + visConfig.natGraphRectH;
            var endingY = visConfig.height - visConfig.natGraphXAxisBottomMargin;
            var avrg = d["Dados"]["Média"];
            var endingX = (avrg - visConfig.publicFilter.min) * visConfig.natGraphXAxisW / (configuration.maxDataNations - visConfig.publicFilter.min) + visConfig.baseWMargin;
             
            return "M" + startingX + " " +
                    startingY +
                    " L" + (startingX + width) + " " + startingY +
                    " L" + endingX + " " + endingY + " Z";
          })
          .attr("fill", function(d, country) {
            return visConfig.continentsColors[visConfig.countries[configuration.finalData[country]["País"]]["continente"]];
          })
          .attr("stroke-width", 0)
          .attr("stroke", "transparent")
          .on("click", function() {
            countryClickInteration(d3.select(this));            
          })
          .attr("opacity", 0)
          .transition('initial-paths-showing')
          .duration(300)
          .delay(300)
          .attr("opacity", 1);
    }

    scaleVis(ratio);
  }

}
