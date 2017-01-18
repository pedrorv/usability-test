(function() {

    angular
        .module('cenarioTest', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $stateProvider.state('visao-geral', {
                    url: '/visao-geral',
                    data: {
                        'createVis': 'visFunction'
                    }
                })
                .state('nacionalidades', {
                    url: '/nacionalidades',
                    data: {
                        'createVis': 'visFunction'
                    }
                })
                .state('recordistas', {
                    url: '/recordistas',
                    data: {
                        'createVis': 'visFunction'
                    }
                })
                .state('producao-nacional', {
                    url: '/producao-nacional',
                    data: {
                        'createVis': 'visFunction'
                    }
                })
                .state('sobre', {
                    url: '/sobre',
                    data: {
                        'createVis': 'visFunction'
                    }
                });

                $urlRouterProvider.otherwise('visao-geral');
            }]);

}());