angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope,$ionicPopup,$rootScope,$http){

    // Welcoming message
    if($rootScope.firstLogin==true){
        var text= 'Bonjour '+ $rootScope.username + ', je suis le robot Poppy. Choisi un jeu pour interagir et jouer avec moi';
        $rootScope.httpSpeech(text);
        $rootScope.firstLogin=false;
        $rootScope.$broadcast("loginDone",$rootScope.firstLogin);

        $rootScope.run_move("behave_hello");

    }

    // popup d'alerte
    $scope.showAlert = function() {
        var text= 'Voici Cherry, le robot destiné aux enfants de primaire en situation d’hospitalisation.\n C\'est le compagnon idéal pour s\'échapper de la solitude';
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });

    };

    // Liste des app
    $scope.line1= [

        { src:'img/links--4p1w.png', title:'4 images 1 mot', link:'#/4p1w' },
        { src:'img/background/dance.jpg', title:'Chorégraphie', link:'#/choregraphy'},
        { src:'img/links--gaming.jpg', title:'Mouvements', link:'#/moves'},
    ];
    $scope.line2= [
        { src:'img/background/numbers2.jpg', title:'Calculatrice', link:'#/calcul'},
        { src:'img/links--drawing.jpg', title:'Blagues', link:'#/devinette'},
        { src:'img/background/memory_font.jpg', title:'Cases mémoires', link:'#/memory'},

    ];
})



.controller('AvatarCtrl',function($scope,$rootScope,$http,$ionicPopup){
    // Introduction text
    var text= 'Clique sur une image pour changer ton avatar. \n Il te suivra partout dans l\'application';
    $rootScope.httpSpeech(text);

    // Moves loading
    $http.get('data/gameMoves.json').success(function (data) {
        $scope.moves = data.avatarMoves;
    })

    $http.get('data/avatar.json').success(function (data) {
        $scope.avatars = data.url;
    })

    $scope.imageAvatar = "img/avatar/pixel-sitting.png";

    $scope.onTap = function (evt) {
        $scope.imageAvatar = $scope.avatars[evt];
        $rootScope.$broadcast("onTap", $scope.imageAvatar );
    }

    $scope.$on("onTap", function (evt, data) {
        $rootScope.avatar=data;
    });

    $scope.showAlert = function() {
        var text= 'Ton avatar a bien été changé ! ';
        $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

    $scope.showHelp = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };
})



.controller('MovesCtrl', function($scope, $http,$rootScope,$ionicPopup) {

    //Introduction text
    var text= 'Sur cette page tu peux tester tout les mouvements du robot poppy! ';
    $rootScope.httpSpeech(text);


    $scope.run_move = function(index) {
        $rootScope.run_move($rootScope.primitives[index]);
    };

    $scope.showAlert = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };


})


