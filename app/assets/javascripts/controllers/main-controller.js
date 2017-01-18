(function() {
    angular
        .module('cenarioTest')
        .controller('MainController', ['$scope', '$location', function($scope, $location) {
            // Create a svg and resize according to user screen
            var svg = d3.select("div.visualization")
                        .append("svg")
                        .attr("class", "vis")
                        .attr("width", visConfig.width)
                        .attr("height", visConfig.height);

            var userWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            scaleSvg(scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth));


            // Adjust vis on screen resize
            d3.select(window).on("resize", function() {
                var userWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                    ratio = scaleRatio(userWindowWidth, visConfig.width, visConfig.baseWidth);



                var wordcloud = d3.select("div#word-cloud");

                if (!wordcloud.empty()) {
                    wordcloud
                        .style({
                            position: "absolute",
                            top: ((visConfig.proMenuTextOptionsH/visConfig.height) * 100) + "%",
                            left: ((visConfig.proMenuTextOptionsW/visConfig.width) * 100) + "%",
                            width: ((visConfig.proMenuTextOptionsWTotal/visConfig.width) * 100) + "%",
                            height: ((visConfig.proMenuTextOptionsHTotal/visConfig.height) * 100) + "%"
                        });

                    wordcloud
                        .selectAll("p")
                        .style({
                            "font-size": function() {
                                var value = parseFloat(d3.select(this).attr("base-size"));
                                return (value * ratio) + "px";
                            },
                            color: "#000",
                            display: "inline-block",
                            margin: "0 5px 5px 0"
                        });
                }

                scaleSvg(ratio);
                scaleVis(ratio);

                d3.select("div.visualization").style({
                    width: (visConfig.width * ratio) + "px"
                });
            });

            function visualSelection(reference) {
                d3.selectAll(".vis-selection").classed("selected-vis", false);
                reference.classed("selected-vis", true);
            }

            var visSelectors = d3.selectAll(".vis-selection").on("click", function() {
                visualSelection(this);
            });

            function changeVis (reference, newVis) {
                userWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                d3.selectAll("div#word-cloud").remove();
                d3.select("div.about-page").remove();
                deleteVis();
                d3.select("svg").classed("hidden", false);
                clearInterval(visConfig.animationTimer);
                visualSelection(reference);
                newVis(userWindowWidth);
            }

            d3.select("p.overview").on("click", function() {
                $scope.redirectTo('/visao-geral');
            });

            d3.select("p.nationalities").on("click", function() {
                $scope.redirectTo('/nacionalidades');
            });

            d3.select("p.recordists").on("click", function() {
                $scope.redirectTo('/recordistas');
            });

            d3.select("p.production").on("click", function() {
                $scope.redirectTo('/producao-nacional');
            });

            d3.select("p.about").on("click", function() {
                $scope.redirectTo('/sobre');
            });

            $scope.redirectTo = function(location) {
                $location.path(location);
                $scope.$apply();
            };

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                var path = $location.path();

                switch(path) {
                    case '/visao-geral':
                        changeVis(d3.select('p.overview'), createVisOverview);
                        break;
                    case '/nacionalidades':
                        changeVis(d3.select('p.nationalities'), createVisNationalities);
                        break;
                    case '/recordistas':
                        changeVis(d3.select('p.recordists'), createVisRecordists);
                        break;
                    case '/producao-nacional':
                        changeVis(d3.select('p.production'), createVisProduction);
                        break;
                    case '/sobre':
                        changeVis(d3.select('p.about'), createAboutPage);
                        break;
                    default:
                        changeVis(d3.select('p.overview'), createVisOverview);
                        break;
                }
            });
        }]);
}());