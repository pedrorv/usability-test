(function() {

    angular
        .module('cenarioTest', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $stateProvider.state('visao-geral', {
                    url: '/visao-geral'
                })
                .state('nacionalidades', {
                    url: '/nacionalidades'
                })
                .state('recordistas', {
                    url: '/recordistas'
                })
                .state('producao-nacional', {
                    url: '/producao-nacional'
                })
                .state('sobre', {
                    url: '/sobre'
                });

                $urlRouterProvider.otherwise('visao-geral');
            }]);

}());