.controller('AccountCtrl', function($scope, $ionicModal,$ionicPopup,$rootScope,$state) {

    $scope.settings = {
        enableFriends: false
    };
    $scope.list = [
        { id: 1, title: 'Avatar'},
        { id: 2, title: 'Titre 2'},
        { id: 3, title: 'Titre 3'},
        { id: 4, title: 'Titre 4'},
        { id: 5, title: 'Titre 5'},
        { id: 6, title: 'Deconnexion'}
    ];

    // define create account view
    $ionicModal.fromTemplateUrl('html/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    $scope.data = {};

    $scope.login = function() {
        $rootScope.$broadcast("login", $scope.data.username );
        $scope.loginModal.hide();
        $state.go('home');
    }

    $scope.$on("login", function (evt, data) {
        $rootScope.username=data;
    });

    $scope.showAlert = function() {
        var text= 'Cette page te permet de gérer la connexion aux robots et à ton compte! ';
        $rootScope.httpSpeech(text);

        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

})


.controller('CalculCtrl', function($scope,$ionicPopup,$rootScope,$http) {
    // Introduction text
    var text= 'Coucou '+$rootScope.username+', ici tu es sur la page de la calculatrice ou tu peux calculer en t\'amusant !';
    $rootScope.httpSpeech(text);

    $http.get('data/gameMoves.json').success(function (data) {
        $scope.moves = data.calculMoves;
    });
    // Ecran de jeu 1 : Le robot pose des calculs à l'enfant. Jeu découpé en 2 parties distinctes :
    //  1) Un calcul aléatoire généré par le robot, l'enfant y répond puis valide. Un nouveau calcul apparait alors. 3 niveaux disponibles.
    // 2) Table de multiplication,addition et soustraction des nombres de 1 à 9. Recharger pour changer l'opérateur et le chiffre. Valider indiquera le nombre d'erreur.


    //Jeu 1)
    $scope.level="Choisissez un niveau pour commencer le jeu";
    $scope.score=0;
    $scope.total=0;

    $scope.niveau = function($int) {
        $scope.afficher_calculatrice = false;
        if ($int==1) {
            $scope.level="Niveau 1";
            $scope.level_nb=1;
            $scope.nb1_e = Math.floor(Math.random() * 9) + 1;
            $scope.nb2_e = Math.floor(Math.random() * 9) + 1;
            $scope.tabOperateur_e = ['+','-'];
            $scope.operateur_e = $scope.tabOperateur_e[Math.floor(Math.random() * $scope.tabOperateur_e.length)];
            if ($scope.operateur_e == '-' && $scope.nb1_e < $scope.nb2_e) {
                $tmp=$scope.nb2_e;
                $scope.nb2_e=$scope.nb1_e;
                $scope.nb1_e=$tmp;
            }
        }
        if ($int==2) {
            $scope.level="Niveau 2";
            $scope.level_nb=2;
            $scope.nb1_e = Math.floor(Math.random() * 50) + 1;
            $scope.nb2_e = Math.floor(Math.random() * 50) + 1;
            $scope.tabOperateur_e = ['+','-','*'];
            $scope.operateur_e = $scope.tabOperateur_e[Math.floor(Math.random() * $scope.tabOperateur_e.length)];
            if ($scope.operateur_e=='*') {
                $scope.nb1_e = Math.floor(Math.random() * 10) + 1;
                $scope.nb2_e = Math.floor(Math.random() * 10) + 1;
            }
            if ($scope.operateur_e == '-' && $scope.nb1_e < $scope.nb2_e) {
                $tmp=$scope.nb2_e;
                $scope.nb2_e=$scope.nb1_e;
                $scope.nb1_e=$tmp;
            }
        }
        if ($int==3) {
            $scope.level="Niveau 3";
            $scope.level_nb=3;
            $scope.tabOperateur_e = ['+','-','*', '/'];
            $scope.operateur_e = $scope.tabOperateur_e[Math.floor(Math.random() * $scope.tabOperateur_e.length)];
            if ($scope.operateur_e == '/') {
                do {
                    $scope.nb1_e = Math.floor(Math.random() * 50) + 1;
                    $scope.nb2_e = Math.floor(Math.random() * 50) + 1;
                } while($scope.nb1_e % $scope.nb2_e != 0)
            }
            else {
                $scope.nb1_e = Math.floor(Math.random() * 50) + 1;
                $scope.nb2_e = Math.floor(Math.random() * 50) + 1;
            }
            if ($scope.operateur_e == '-' && $scope.nb1_e < $scope.nb2_e) {
                $tmp=$scope.nb2_e;
                $scope.nb2_e=$scope.nb1_e;
                $scope.nb1_e=$tmp;
            }
            if ($scope.operateur_e == '*') {
                $scope.nb1_e = Math.floor(Math.random() * 12) + 1;
                $scope.nb2_e = Math.floor(Math.random() * 12) + 1;
            }
        }

    }
    //fonction appelé au moment de la selection du niveau. Elle génère les nombres et l'opérateur selon le niveau choisis.

    $scope.result_e = 0;

    $scope.resultat_enfant=function($int) {
        if ($scope.result_e < 100) $scope.result_e=10*$scope.result_e + $int;
    }

    $scope.erraze=function() {
        $scope.result_e=0;
    }

    $scope.result22=function($int3, $int4) {
        if ($int3 == $int4) {
            $scope.score++;
            $scope.phrase =["Bien joué!", "C'est ça petit!", "Bon résultat"];
        }
        else {
            $scope.phrase = ["Nooon :( ", "Argh.. dommage mais c'est faux", "Ce n'est pas la bonne réponse"];
        }

        return $scope.phrase[Math.floor(Math.random() * $scope.phrase.length)];;
    }


    this.rec = new SpeechRecognition();

    this.interim = [];
    this.final = '';
    var self = this;
    $scope.saved = -1;

    this.rec.continuous = false;
    this.rec.lang = 'fr-FR';
    this.rec.interimResults = true;

    $scope.start = function() {
        self.rec.start();
    };

    this.rec.onresult = function(event) {
        for(var i = event.resultIndex; i < event.results.length; i++) {
            if(event.results[i].isFinal) {
                self.final = self.final.concat(event.results[i][0].transcript);
                //console.log(event.results[i][0].transcript);
                $scope.$apply();
                $scope.saved = event.results[i][0].transcript;
                console.log($scope.saved);
                $scope.result_e = $scope.saved;
                $scope.$apply();
            } else {
                self.interim.push(event.results[i][0].transcript);
                //  console.log('interim ' + event.results[i][0].transcript);
                $scope.$apply();
            }
        }
    };



    $scope.popup = function(valeur) {

        if ($scope.operateur_e == '+') {
            $scope.result_ev = $scope.nb1_e + $scope.nb2_e;
        }
        if ($scope.operateur_e == '-') {
            $scope.result_ev = $scope.nb1_e - $scope.nb2_e;
        }
        if ($scope.operateur_e == '*') {
            $scope.result_ev = $scope.nb1_e * $scope.nb2_e;
        }
        if ($scope.operateur_e == '/') {
            $scope.result_ev = $scope.nb1_e / $scope.nb2_e;
        }

        $test=$scope.result22(valeur, $scope.result_ev);
        $scope.result_e=0;


        // Random text spoken by the robot
        $http.get('data/speaking.json').success(function (speakingList) {
            $scope.speech = speakingList.Calculette[Math.floor((Math.random() * speakingList.Calculette.length))];
            $rootScope.httpSpeech($scope.speech);
            $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);

        })

        $scope.niveau($scope.level_nb);
        $scope.total++;
    };


    // Jeu 2) Faire calculer le robot

    $scope.afficher=function() {
        if ($scope.afficher_calculatrice == false) $scope.afficher_calculatrice = true;
        else  $scope.afficher_calculatrice = false;
    }
    $scope.show=function() {
        if ($scope.afficher_calculatrice == true) return false;
        else return true;
    }

    $scope.show2=function() {
        if ($scope.afficher_calculatrice == true) return true;
        else return false;
    }

    $scope.param=0;
    $scope.calcul="";
    $scope.calcultest2="";

    $scope.chainecalcul = function($int) {
        $calcultest= $scope.calcul.split(" ");
        if ($calcultest.length == 1) {
            if ($scope.calcul == "") $scope.calcul=0;
            else $scope.calcul = parseInt($scope.calcul);
            $scope.calcul= $scope.calcul*10 + $int;
            $scope.calcul = $scope.calcul.toString();
        }
        else if ($calcultest.length > 1) {
            $calcultest[2] = $scope.calcultest2;
            if ($scope.calcultest2 == "") $scope.calcultest2 = 0;
            else $scope.calcultest2 = parseInt($scope.calcultest2);
            $scope.calcultest2 = $scope.calcultest2*10 + $int;
        }

    }

    $scope.chainecalculop = function($op) {
        $scope.param++;
        if ($op==1) $scope.calcul = $scope.calcul + " + ";
        if ($op==2) $scope.calcul = $scope.calcul + " - ";
        if ($op==3) $scope.calcul = $scope.calcul + " * ";
        if ($op==4) $scope.calcul = $scope.calcul + " / ";
        if ($scope.param > 1) {
            alert ("ERREUR");
            $scope.param=0;
            $scope.calcul="";
            $scope.calcultest2="";
        }

        //  $scope.calcul = $scope.calcul.toString();
    }
    $scope.sendResult = function(value){
        $rootScope.httpSpeech(value);

    }
    $scope.resultat=function($calcul, $calcultest2) {

        if ($calcul.split(" ")[1] == "+") {
            $scope.calcul	= parseInt($calcul.split(" ")[0]) + $calcultest2;
            $scope.calcul_json = $scope.calcul.toString();
            $scope.sendResult($scope.calcul_json);
            $scope.calcultest2="";
        }

        if ($calcul.split(" ")[1] == "-") {
            $scope.calcul	= parseInt($calcul.split(" ")[0]) - $calcultest2;
            $scope.calcul_json = $scope.calcul.toString();
            $scope.sendResult($scope.calcul_json);
            $scope.calcultest2="";
        }

        if ($calcul.split(" ")[1] == "*") {
            $scope.calcul	= parseInt($calcul.split(" ")[0]) * $calcultest2;
            $scope.calcul_json = $scope.calcul.toString();
            $scope.sendResult($scope.calcul_json);
            $scope.calcultest2="";
        }

        if ($calcul.split(" ")[1] == "/") {
            $scope.calcul	= parseInt($calcul.split(" ")[0]) / $calcultest2;
            $scope.calcul_json = $scope.calcul.toString();
            $scope.sendResult($scope.calcul_json);
            $scope.calcultest2="";
        }
    }

    $scope.effacer=function() {
        $scope.param=0;
        $scope.calcul="";
        $scope.calcultest2="";
    }


    $scope.param=0;
    $scope.calcul="";
    $scope.calcultest2="";
    $scope.chainecalcul = function($int) {
        $calcultest= ($scope.calcul).split(" ");
        if ($calcultest.length == 1) {
            if ($scope.calcul == "") $scope.calcul=0;
            else $scope.calcul = parseInt($scope.calcul);
            $scope.calcul= $scope.calcul*10 + $int;
            $scope.calcul = $scope.calcul.toString();
        }
        else if ($calcultest.length > 1) {
            $calcultest[2] = $scope.calcultest2;
            if ($scope.calcultest2 == "") $scope.calcultest2 = 0;
            else $scope.calcultest2 = parseInt($scope.calcultest2);
            $scope.calcultest2 = $scope.calcultest2*10 + $int;
        }

    }


    $scope.chainecalculop = function($op) {
        $scope.param++;
        if ($op==1) $scope.calcul = $scope.calcul + " + ";
        if ($op==2) $scope.calcul = $scope.calcul + " - ";
        if ($op==3) $scope.calcul = $scope.calcul + " * ";
        if ($op==4) $scope.calcul = $scope.calcul + " / ";
        if ($scope.param > 1) {
            alert ("ERREUR");
            $scope.param=0;
            $scope.calcul="";
            $scope.calcultest2="";
        }
        $scope.calcul = $scope.calcul.toString();
    }


    // popup d'alerte
    $scope.showAlert = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

})



.controller('ChoregraphyCtrl', function($scope, $ionicPopup, $http, $timeout,$rootScope) {
    // Introduction text
    var text= 'Poppy danse sur une musique de ton choix '+$rootScope.username+'. Déplace les icones pour choisir tes mouvements';
    $rootScope.httpSpeech(text);

    $scope.music = 'music/Magic_sys_air.mp3';
    $scope.music1Disabled = false;
    $scope.music2Disabled = false;
    $scope.music3Disabled = false;
    $scope.music4Disabled = false;
    var audio = new Audio($scope.music);
    $scope.playingButtonImg="img/play_red.png"

    $scope.droppedObjects1 = [];
    $scope.droppedObjects2 = [];
    $scope.droppedObjects3 = [];
    $scope.droppedObjects4 = [];

    // popup d'alerte
    $scope.showAlert = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

    // Chargement des primitives
    $http.get('data/UrlMoves.json').success(function (data) {
        $scope.moves = data.moves;
    })


    $scope.playAudio = function() {
        if($scope.playingButtonImg=="img/play_red.png"){

            $http.get($rootScope.cherryUrl+"app/ismoving?id=Cherry").success(function(response){
                $scope.isMoving = response.isMoving;

                console.log($scope.droppedObjects1[0]);
                if ($scope.isMoving == "false"){
                    var dataChore = {
                        id : "Cherry",
                        list : [
                            $scope.droppedObjects1[0].primitive,
                            $scope.droppedObjects2[0].primitive,
                            $scope.droppedObjects3[0].primitive,
                            $scope.droppedObjects4[0].primitive,
                        ]
                    }
                    console.log(dataChore);



                    $http({
                        url: $rootScope.cherryUrl+"app/chore",
                        method: 'POST',
                        data: dataChore,
                        headers: {
                            'Content-Type': 'application/json' // Note the appropriate header
                        }
                    }).success(function(response){
                        console.log(response);
                        // Clean the dropbox after clicking on the playButton
                        $scope.dropboxClean()



                        audio.pause();
                        audio = new Audio($scope.music);
                        audio.play();
                        $scope.playingButtonImg="img/stop_blue.png";

                    });
                }


            });


        }else{
            // Stop the robot
            $http({
                url: $rootScope.cherryUrl+"app/stop?id=Cherry",
                method: 'GET',
                data: {"id":'Cherry'},
                headers: {
                    'Content-Type': 'application/json' // Note the appropriate header
                }
            })
            audio.pause();
            $scope.playingButtonImg="img/play_red.png"

        }

    };

    $scope.setMusic1 = function() {
        $scope.music='music/Magic_sys_air.mp3';
        $scope.music1Disabled = true;
        $scope.music2Disabled = false;
        $scope.music3Disabled = false;
        $scope.music4Disabled = false;
    };

    $scope.setMusic2 = function() {
        $scope.music='music/Rihanna_Work.mp3';
        $scope.music2Disabled = true;
        $scope.music1Disabled = false;
        $scope.music3Disabled = false;
        $scope.music4Disabled = false;
    };

    $scope.setMusic3 = function() {
        $scope.music='music/Shake_It_Off.mp3';
        $scope.music1Disabled = false;
        $scope.music2Disabled = false;
        $scope.music3Disabled = true;
        $scope.music4Disabled = false;
    };

    $scope.setMusic4 = function() {
        $scope.music='music/50cent_indaclub.mp3';
        $scope.music1Disabled = false;
        $scope.music2Disabled = false;
        $scope.music3Disabled = false;
        $scope.music4Disabled = true;
    };


    //- Contrôle du drag & drop -->
    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }


    $scope.onDropComplete1 = function (data, evt) {
        var index = $scope.droppedObjects1.indexOf(data);
        if (index == -1 && $scope.droppedObjects1.length <1){
            $scope.droppedObjects1.push(data);
        }else if ($scope.droppedObjects1.length >=1) {
            $scope.droppedObjects1[0]=data;
        }

    }
    $scope.onDragSuccess1 = function (data, evt) {
        var index = $scope.droppedObjects1.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects1.splice(index, 1);
        }
    }
    $scope.onDragSuccess2 = function (data, evt) {
        var index = $scope.droppedObjects2.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects2.splice(index, 1);
        }
    }
    $scope.onDropComplete2 = function (data, evt) {
        var index = $scope.droppedObjects2.indexOf(data);
        if (index == -1 && $scope.droppedObjects2.length <1) {
            $scope.droppedObjects2.push(data);
        }else if ($scope.droppedObjects2.length >=1) {
            $scope.droppedObjects2[0]=data;
        }
    }


    $scope.onDragSuccess3 = function (data, evt) {
        var index = $scope.droppedObjects3.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects3.splice(index, 1);
        }
    }
    $scope.onDropComplete3 = function (data, evt) {
        var index = $scope.droppedObjects3.indexOf(data);
        if (index == -1 && $scope.droppedObjects3.length <1) {
            $scope.droppedObjects3.push(data);
        }else if ($scope.droppedObjects3.length >=1) {
            $scope.droppedObjects3[0]=data;
        }

    }
    $scope.onDragSuccess4 = function (data, evt) {
        var index = $scope.droppedObjects4.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects4.splice(index, 1);
        }
    }
    $scope.onDropComplete4 = function (data, evt) {
        var index = $scope.droppedObjects4.indexOf(data);
        if (index == -1 && $scope.droppedObjects4.length <1) {
            $scope.droppedObjects4.push(data);
        }else if ($scope.droppedObjects4.length >=1) {
            $scope.droppedObjects4[0]=data;
        }

    }
    var inArray = function (array, obj) {
        var index = array.indexOf(obj);
    }
    $scope.dropboxClean = function(){
        $scope.droppedObjects1 = [];
        $scope.droppedObjects2 = [];
        $scope.droppedObjects3 = [];
        $scope.droppedObjects4 = [];
    }

})


