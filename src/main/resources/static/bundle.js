var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap']);

myApp.config(function($stateProvider) {
  // An array of state definitions
  var states = [{
      name: 'home',
      url: '/',
      views: {
        'container@': {
          templateUrl: 'templates/home.html'
        }
      }
    },
    {
      name: 'login',
      url: '/login',
      controller: 'loginController',
      views: {
        'container@': {
          templateUrl: 'templates/login.html'
        }
      }
    },
    {
      name: 'register',
      url: '/register',
      controller: 'registerController',
      views: {
        'container@': {
          templateUrl: 'templates/register.html'
        }
      }
    },
    {
      name: 'actoresFavoritos',
      url: '/actoresFavoritos',
      views: {
        'container@': {
          templateUrl: 'templates/actoresFavoritos.html'
        }
      }
    },

    {
      name: 'listas',
      url: '/listas',
      views: {
        'container@': {
          templateUrl: 'templates/listas/list.html'
        }
      }
    },

    {
      name: 'buscarMovies',
      url: '/buscar/pelicula/',
      controller: 'buscarMoviesController',
      views: {
        'container@': {
          templateUrl: 'templates/buscar/movies.html'
        }
      }
    },

    {
      name: 'users',
      url: '/users',
      views: {
        'container@': {
          templateUrl: 'templates/admin/users.html'
        }
      }
    },

    {
      name: 'users.lists',
      url: '/lists',
      params: {
        usersSel: null
      },
      views: {
        'container@': {
          templateUrl: 'templates/admin/listComparison.html'
        }
      }
    },

    {
      name: 'fichaPelicula',
      url: '/movie/:fichaId',
      views: {
        'container@': {
          templateUrl: 'templates/fichas/pelicula.html'
        }
      }
    },

    {
      name: 'fichaPersona',
      url: '/person/:fichaId',
      views: {
        'container@': {
          templateUrl: 'templates/fichas/persona.html'
        }
      }
    },
{
  name: 'rankingActoresFavoritos',
    url: '/ranking',
  views: {
  'container@': {
    templateUrl: 'templates/admin/rankingActoresFavoritos.html'
  }
}
}

  ]

  // Loop over the state definitions and register them
  states.forEach(function(state) {
    $stateProvider.state(state);
  });

});

var settings = {
    apiUrl: '/api/'
  // apiUrl: '/TACS-1c2017-G1-5.0/api/'
}

/**
 * Created by aye on 06/05/17.
 */
'use strict';

