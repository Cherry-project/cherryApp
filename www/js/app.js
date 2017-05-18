
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','ngDraggable'])

.run(function($ionicPlatform,$rootScope, $http,$ionicPopup) {




    // Declare default avatar and title-image and username
    $rootScope.avatar="img/avatar/pixel-sitting.png";
    $rootScope.username="";
    $rootScope.navTitle='<img class="title-image" src="img/primakid-navbar-clean.png" height="65px"   width ="125px"/>';
    $rootScope.firstLogin=true;
    $rootScope.cherryUrl="http://95.85.41.131/ssh/";


    //Get the list of primitives from the server

    $http.get($rootScope.cherryUrl+"app/primitives"+"?id=Cherry").success(function(response)
    {
        $rootScope.primitives = response.primitives;  //ajax request to fetch data into
    })

    // FUnction to make poppy speak with the given text
    $rootScope.httpSpeech=function(text){
        $http({
            url: $rootScope.cherryUrl+"app/speech",
            method: 'POST',
            data: {"id": "Cherry", "list": [text]},
            headers: {
                'Content-Type': 'application/json' // Note the appropriate header
            }
        }).success(function(response){
            console.log(response);
        });
    }

    // Function for the behave moves
    $rootScope.run_move = function(moveName) {
        $http.get($rootScope.cherryUrl+"app/behave?id=Cherry&name=" + moveName);
    };



    $ionicPlatform.ready(function() {

        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

        /*  if(window.cordova && window.cordova.plugins &&
        window.cordova.plugins.speechRecognition){
        console.log('Plugin available');
    } */
});
})



.config(function($stateProvider,$urlRouterProvider) {
    $stateProvider

    .state('home', {
        url: '/home',
        templateUrl: 'html/home.html',
        controller: 'HomeCtrl'
    })

    .state('account', {
        url: '/account',
        templateUrl: 'html/account.html',
        controller: 'AccountCtrl'
    })

    .state('avatar', {
        url: '/avatar',
        templateUrl: 'html/avatar.html',
        controller: 'AvatarCtrl'
    })

    .state('choregraphy', {
        url: '/choregraphy',
        templateUrl: 'html/choregraphy.html',
        controller: 'ChoregraphyCtrl'
    })

    .state('moves', {
        url: '/moves',
        templateUrl: 'html/moves.html',
        controller: 'MovesCtrl'
    })
    .state('calcul', {
        url: '/calcul',
        templateUrl: 'html/calcul.html',
        controller: 'CalculCtrl'
    })
    .state('4p1w', {
        url: '/4p1w',
        templateUrl: 'html/4p1w.html',
        controller: '4p1wCtrl'
    })

    .state('memory', {
        url: '/memory',
        templateUrl: 'html/memorytile.html',
        controller: 'MemoryCtrl'
    })


    .state('devinette', {
        url: '/devinette',
        templateUrl: 'html/devinette.html',
        controller: 'DevinettesCtrl'
    })

    .state('connection',{
        url: '/connection',
        templateUrl: 'html/connection.html',
        controller: 'ConnectCtrl'
    })

    .state('login', {
        url:'/login',
        templateUrl: 'html/login.html',
        controller: 'LoginCtrl'
    })

    $urlRouterProvider.otherwise('/account');

});