.controller('MemoryCtrl', function($scope, $ionicPopup, $rootScope, $http) {
    // Introduction text
    var text= 'Voici le jeu des cases mémoires. Choisi ton niveau puis trouve les cases identiques deux par deux!';
    $rootScope.httpSpeech(text);

    $http.get('data/cards.json').success(function (data) {
        $scope.cards = data.cards;
        $scope.loadLevel(1);
    });
    $http.get('data/gameMoves.json').success(function (data) {
        $scope.moves = data.memoryMoves;
    });

    //Set game parameters (level and grid length)
    $scope.setGameSettings=function(gameLevel){
        $scope.gameLevel=gameLevel;
        if(gameLevel==1){
            $scope.horizTile=3;
            $scope.vertiTile=2;
        }
        else if(gameLevel==2){
            $scope.horizTile=4;
            $scope.vertiTile=3;
        }
        else if(gameLevel==3){
            $scope.horizTile=6;
            $scope.vertiTile=3;
        }else{
            console.log("erreur level");
        }
    };
    // Initialize Game grid according to the level
    $scope.loadLevel=function(gameLevel){
        $scope.setGameSettings(gameLevel);

        //Création de la grille de jeu
        var GameTab = new Array();
        for (i=0;i<$scope.vertiTile;i++) {
            GameTab[i]=new Array();
            for (j=0;j<$scope.horizTile;j++) {
                GameTab[i][j]=i*j;
            }
        }
        // Insertion des images 2 à 2
        var maxID=$scope.vertiTile*$scope.horizTile/2;
        var tileID;
        var fillingTab=new Array(maxID+1)// STore the number of used image for each index (should be max 2)
        for (i=0;i<maxID+1;i++) {
            fillingTab[i]=0;
        }

        // Filling the gameGrid with ID for images
        for (i=0;i<$scope.vertiTile;i++) {
            for (j=0;j<$scope.horizTile;j++) {
                tileID=Math.floor((Math.random()*maxID)+1);
                // Make sure the new tile ID hasn't used twice already
                while (fillingTab[tileID]>=2){
                    tileID=Math.floor((Math.random()*maxID)+1);
                }
                fillingTab[tileID]++;
                GameTab[i][j]=tileID;
            }
        }


        $scope.gameGrid=new Array();//Store the images for each position
        $scope.stateGrid=new Array();// STore true or false for each position depending on the tile is whowing or not
        $scope.resolveGrid=new Array();
        $scope.flippedTab=new Array();
        $scope.resolvedTiles=0;

        // Fill the grid with cards img
        for (i=0;i<$scope.vertiTile;i++) {
            $scope.gameGrid[i]=new Array();
            $scope.stateGrid[i]=new Array();
            $scope.resolveGrid[i]=new Array();

            for (j=0;j<$scope.horizTile;j++) {
                console.log(GameTab[i][j]);
                $scope.gameGrid[i][j]=$scope.cards[GameTab[i][j]-1].img;
                $scope.stateGrid[i][j]=false;
                $scope.resolveGrid[i][j]=false;

            }
        }
        console.log($scope.gameGrid);

        $scope.rows=new Array();
        for (i=0;i<$scope.vertiTile;i++){
            $scope.rows[i]=i;
        }
        console.log($scope.rows);

        $scope.flippedCount=0;
        $scope.flippedTab={};

    }

    // Function used when clicking on a tile
    $scope.discoverTile=function(line,col){
        $scope.flippedCount++;
        console.log("test présence");

        if($scope.flippedCount<=2){
            $scope.stateGrid[line][col]=true;
            $scope.flippedTab[$scope.flippedCount-1]={"line":line,"col":col}
        }
        if($scope.flippedCount>2){

            $scope.stateGrid[$scope.flippedTab[0].line][$scope.flippedTab[0].col]=false;
            $scope.stateGrid[$scope.flippedTab[1].line][$scope.flippedTab[1].col]=false;

            $scope.flippedTab={};
            $scope.flippedCount=1;

            $scope.stateGrid[line][col]=true;
            $scope.flippedTab[$scope.flippedCount-1]={"line":line,"col":col}


            $scope.gameGrid=new Array();
            $scope.stateGrid=new Array();
            $scope.resolveGrid=new Array();


            for (i=0;i<$scope.vertiTile;i++) {

                $scope.gameGrid[i]=new Array();
                $scope.stateGrid[i]=new Array();
                $scope.resolveGrid[i]=new Array();

                for (j=0;j<$scope.horizTile;j++) {
                    console.log(GameTab[i][j]);
                    $scope.gameGrid[i][j]=$scope.cards[GameTab[i][j]-1].img;
                    $scope.stateGrid[i][j]=false;
                    $scope.resolveGrid[i][j]=false;
                }
            }
            console.log($scope.gameGrid);

            $scope.rows=new Array();
            for (i=0;i<$scope.vertiTile;i++){
                $scope.rows[i]=i;
            }
            console.log($scope.rows);

            $scope.flippedCount=0;

        }
        $scope.test=function(){
            console.log("test présence");
        }
        // 1ere tile découverte en mémoire
        var discoveredTile = {"img":"", "line":100, "col":100};

        $scope.discoverTile=function(line,col){
            console.log($scope.flippedTab);
            // If the tile is already shown don't go further
            if($scope.resolveGrid[line][col] == true || (discoveredTile.line==line && discoveredTile.col==col)){
                return;
            }else{
                // Increment the number of flipped tiles
                $scope.flippedCount++;

                // Case 0 or 1 tile already flipped
                if($scope.flippedCount<=2){
                    if($scope.flippedCount==1){
                        discoveredTile = {"img":$scope.gameGrid[line][col], "line":line, "col":col};// Store datas of first flipped tile
                    }
                    $scope.stateGrid[line][col]=true;
                    $scope.flippedTab[$scope.flippedCount-1]={"line":line,"col":col};

                    console.log("Disc TILE img "+discoveredTile.img);
                    console.log("New img "+$scope.gameGrid[line][col]);
                    // case same image
                    if($scope.flippedCount==2 && discoveredTile.img == $scope.gameGrid[line][col]){

                        $scope.resolveGrid[line][col]=true;
                        $scope.resolveGrid[discoveredTile.line][discoveredTile.col]=true;
                        discoveredTile = {"img":"", "line":100, "col":100};// Store datas of first flipped tile
                        $scope.resolvedTiles++;

                        // Check if the game is ended and show popup
                        if($scope.resolvedTiles==(($scope.vertiTile*$scope.horizTile)/2)){
                            //Texte aléatoire
                            $http.get('data/speaking.json').success(function (speakingList) {
                                $scope.speech = speakingList.Memory[Math.floor((Math.random() * speakingList.Memory.length))];
                                $rootScope.httpSpeech(speakingList.Memory[Math.floor((Math.random() * speakingList.Memory.length))]);

                            })

                            var alertPopup = $ionicPopup.alert({
                                title: 'Jeu terminé',
                                template: 'Bravo tu as réussi à trouver toutes les paires !'
                            });
                        }else{

                            $http.get($rootScope.cherryUrl+"app/ismoving?id=Cherry").success(function(response){

                                $scope.isMoving = response.isMoving;
                                if ($scope.isMoving == "false"){

                                    // Mouvement aléatoire + parole aléatoire
                                    $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);
                                    $http.get('data/speaking.json').success(function (speakingList) {
                                        $scope.speech = speakingList.Double_tile[Math.floor((Math.random() * speakingList.Double_tile.length))];
                                        $rootScope.httpSpeech($scope.speech);

                                    })

                                }
                            });
                        }

                    }
                }
                // Case 2 tiles are already flipped
                else if($scope.flippedCount>2){
                    if($scope.resolveGrid[$scope.flippedTab[0].line][$scope.flippedTab[0].col] != true && $scope.resolveGrid[$scope.flippedTab[1].line][$scope.flippedTab[1].col] !=true){
                        $scope.stateGrid[$scope.flippedTab[0].line][$scope.flippedTab[0].col]=false;
                        $scope.stateGrid[$scope.flippedTab[1].line][$scope.flippedTab[1].col]=false;
                    }

                    $scope.flippedTab={};
                    $scope.flippedCount=1;
                    discoveredTile = {"img":$scope.gameGrid[line][col], "line":line, "col":col}; // Store datas of first flipped tile

                    $scope.stateGrid[line][col]=true;
                    $scope.flippedTab[$scope.flippedCount-1]={"line":line,"col":col};

                }
            }

        }
    }

    $scope.showAlert = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

})