myApp.service('Admin', function ($http) {

  var self = this;

  self.getUsers = function (sesionActual, callback) {
    return $http.get(settings.apiUrl+'admin/user/list', {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

  self.getData = function (sesionActual, id, callback) {
    return $http.get(settings.apiUrl+'admin/user/' + id, {
      headers: {'token': sesionActual.idSesion}
    }).then(callback);
  }

});

/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.service('BusquedasService', function ($http, $rootScope) {

    var self = this;

    self.buscar = function (url, textoDeBusqueda, numeroDePagina) {
        return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-') + '?page=' + numeroDePagina, {
        //   return $http.get(settings.apiUrl+'search/' + url + textoDeBusqueda.split(' ').join('-'),{
            headers: {
                "Token": $rootScope.sesionActual.idSesion
            }
        });
    };

});

myApp.service('ListService', function ($http, $rootScope) {

    var self = this;

    self.intersectionOf = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'admin/user/' + lista1.id + '/' + lista2.id + '/', {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.getAct = function (sesionActual, lista, callback) {
        return $http.get(settings.apiUrl+'user/ranking/' + lista, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };



    self.intersection = function (lista1, lista2, sesionActual, callback) {
        return $http.get(settings.apiUrl+'list/' + lista1.id + '/' + lista2.id, {
            headers: {'token': sesionActual.idSesion}
        }).then(callback);
    };

    self.createList = function (nombre) {
        return $http.post(settings.apiUrl+'list/', nombre, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        })
    };

    self.agregarALista = function (pelicula, lista) {
        return $http.post(settings.apiUrl+'list/' + lista.id + '/', pelicula, {
            headers: {'token': $rootScope.sesionActual.idSesion}
        });
    };

    self.quitarDeLista = function (pelicula, lista) {
        // return $http({
        //     method: 'DELETE',
        //     url: 'http://localhost:8080/list/' + lista.id + '/',
        //     data: {
        //         movie: pelicula
        //     },
        //     headers: {
        //         'token': $rootScope.sesionActual.idSesion
        //     }
        // });
        return $http.delete(settings.apiUrl+'list/' + lista.id + '/'+ pelicula.id,{
            headers: {'token': $rootScope.sesionActual.idSesion}
        });


    };

});

'use strict';

myApp.service('Sesion', function ($http, $rootScope) {

    var self = this;

    self.login = function (credentials) {
        return $http.post(settings.apiUrl+'authentication/login', credentials);
    };

    self.logout = function () {
        return $http.put(settings.apiUrl+'authentication/logout',undefined,{headers: {"token": $rootScope.sesionActual.idSesion}})
    };

});

/**
 * Created by aye on 01/05/17.
 */
'use strict';

myApp.service('Usuario', function ($http, $rootScope) {

    var self = this;

    self.register = function (credentials) {
        return $http.post(settings.apiUrl+'user/', credentials);
    };

    self.getRecMovies = function (sesion,callback) {
        return $http.get(settings.apiUrl+'user/favoriteactor/movies', {
            headers: {'token': sesion.idSesion}
        }).then(callback);
    }

    self.actoresFavoritos = function (credentials) {
        return $http.get(settings.apiUrl+'user/favoriteactor/',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }

    self.marcarActorFavorito = function (actor) {
      return $http.put(settings.apiUrl+'user/favoriteactor/', actor,
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
  self.desmarcarActorFavorito = function (actor_id) {
    return $http.put(settings.apiUrl+'user/favoriteactor/' + actor_id,null,
      {
        headers: {
          'token': $rootScope.sesionActual.idSesion
        }
      }
    );
  }

    self.getListas = function (credentials) {
        return $http.get(settings.apiUrl+'user/movieLists', {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    };
    self.getRankingActoresFavoritos = function () {
        return $http.get(settings.apiUrl+'user/favoriteactor/ranking',
            {
                headers: {
                    'token': $rootScope.sesionActual.idSesion
                }
            }
        );
    }



})
;

myApp.controller('navbar', function($scope) {
  $scope.isNavCollapsed = true;
  $scope.isCollapsed = false;
  $scope.isCollapsedHorizontal = false;
  $scope.search={
    query: "",
    options: ["Movies","People","Anything"],
    by: "Movies"
  }

});

myApp.controller('adminController', function ($rootScope, $scope, $state, Admin) {
    var self = this;
    self.users = [];
    self.usersSelec = [];
    self.selectedUser = "";
    self.visibleData = false;
    self.sesion = $rootScope.sesionActual;


    self.importUsers = function () {
        Admin.getUsers($rootScope.sesionActual,
            function (response) {
                self.users = response.data
            })
    }

    self.importUsers();

    self.cleanSelected = function () {
        self.visibleData = false;
        self.users.map(function (us) {
            us.selected = false;
        })
    }

    self.compareSelected = function () {
        self.usersSelec = self.users.filter(function (user) {
            return user.selected
        })
        if (self.usersSelec.length != 2) {
            self.errorMessage = "Seleccione sólo dos usuarios"
        }
        else if (self.usersSelec.some(function (e) {
                return e.lists.length === 0
            })) {
            self.errorMessage = "Uno de los usuarios no posee listas"
        }
        else {
            self.visibleData = false;
            $state.go('users.lists', {usersSel: self.usersSelec})
        }

    }


    self.dateFormat = function (date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
    };

    self.showUsers = function () {
        return self.users;
    };

    self.esAdmin = function () {
        return $rootScope.esAdmin;
    };

    self.getUsername = function () {
        try {
            if (self.selectedUser.username === null) {
                return "Sin Username"
            }
            else {
                return self.selectedUser.username;
            }
        }
        catch (e) {

        }


    };

    self.getLastAccess = function () {
        try {
            if (self.selectedUser.lastAccess === null) {
                return "No inició sesión"
            }
            else {
                var d = new Date(self.selectedUser.lastAccess);
                return self.dateFormat(d);
            }
        }
        catch (e) {

        }

    };

    self.numList = function () {
        try {
            if (self.selectedUser.lists === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.lists.length
            }
        }
        catch (e) {

        }
    }

    self.getMovies = function () {
        try {
            if (self.selectedUser.lists === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.lists
            }
        }
        catch (e) {

        }
    }

    self.numFavAct = function () {
        try {
            if (self.selectedUser.favoriteActors === null) {
                return "No hay información"
            }
            else {
                return self.selectedUser.favoriteActors.length
            }
        }
        catch (e) {

        }


    }

    self.hide = function () {
        self.visibleData = false;
    }

    self.getInfo = function (id) {
        Admin.getData($rootScope.sesionActual, id,
            function (response) {
                self.selectedUser = response.data;
                self.visibleData = true;

            })
    }

});
/**
 * Created by Rodrigo on 08/05/2017.
 */
myApp.controller('adminRankingController', function ($rootScope, $scope, Usuario) {

    function getRanking() {
        Usuario.getRankingActoresFavoritos()
            .then(function (response) {
                $scope.ranking = response.data
            });
    }

    getRanking();

});
myApp.controller('fichaController', function($scope, $http, $stateParams) {

  $scope.traerFicha = function(tipo) {
    $http.get(settings.apiUrl + tipo + '/' + $stateParams.fichaId, {
      headers: {
        "Token": '12345'
      }
    }).then(function(response) {
      $scope.item = response.data;
    })
  }
});

myApp.controller('favoritosController', function ($rootScope, $scope, Usuario) {

    var self = this;

    $scope.actoresFavoritos = [];
    self.recMovies = undefined;
    self.visible = false;

    $scope.searchRecMovies = function () {
        Usuario.getRecMovies($rootScope.sesionActual,
            function (response) {
                self.recMovies = response.data;
                self.visible = true;
            })
    };

    this.actoresFavoritos = function () {
        Usuario.actoresFavoritos()
            .then(function (actores) {
                $scope.actoresFavoritos = actores.data;
            });
    };

    $scope.sacarDeFavorito = function (actor) {
        $scope.actoresFavoritos.splice($scope.actoresFavoritos.indexOf(actor), 1);
        Usuario.desmarcarActorFavorito(actor)
    }

    this.actoresFavoritos();

});


myApp.controller('fichaPeliculaController', function($scope, $http, $stateParams) {

  $http.get(settings.apiUrl+'movie/' + $stateParams.movieId, {
    headers: {
      "Token": '12345'
    }
  }).then(function(response) {
    $scope.movie = response.data;
  })
});

/**
 * Created by Rodrigo on 02/05/2017.
 */
myApp.controller('headerController', function($rootScope,$scope,$state,Sesion) {

    $scope.logout = function () {

        Sesion.logout()
            .then(function(response) {
                $rootScope.usuarioLogueado = false;
                $rootScope.sesionActual = undefined;
                $state.go('login');
            })
            .catch(function(error) {
                alert(error.data.message);
            })

    };

});
/**
 * Created by Rodrigo on 01/05/2017.
 */
myApp.controller('HomeController', function ($scope, BusquedasService, Usuario, ListService) {

    var movies = {
        name: "Movies",
        titleLabel: "Titulo",
        url: "movie/",
        agregarLista: true

    };

    var people = {
        name: "People",
        titleLabel: "Nombre",
        url: "person/",
        agregarFavorito: true
    };

    var anything = {
        name: "Anything",
        titleLabel: "Titulo/Nombre",
        url: "",
        mostrarTipo: true
    };

    var ultimaBusquedaPor = movies;

    $scope.search = {
        query: "",
        options: [movies, people, anything],
        by: movies
    };

    function llenarGrillaDeResultados(buscarPor, textoABuscar) {
        BusquedasService.buscar(buscarPor.url, textoABuscar, $scope.numeroDePagina)
            .then(function (response) {
                if (response.data.results <= 0) {
                    alert("Lo sentimos, no se encontraron resultados para \"" + textoABuscar + "\"");
                    $scope.resultados = [];
                } else {
                    $scope.resultados = response.data.results;
                    $scope.cantidadDeResultados = response.data.total_results;
                }
                $scope.ultimaBusquedaPor = buscarPor;
            })
    }

    $scope.buscar = function (buscarPor, textoABuscar) {
        if (!textoABuscar)
            return;

        if (buscarPor.agregarLista)
            Usuario.getListas()
                .then(function (response) {
                    $scope.listas = response.data;
                });

        $scope.numeroDePagina = 1;

        llenarGrillaDeResultados(buscarPor, textoABuscar);
    };

    $scope.agregarComoFavorito = function (actor) {

        if ((actor.media_type == 'person') || ($scope.ultimaBusquedaPor == people)) {
            Usuario.marcarActorFavorito(actor)
                .then(function () {
                    alert('Actor agregado.');
                });
        } else {
            alert('Lo que seleccionó no es un actor');
            return;
        }
    };

    $scope.agregarALista = function (pelicula, lista) {
        if (lista)
            ListService.agregarALista(pelicula, lista)
                .then(function () {
                    alert('Pelicula agregada correctamente.');
                });
    }

    $scope.obtenerPagina = function () {
        llenarGrillaDeResultados($scope.search.by, $scope.search.query);
    }

    $scope.numeroDePagina = 1;

});

myApp.controller('listCompController', function ($rootScope, $scope,$state, $stateParams, ListService) {
    var self = this;
    self.user1 = $stateParams.usersSel[0]
    self.user1List = ""
    self.user2 = $stateParams.usersSel[1]
    self.user2List = ""
    self.intersection = null
    self.sesion = $rootScope.sesionActual;

    self.compare = function () {
        ListService.intersectionOf(self.user1List, self.user2List, self.sesion,
            function (response) {
                self.intersection = response.data;
            })
    }

  self.esAdmin = function () {
    return $rootScope.esAdmin;
  };
});

myApp.controller('listController', function ($rootScope, $scope, $state, $stateParams, ListService, Usuario) {

    var self = this;
    $scope.listas = [];

    $scope.create = function (nombre) {
        ListService.createList(nombre)
            .then(function (response) {
                $scope.movieList = response.data;
                $scope.listas.push(response.data);
                alert('Lista creada con exito.')
                $scope.nombre = undefined;
            })
    }

    self.getListas = function () {
        Usuario.getListas()
            .then(function (response) {
                $scope.listas = response.data;
            });
    }

    self.cleanSelected = function () {
        self.intersection = undefined;
        $scope.listas.map(function (l) {
            l.selected = false;
        })
    }
    
    self.getActores = function (id) {
        ListService.getAct($rootScope.sesionActual, id,
            function (response) {
                self.actores = response.data;
            })
    }

    self.compareSelected = function () {
        self.listasSelec = $scope.listas.filter(function (list) {
            return list.selected
        })
        if (self.listasSelec.length != 2) {
            self.errorMessage = "Seleccione sólo dos listas"
        }
        else if (self.listasSelec.some(function (e) {
                return e.movies.length === 0
            })) {
            self.errorMessage = "Una de las listas no posee películas"
        }
        else {
            ListService.intersectionOf(self.listasSelec[0], self.listasSelec[1], $rootScope.sesionActual,
                function (response) {
                    self.intersection = response.data;
                })
        }
    }

    $scope.quitarDeLista = function (peliculaAQuitar,list) {
        ListService.quitarDeLista(peliculaAQuitar,list).then(function () {
          alert('Pelicula quitada correctamente.');
          var movies = $scope.listas.filter(lista => lista.id === list.id)[0].movies;

          movies.splice(movies.indexOf(peliculaAQuitar),1);

        });
    };


    self.getListas();

});
myApp.controller('loginController', function ($rootScope, $scope, $state, Sesion) {

    $scope.userName = "";
    $scope.password = "";

    $scope.autenticarse = function () {

    Sesion.login({username: $scope.userName, password: $scope.password})
      .then(function (response) {
        $rootScope.sesionActual = response.data;
        $rootScope.usuarioLogueado = true;
        $rootScope.esAdmin = response.data.esAdmin;

        $state.go('home');
      })
      .catch(function (error) {
        alert(error.data.message);
      })

    };

});


'use strict';

myApp.controller('MainController', function($rootScope,$scope,$state) {

    $rootScope.usuarioLogueado = false;
    $rootScope.esAdmin = false;

    if($rootScope.usuarioLogueado){
        $state.go('home');
    }else{
        $state.go('login');
    }

});
'use strict';

myApp
  .controller('registerController', function ($scope, $state, Usuario) {

    $scope.userName = "";
    $scope.password1 = "";
    $scope.password2 = "";
    $scope.email = "";

    $scope.registerNewUser = function () {
      if ($scope.password1 === $scope.password2) {
        Usuario.register({username: $scope.userName, password: $scope.password1}).then(function (response) {
          alert("Usuario creado correctamente!");
          $state.go('login');
        })
          .catch(function (error) {
            alert(error.data.message);
          });
      } else {
        alert("Las passwords no coinciden", "Por favor revisalas antes de enviar el formulario", "error");
      }
    };

    $scope.returnToMain = function () {
      return $state.go('login');
    };

    $scope.contraseniasDistintas = function () {
      return $scope.password1 !== $scope.password2;
    }

  });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInNldHRpbmdzLmpzIiwic2VydmljZXMvQWRtaW4uanMiLCJzZXJ2aWNlcy9CdXNxdWVkYXNTZXJ2aWNlLmpzIiwic2VydmljZXMvTGlzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXNpb24uanMiLCJzZXJ2aWNlcy9Vc3VhcmlvLmpzIiwiY29tbW9ucy9ib290c3RyYXAuanMiLCJjb250cm9sbGVycy9hZG1pbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hZG1pblJhbmtpbmdDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYnVzY2FyTW92aWVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9maWNoYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvaGVhZGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbXBDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbGlzdENvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9sb2dpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9NYWluQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJ10pO1xyXG4iLCJteUFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcclxuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xyXG4gIHZhciBzdGF0ZXMgPSBbe1xyXG4gICAgICBuYW1lOiAnaG9tZScsXHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcclxuICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdGVyQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZWdpc3Rlci5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTogJ2FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgICB1cmw6ICcvYWN0b3Jlc0Zhdm9yaXRvcycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2xpc3RhcycsXHJcbiAgICAgIHVybDogJy9saXN0YXMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbGlzdGFzL2xpc3QuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAge1xyXG4gICAgICBuYW1lOiAnYnVzY2FyTW92aWVzJyxcclxuICAgICAgdXJsOiAnL2J1c2Nhci9wZWxpY3VsYS8nLFxyXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzJyxcclxuICAgICAgdXJsOiAnL3VzZXJzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL3VzZXJzLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ3VzZXJzLmxpc3RzJyxcclxuICAgICAgdXJsOiAnL2xpc3RzJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdXNlcnNTZWw6IG51bGxcclxuICAgICAgfSxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGFpbmVyQCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2FkbWluL2xpc3RDb21wYXJpc29uLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZpY2hhUGVsaWN1bGEnLFxyXG4gICAgICB1cmw6ICcvbW92aWUvOmZpY2hhSWQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlbGljdWxhLmh0bWwnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHtcclxuICAgICAgbmFtZTogJ2ZpY2hhUGVyc29uYScsXHJcbiAgICAgIHVybDogJy9wZXJzb24vOmZpY2hhSWQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250YWluZXJAJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlcnNvbmEuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbntcclxuICBuYW1lOiAncmFua2luZ0FjdG9yZXNGYXZvcml0b3MnLFxyXG4gICAgdXJsOiAnL3JhbmtpbmcnLFxyXG4gIHZpZXdzOiB7XHJcbiAgJ2NvbnRhaW5lckAnOiB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi9yYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcy5odG1sJ1xyXG4gIH1cclxufVxyXG59XHJcblxyXG4gIF1cclxuXHJcbiAgLy8gTG9vcCBvdmVyIHRoZSBzdGF0ZSBkZWZpbml0aW9ucyBhbmQgcmVnaXN0ZXIgdGhlbVxyXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShzdGF0ZSk7XHJcbiAgfSk7XHJcblxyXG59KTtcclxuIiwidmFyIHNldHRpbmdzID0ge1xyXG4gICAgYXBpVXJsOiAnL2FwaS8nXHJcbiAgLy8gYXBpVXJsOiAnL1RBQ1MtMWMyMDE3LUcxLTUuMC9hcGkvJ1xyXG59XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwNi8wNS8xNy5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbm15QXBwLnNlcnZpY2UoJ0FkbWluJywgZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5nZXRVc2VycyA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnYWRtaW4vdXNlci9saXN0Jywge1xyXG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgfSkudGhlbihjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBzZWxmLmdldERhdGEgPSBmdW5jdGlvbiAoc2VzaW9uQWN0dWFsLCBpZCwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydhZG1pbi91c2VyLycgKyBpZCwge1xyXG4gICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgfSkudGhlbihjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cclxuICovXHJcbm15QXBwLnNlcnZpY2UoJ0J1c3F1ZWRhc1NlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5idXNjYXIgPSBmdW5jdGlvbiAodXJsLCB0ZXh0b0RlQnVzcXVlZGEsIG51bWVyb0RlUGFnaW5hKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3NlYXJjaC8nICsgdXJsICsgdGV4dG9EZUJ1c3F1ZWRhLnNwbGl0KCcgJykuam9pbignLScpICsgJz9wYWdlPScgKyBudW1lcm9EZVBhZ2luYSwge1xyXG4gICAgICAgIC8vICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3NlYXJjaC8nICsgdXJsICsgdGV4dG9EZUJ1c3F1ZWRhLnNwbGl0KCcgJykuam9pbignLScpLHtcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJUb2tlblwiOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxufSk7XHJcbiIsIm15QXBwLnNlcnZpY2UoJ0xpc3RTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2YgPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnYWRtaW4vdXNlci8nICsgbGlzdGExLmlkICsgJy8nICsgbGlzdGEyLmlkICsgJy8nLCB7XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0QWN0ID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgbGlzdGEsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvcmFua2luZy8nICsgbGlzdGEsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH07XHJcblxyXG5cclxuXHJcbiAgICBzZWxmLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChsaXN0YTEsIGxpc3RhMiwgc2VzaW9uQWN0dWFsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydsaXN0LycgKyBsaXN0YTEuaWQgKyAnLycgKyBsaXN0YTIuaWQsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5jcmVhdGVMaXN0ID0gZnVuY3Rpb24gKG5vbWJyZSkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsnbGlzdC8nLCBub21icmUsIHtcclxuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuYWdyZWdhckFMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYSwgbGlzdGEpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChzZXR0aW5ncy5hcGlVcmwrJ2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLCBwZWxpY3VsYSwge1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYucXVpdGFyRGVMaXN0YSA9IGZ1bmN0aW9uIChwZWxpY3VsYSwgbGlzdGEpIHtcclxuICAgICAgICAvLyByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgIC8vICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIC8vICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvbGlzdC8nICsgbGlzdGEuaWQgKyAnLycsXHJcbiAgICAgICAgLy8gICAgIGRhdGE6IHtcclxuICAgICAgICAvLyAgICAgICAgIG1vdmllOiBwZWxpY3VsYVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShzZXR0aW5ncy5hcGlVcmwrJ2xpc3QvJyArIGxpc3RhLmlkICsgJy8nKyBwZWxpY3VsYS5pZCx7XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfTtcclxuXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5zZXJ2aWNlKCdTZXNpb24nLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsnYXV0aGVudGljYXRpb24vbG9naW4nLCBjcmVkZW50aWFscyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoc2V0dGluZ3MuYXBpVXJsKydhdXRoZW50aWNhdGlvbi9sb2dvdXQnLHVuZGVmaW5lZCx7aGVhZGVyczoge1widG9rZW5cIjogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb259fSlcclxuICAgIH07XHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYXllIG9uIDAxLzA1LzE3LlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxubXlBcHAuc2VydmljZSgnVXN1YXJpbycsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBzZWxmLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qoc2V0dGluZ3MuYXBpVXJsKyd1c2VyLycsIGNyZWRlbnRpYWxzKTtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5nZXRSZWNNb3ZpZXMgPSBmdW5jdGlvbiAoc2VzaW9uLGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvZmF2b3JpdGVhY3Rvci9tb3ZpZXMnLCB7XHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb24uaWRTZXNpb259XHJcbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5hY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvZmF2b3JpdGVhY3Rvci8nLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5tYXJjYXJBY3RvckZhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvJywgYWN0b3IsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcbiAgc2VsZi5kZXNtYXJjYXJBY3RvckZhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yX2lkKSB7XHJcbiAgICByZXR1cm4gJGh0dHAucHV0KHNldHRpbmdzLmFwaVVybCsndXNlci9mYXZvcml0ZWFjdG9yLycgKyBhY3Rvcl9pZCxudWxsLFxyXG4gICAgICB7XHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAgIHNlbGYuZ2V0TGlzdGFzID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3VzZXIvbW92aWVMaXN0cycsIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH07XHJcbiAgICBzZWxmLmdldFJhbmtpbmdBY3RvcmVzRmF2b3JpdG9zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvcmFua2luZycsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxufSlcclxuO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCduYXZiYXInLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAkc2NvcGUuaXNOYXZDb2xsYXBzZWQgPSB0cnVlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICRzY29wZS5pc0NvbGxhcHNlZEhvcml6b250YWwgPSBmYWxzZTtcclxuICAkc2NvcGUuc2VhcmNoPXtcclxuICAgIHF1ZXJ5OiBcIlwiLFxyXG4gICAgb3B0aW9uczogW1wiTW92aWVzXCIsXCJQZW9wbGVcIixcIkFueXRoaW5nXCJdLFxyXG4gICAgYnk6IFwiTW92aWVzXCJcclxuICB9XHJcblxyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBBZG1pbikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi51c2VycyA9IFtdO1xyXG4gICAgc2VsZi51c2Vyc1NlbGVjID0gW107XHJcbiAgICBzZWxmLnNlbGVjdGVkVXNlciA9IFwiXCI7XHJcbiAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XHJcbiAgICBzZWxmLnNlc2lvbiA9ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsO1xyXG5cclxuXHJcbiAgICBzZWxmLmltcG9ydFVzZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIEFkbWluLmdldFVzZXJzKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXNlcnMgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5pbXBvcnRVc2VycygpO1xyXG5cclxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XHJcbiAgICAgICAgc2VsZi51c2Vycy5tYXAoZnVuY3Rpb24gKHVzKSB7XHJcbiAgICAgICAgICAgIHVzLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNvbXBhcmVTZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLnVzZXJzU2VsZWMgPSBzZWxmLnVzZXJzLmZpbHRlcihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlci5zZWxlY3RlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHNlbGYudXNlcnNTZWxlYy5sZW5ndGggIT0gMikge1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiU2VsZWNjaW9uZSBzw7NsbyBkb3MgdXN1YXJpb3NcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzZWxmLnVzZXJzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubGlzdHMubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZXJyb3JNZXNzYWdlID0gXCJVbm8gZGUgbG9zIHVzdWFyaW9zIG5vIHBvc2VlIGxpc3Rhc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbygndXNlcnMubGlzdHMnLCB7dXNlcnNTZWw6IHNlbGYudXNlcnNTZWxlY30pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgc2VsZi5kYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICB2YXIgbW9udGggPSAoMSArIGRhdGUuZ2V0TW9udGgoKSkudG9TdHJpbmcoKTtcclxuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICcwJyArIG1vbnRoO1xyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlLmdldERhdGUoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGRheSA9IGRheS5sZW5ndGggPiAxID8gZGF5IDogJzAnICsgZGF5O1xyXG4gICAgICAgIHJldHVybiBkYXkgKyAnLycgKyBtb250aCArICcvJyArIHllYXI7XHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuc2hvd1VzZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnVzZXJzO1xyXG4gICAgfTtcclxuXHJcbiAgICBzZWxmLmVzQWRtaW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuZXNBZG1pbjtcclxuICAgIH07XHJcblxyXG4gICAgc2VsZi5nZXRVc2VybmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIudXNlcm5hbWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlNpbiBVc2VybmFtZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIudXNlcm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYuZ2V0TGFzdEFjY2VzcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2VzcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaW5pY2nDsyBzZXNpw7NuXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5kYXRlRm9ybWF0KGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHNlbGYubnVtTGlzdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzLmxlbmd0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldE1vdmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYubnVtRmF2QWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaGF5IGluZm9ybWFjacOzblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5oaWRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldEluZm8gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICBBZG1pbi5nZXREYXRhKCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLCBpZCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkVXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDA4LzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5jb250cm9sbGVyKCdhZG1pblJhbmtpbmdDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXN1YXJpbykge1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJhbmtpbmcoKSB7XHJcbiAgICAgICAgVXN1YXJpby5nZXRSYW5raW5nQWN0b3Jlc0Zhdm9yaXRvcygpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJhbmtpbmcgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmtpbmcoKTtcclxuXHJcbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2ZpY2hhQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xyXG5cclxuICAkc2NvcGUudHJhZXJGaWNoYSA9IGZ1bmN0aW9uKHRpcG8pIHtcclxuICAgICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwgKyB0aXBvICsgJy8nICsgJHN0YXRlUGFyYW1zLmZpY2hhSWQsIHtcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIFwiVG9rZW5cIjogJzEyMzQ1J1xyXG4gICAgICB9XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICRzY29wZS5pdGVtID0gcmVzcG9uc2UuZGF0YTtcclxuICAgIH0pXHJcbiAgfVxyXG59KTtcclxuIiwibXlBcHAuY29udHJvbGxlcignZmF2b3JpdG9zQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFVzdWFyaW8pIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MgPSBbXTtcclxuICAgIHNlbGYucmVjTW92aWVzID0gdW5kZWZpbmVkO1xyXG4gICAgc2VsZi52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgJHNjb3BlLnNlYXJjaFJlY01vdmllcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVc3VhcmlvLmdldFJlY01vdmllcygkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlY01vdmllcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgVXN1YXJpby5hY3RvcmVzRmF2b3JpdG9zKClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGFjdG9yZXMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zID0gYWN0b3Jlcy5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNhY2FyRGVGYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcikge1xyXG4gICAgICAgICRzY29wZS5hY3RvcmVzRmF2b3JpdG9zLnNwbGljZSgkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcy5pbmRleE9mKGFjdG9yKSwgMSk7XHJcbiAgICAgICAgVXN1YXJpby5kZXNtYXJjYXJBY3RvckZhdm9yaXRvKGFjdG9yKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcygpO1xyXG5cclxufSk7XHJcblxyXG4iLCJteUFwcC5jb250cm9sbGVyKCdmaWNoYVBlbGljdWxhQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xyXG5cclxuICAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydtb3ZpZS8nICsgJHN0YXRlUGFyYW1zLm1vdmllSWQsIHtcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJUb2tlblwiOiAnMTIzNDUnXHJcbiAgICB9XHJcbiAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgJHNjb3BlLm1vdmllID0gcmVzcG9uc2UuZGF0YTtcclxuICB9KVxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgUm9kcmlnbyBvbiAwMi8wNS8yMDE3LlxyXG4gKi9cclxubXlBcHAuY29udHJvbGxlcignaGVhZGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSxTZXNpb24pIHtcclxuXHJcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBTZXNpb24ubG9nb3V0KClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgIH07XHJcblxyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXHJcbiAqL1xyXG5teUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEJ1c3F1ZWRhc1NlcnZpY2UsIFVzdWFyaW8sIExpc3RTZXJ2aWNlKSB7XHJcblxyXG4gICAgdmFyIG1vdmllcyA9IHtcclxuICAgICAgICBuYW1lOiBcIk1vdmllc1wiLFxyXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiVGl0dWxvXCIsXHJcbiAgICAgICAgdXJsOiBcIm1vdmllL1wiLFxyXG4gICAgICAgIGFncmVnYXJMaXN0YTogdHJ1ZVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBlb3BsZSA9IHtcclxuICAgICAgICBuYW1lOiBcIlBlb3BsZVwiLFxyXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiTm9tYnJlXCIsXHJcbiAgICAgICAgdXJsOiBcInBlcnNvbi9cIixcclxuICAgICAgICBhZ3JlZ2FyRmF2b3JpdG86IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGFueXRoaW5nID0ge1xyXG4gICAgICAgIG5hbWU6IFwiQW55dGhpbmdcIixcclxuICAgICAgICB0aXRsZUxhYmVsOiBcIlRpdHVsby9Ob21icmVcIixcclxuICAgICAgICB1cmw6IFwiXCIsXHJcbiAgICAgICAgbW9zdHJhclRpcG86IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVsdGltYUJ1c3F1ZWRhUG9yID0gbW92aWVzO1xyXG5cclxuICAgICRzY29wZS5zZWFyY2ggPSB7XHJcbiAgICAgICAgcXVlcnk6IFwiXCIsXHJcbiAgICAgICAgb3B0aW9uczogW21vdmllcywgcGVvcGxlLCBhbnl0aGluZ10sXHJcbiAgICAgICAgYnk6IG1vdmllc1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBsbGVuYXJHcmlsbGFEZVJlc3VsdGFkb3MoYnVzY2FyUG9yLCB0ZXh0b0FCdXNjYXIpIHtcclxuICAgICAgICBCdXNxdWVkYXNTZXJ2aWNlLmJ1c2NhcihidXNjYXJQb3IudXJsLCB0ZXh0b0FCdXNjYXIsICRzY29wZS5udW1lcm9EZVBhZ2luYSlcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkxvIHNlbnRpbW9zLCBubyBzZSBlbmNvbnRyYXJvbiByZXN1bHRhZG9zIHBhcmEgXFxcIlwiICsgdGV4dG9BQnVzY2FyICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gW107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHRhZG9zID0gcmVzcG9uc2UuZGF0YS5yZXN1bHRzO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jYW50aWRhZERlUmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEudG90YWxfcmVzdWx0cztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9IGJ1c2NhclBvcjtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYnVzY2FyID0gZnVuY3Rpb24gKGJ1c2NhclBvciwgdGV4dG9BQnVzY2FyKSB7XHJcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGJ1c2NhclBvci5hZ3JlZ2FyTGlzdGEpXHJcbiAgICAgICAgICAgIFVzdWFyaW8uZ2V0TGlzdGFzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRzY29wZS5udW1lcm9EZVBhZ2luYSA9IDE7XHJcblxyXG4gICAgICAgIGxsZW5hckdyaWxsYURlUmVzdWx0YWRvcyhidXNjYXJQb3IsIHRleHRvQUJ1c2Nhcik7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZ3JlZ2FyQ29tb0Zhdm9yaXRvID0gZnVuY3Rpb24gKGFjdG9yKSB7XHJcblxyXG4gICAgICAgIGlmICgoYWN0b3IubWVkaWFfdHlwZSA9PSAncGVyc29uJykgfHwgKCRzY29wZS51bHRpbWFCdXNxdWVkYVBvciA9PSBwZW9wbGUpKSB7XHJcbiAgICAgICAgICAgIFVzdWFyaW8ubWFyY2FyQWN0b3JGYXZvcml0byhhY3RvcilcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydCgnQWN0b3IgYWdyZWdhZG8uJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydCgnTG8gcXVlIHNlbGVjY2lvbsOzIG5vIGVzIHVuIGFjdG9yJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZ3JlZ2FyQUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xyXG4gICAgICAgIGlmIChsaXN0YSlcclxuICAgICAgICAgICAgTGlzdFNlcnZpY2UuYWdyZWdhckFMaXN0YShwZWxpY3VsYSwgbGlzdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BlbGljdWxhIGFncmVnYWRhIGNvcnJlY3RhbWVudGUuJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUub2J0ZW5lclBhZ2luYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsbGVuYXJHcmlsbGFEZVJlc3VsdGFkb3MoJHNjb3BlLnNlYXJjaC5ieSwgJHNjb3BlLnNlYXJjaC5xdWVyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLm51bWVyb0RlUGFnaW5hID0gMTtcclxuXHJcbn0pO1xyXG4iLCJteUFwcC5jb250cm9sbGVyKCdsaXN0Q29tcENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBMaXN0U2VydmljZSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi51c2VyMSA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFswXVxyXG4gICAgc2VsZi51c2VyMUxpc3QgPSBcIlwiXHJcbiAgICBzZWxmLnVzZXIyID0gJHN0YXRlUGFyYW1zLnVzZXJzU2VsWzFdXHJcbiAgICBzZWxmLnVzZXIyTGlzdCA9IFwiXCJcclxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gbnVsbFxyXG4gICAgc2VsZi5zZXNpb24gPSAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbDtcclxuXHJcbiAgICBzZWxmLmNvbXBhcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuaW50ZXJzZWN0aW9uT2Yoc2VsZi51c2VyMUxpc3QsIHNlbGYudXNlcjJMaXN0LCBzZWxmLnNlc2lvbixcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gIHNlbGYuZXNBZG1pbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW47XHJcbiAgfTtcclxufSk7XHJcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlLCBVc3VhcmlvKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgJHNjb3BlLmxpc3RhcyA9IFtdO1xyXG5cclxuICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbiAobm9tYnJlKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuY3JlYXRlTGlzdChub21icmUpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm1vdmllTGlzdCA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdGFzLnB1c2gocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnTGlzdGEgY3JlYWRhIGNvbiBleGl0by4nKVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vbWJyZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmdldExpc3RhcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RhcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzZWxmLmludGVyc2VjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAkc2NvcGUubGlzdGFzLm1hcChmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICBsLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2VsZi5nZXRBY3RvcmVzID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UuZ2V0QWN0KCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLCBpZCxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmFjdG9yZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuY29tcGFyZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYubGlzdGFzU2VsZWMgPSAkc2NvcGUubGlzdGFzLmZpbHRlcihmdW5jdGlvbiAobGlzdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlzdC5zZWxlY3RlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKHNlbGYubGlzdGFzU2VsZWMubGVuZ3RoICE9IDIpIHtcclxuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlNlbGVjY2lvbmUgc8OzbG8gZG9zIGxpc3Rhc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNlbGYubGlzdGFzU2VsZWMuc29tZShmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubW92aWVzLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiVW5hIGRlIGxhcyBsaXN0YXMgbm8gcG9zZWUgcGVsw61jdWxhc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLmxpc3Rhc1NlbGVjWzBdLCBzZWxmLmxpc3Rhc1NlbGVjWzFdLCAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5xdWl0YXJEZUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhQVF1aXRhcixsaXN0KSB7XHJcbiAgICAgICAgTGlzdFNlcnZpY2UucXVpdGFyRGVMaXN0YShwZWxpY3VsYUFRdWl0YXIsbGlzdCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBhbGVydCgnUGVsaWN1bGEgcXVpdGFkYSBjb3JyZWN0YW1lbnRlLicpO1xyXG4gICAgICAgICAgdmFyIG1vdmllcyA9ICRzY29wZS5saXN0YXMuZmlsdGVyKGxpc3RhID0+IGxpc3RhLmlkID09PSBsaXN0LmlkKVswXS5tb3ZpZXM7XHJcblxyXG4gICAgICAgICAgbW92aWVzLnNwbGljZShtb3ZpZXMuaW5kZXhPZihwZWxpY3VsYUFRdWl0YXIpLDEpO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIHNlbGYuZ2V0TGlzdGFzKCk7XHJcblxyXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFNlc2lvbikge1xyXG5cclxuICAgICRzY29wZS51c2VyTmFtZSA9IFwiXCI7XHJcbiAgICAkc2NvcGUucGFzc3dvcmQgPSBcIlwiO1xyXG5cclxuICAgICRzY29wZS5hdXRlbnRpY2Fyc2UgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgU2VzaW9uLmxvZ2luKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gdHJ1ZTtcclxuICAgICAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSByZXNwb25zZS5kYXRhLmVzQWRtaW47XHJcblxyXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgYWxlcnQoZXJyb3IuZGF0YS5tZXNzYWdlKTtcclxuICAgICAgfSlcclxuXHJcbiAgICB9O1xyXG5cclxufSk7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSkge1xyXG5cclxuICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XHJcbiAgICAkcm9vdFNjb3BlLmVzQWRtaW4gPSBmYWxzZTtcclxuXHJcbiAgICBpZigkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyl7XHJcbiAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICB9XHJcblxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5teUFwcFxyXG4gIC5jb250cm9sbGVyKCdyZWdpc3RlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsIFVzdWFyaW8pIHtcclxuXHJcbiAgICAkc2NvcGUudXNlck5hbWUgPSBcIlwiO1xyXG4gICAgJHNjb3BlLnBhc3N3b3JkMSA9IFwiXCI7XHJcbiAgICAkc2NvcGUucGFzc3dvcmQyID0gXCJcIjtcclxuICAgICRzY29wZS5lbWFpbCA9IFwiXCI7XHJcblxyXG4gICAgJHNjb3BlLnJlZ2lzdGVyTmV3VXNlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCRzY29wZS5wYXNzd29yZDEgPT09ICRzY29wZS5wYXNzd29yZDIpIHtcclxuICAgICAgICBVc3VhcmlvLnJlZ2lzdGVyKHt1c2VybmFtZTogJHNjb3BlLnVzZXJOYW1lLCBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkMX0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBhbGVydChcIlVzdWFyaW8gY3JlYWRvIGNvcnJlY3RhbWVudGUhXCIpO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhbGVydChcIkxhcyBwYXNzd29yZHMgbm8gY29pbmNpZGVuXCIsIFwiUG9yIGZhdm9yIHJldmlzYWxhcyBhbnRlcyBkZSBlbnZpYXIgZWwgZm9ybXVsYXJpb1wiLCBcImVycm9yXCIpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZXR1cm5Ub01haW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jb250cmFzZW5pYXNEaXN0aW50YXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAkc2NvcGUucGFzc3dvcmQxICE9PSAkc2NvcGUucGFzc3dvcmQyO1xyXG4gICAgfVxyXG5cclxuICB9KTsiXX0=