.controller('DevinettesCtrl', function($scope, $http, $rootScope, $ionicPopup) {

    $scope.indexToShow=Math.floor((Math.random()*50));

    // Moves loading
    $http.get('data/gameMoves.json').success(function (data) {
        console.log("Bonjour"+data);
        $scope.moves = data.memoryMoves;
        // Jokes loading
        $http.get('data/blagues.json').success(function(blague)
        {
            console.log(blague);

            $scope.devinettes = blague.blagues;
            //Read the first joke and make a random move
            $rootScope.httpSpeech($scope.devinettes[$scope.indexToShow]);
            $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);

        })
    })



    $scope.getRandomIndex = function(){
        $scope.indexToShow=$scope.indexToShow+1;
        if ($scope.indexToShow==50) {
            $scope.indexToShow=0;
        }

        console.log([$scope.devinettes[$scope.indexToShow]]);
        $rootScope.$broadcast("getPreviousIndex", $scope.indexToShow );


        //Read the joke and make a random move
        $rootScope.httpSpeech($scope.devinettes[$scope.indexToShow]);
        $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);
    }

    $scope.$on("getRandomIndex", function (evt, data) {
        $rootScope.indexToShow=data;
    });

    $scope.getPreviousIndex = function(){
        $scope.indexToShow=$scope.indexToShow-1;
        if ($scope.indexToShow == -1) {
            $scope.indexToShow=49;
        }
        console.log([$scope.devinettes[$scope.indexToShow]]);
        $rootScope.$broadcast("getPreviousIndex", $scope.indexToShow );
        //Read the joke and make a random move
        $rootScope.httpSpeech($scope.devinettes[$scope.indexToShow]);
        $rootScope.run_move($scope.moves[Math.floor((Math.random() * $scope.moves.length))]);
    }


    $scope.$on("getPreviousIndex", function (evt, data) {
        $rootScope.indexToShow=data;
    });

    $scope.showAlert = function() {
        var text= 'Coucou et bienvenue sur la page des blagues, ici ton ami Poppy peut te raconter des blagues ! Rigole bien sur la page et amuse toi !';
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };

})



.controller('ConnectCtrl', function($scope, $http, $rootScope) {
    var id = 0;
    $http.get($rootScope.cherryUrl+"/robots").success(function(response){
        console.log(response);
        var name = [];

        var table = [];
        response[0].forEach(function(value,key){
            console.log("isTaken" in value);
            if("isTaken" in value){
                if(value.isTaken == false){
                    name.push(value.name);
                }
            }
            else{
                name.push(value.name);
            }
            $scope.robots_libre = name;
        });
    })
})

.controller('4p1wCtrl', function($scope, $ionicPopup, $http, $timeout,$rootScope) {
    var text= 'Voici le jeu 4 images 1 mot.\n Trouve le mot qui relie les 4 images que tu vois sur la page.';
    $rootScope.httpSpeech(text);


    $scope.level=1;
    $scope.mot_a_trouver=['chat','chien','dormir','ecole','montagne','planete','poubelle','saisons','salon','transport','vacances','voiture'];


    function $random(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    function shuffle(sentence) {
        return sentence
        .split("")
        .sort(function(a,b) {
            if($random(0,100)%2 == 0) {
                return 1;
            } else {
                return -1;
            }
        }).join("");
    }




    $scope.generer = function($level) {
        $nb_lettres_generer = 15-$scope.mot_a_trouver[$level-1].length;
        var ListeCar = new Array("a","a", "a", "a", "a", "a", "a", "b", "b", "c","c","c","d","d","d","d","e","e","e","e","e","e","e","e","e","e","e","e","f","g","h","i","i","i","i","i","i","j","k","l","l","l","l","m","m","m","n","n","n","n","n","n","o","o","o","o","o","p","p","p","q","r","r","r","r","r","r","s","s","s","s","s","s","t","t","t","t","t","t","u","u","u","u","v","w","x","y","z");
        var Chaine = $scope.mot_a_trouver[$level-1];
        for(i = 0; i < $nb_lettres_generer; i++)
        {
            Chaine = Chaine + ListeCar[Math.floor(Math.random()*ListeCar.length)];
        }

        $scope.lettres=shuffle(Chaine);

        return $scope.lettres;

    };

    $scope.generer($scope.level);




    $scope.getNumber = function(num) {
        return new Array(num);
    }

    $indice=0;
    $scope.mot=""
    $scope.ajouter_lettre = function($lettre) {
        $scope.mot += $lettre;
    };

    $scope.valider = function($mot) {
        if ($mot.join("") == $scope.mot_a_trouver[$scope.level-1]) {
            alert("VRAI! On passe au niveau suivant.");
            $scope.level += 1;
            $scope.mot="";
            $scope.test=[];
            $scope.generer($scope.level);
        }
        else {
            alert("FAUX! On recommence.");
            $scope.mot = "";
            $scope.test=[];
        }
    };






    $scope.onDragComplete=function(data,evt){
        alert("drag success, data:", data);
    }
    $scope.onDropComplete=function(data,evt){
        alert("drop success, data:", data);
    }
    //- Contrôle du drag & drop -->
    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }


    $scope.test=[];
    $scope.onDropComplete1 = function (data, evt, i) {
        $scope.test[i]=data;
        var index = $scope.droppedObjects1.indexOf(data);
        if (index == -1 && $scope.droppedObjects1.length <1){
            $scope.droppedObjects1.push(data);
        }else if ($scope.droppedObjects1.length >=1) {
            $scope.droppedObjects1[0]=data;
        }
    }
    $scope.onDragSuccess1 = function (data, evt,i) {
        var index = $scope.droppedObjects1.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects1.splice(index, 1);
        }
    }


    $scope.showAlert = function() {
        $rootScope.httpSpeech(text);
        var alertPopup = $ionicPopup.alert({
            title: 'Le projet Cherry',
            template: text
        });
    };


});
