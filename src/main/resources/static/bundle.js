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
          templateUrl: 'templates/favoritos/actoresFavoritos.html'
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
}

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


myApp.controller('fichaController', function($scope, $http, $stateParams, $rootScope) {

  $scope.traerFicha = function(tipo) {
    $http.get(settings.apiUrl + tipo + '/' + $stateParams.fichaId, {
      headers: {
        'token': $rootScope.sesionActual.idSesion
      }
    }).then(function(response) {
      $scope.item = response.data;
    });
    // $http.get(settings.apiUrl + 'user/movieLists', {
    //   headers: {
    //     'token': $rootScope.sesionActual.idSesion
    //   }
    // }).then(function(response) {
    //   $scope.listas = response.data;
    // })
  };

  // self.marcarActorFavorito = function(actor) {
  //   return $http.put(settings.apiUrl + 'user/favoriteactor/', actor, {
  //     headers: {
  //       'token': $rootScope.sesionActual.idSesion
  //     }
  //   });
  //   alert('Actor agregado.');
  // };
  //
  // self.agregarALista = function(pelicula, lista) {
  //   return $http.post(settings.apiUrl + 'list/' + lista.id + '/', pelicula, {
  //     headers: {
  //       'token': $rootScope.sesionActual.idSesion
  //     }
  //   });
  //   alert('Movie Agregada.');
  // };

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlci5qcyIsInNldHRpbmdzLmpzIiwiY29tbW9ucy9ib290c3RyYXAuanMiLCJjb250cm9sbGVycy9Ib21lQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL01haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYWRtaW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvYWRtaW5SYW5raW5nQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Zhdm9yaXRvc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9maWNoYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvaGVhZGVyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb21wQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2xpc3RDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbG9naW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcmVnaXN0ZXJDb250cm9sbGVyLmpzIiwic2VydmljZXMvQWRtaW4uanMiLCJzZXJ2aWNlcy9CdXNxdWVkYXNTZXJ2aWNlLmpzIiwic2VydmljZXMvTGlzdFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXNpb24uanMiLCJzZXJ2aWNlcy9Vc3VhcmlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJywgJ3VpLmJvb3RzdHJhcCddKTtcbiIsIm15QXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAvLyBBbiBhcnJheSBvZiBzdGF0ZSBkZWZpbml0aW9uc1xuICB2YXIgc3RhdGVzID0gW3tcbiAgICAgIG5hbWU6ICdob21lJyxcbiAgICAgIHVybDogJy8nLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdsb2dpbkNvbnRyb2xsZXInLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3JlZ2lzdGVyJyxcbiAgICAgIHVybDogJy9yZWdpc3RlcicsXG4gICAgICBjb250cm9sbGVyOiAncmVnaXN0ZXJDb250cm9sbGVyJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JlZ2lzdGVyLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdhY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHVybDogJy9hY3RvcmVzRmF2b3JpdG9zJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2Zhdm9yaXRvcy9hY3RvcmVzRmF2b3JpdG9zLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2xpc3RhcycsXG4gICAgICB1cmw6ICcvbGlzdGFzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2xpc3Rhcy9saXN0Lmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2J1c2Nhck1vdmllcycsXG4gICAgICB1cmw6ICcvYnVzY2FyL3BlbGljdWxhLycsXG4gICAgICBjb250cm9sbGVyOiAnYnVzY2FyTW92aWVzQ29udHJvbGxlcicsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9idXNjYXIvbW92aWVzLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ3VzZXJzJyxcbiAgICAgIHVybDogJy91c2VycycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnY29udGFpbmVyQCc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9hZG1pbi91c2Vycy5odG1sJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHtcbiAgICAgIG5hbWU6ICd1c2Vycy5saXN0cycsXG4gICAgICB1cmw6ICcvbGlzdHMnLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHVzZXJzU2VsOiBudWxsXG4gICAgICB9LFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWRtaW4vbGlzdENvbXBhcmlzb24uaHRtbCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICB7XG4gICAgICBuYW1lOiAnZmljaGFQZWxpY3VsYScsXG4gICAgICB1cmw6ICcvbW92aWUvOmZpY2hhSWQnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ2NvbnRhaW5lckAnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZmljaGFzL3BlbGljdWxhLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAge1xuICAgICAgbmFtZTogJ2ZpY2hhUGVyc29uYScsXG4gICAgICB1cmw6ICcvcGVyc29uLzpmaWNoYUlkJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdjb250YWluZXJAJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2ZpY2hhcy9wZXJzb25hLmh0bWwnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxue1xuICBuYW1lOiAncmFua2luZ0FjdG9yZXNGYXZvcml0b3MnLFxuICAgIHVybDogJy9yYW5raW5nJyxcbiAgdmlld3M6IHtcbiAgJ2NvbnRhaW5lckAnOiB7XG4gICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvYWRtaW4vcmFua2luZ0FjdG9yZXNGYXZvcml0b3MuaHRtbCdcbiAgfVxufVxufVxuXG4gIF1cblxuICAvLyBMb29wIG92ZXIgdGhlIHN0YXRlIGRlZmluaXRpb25zIGFuZCByZWdpc3RlciB0aGVtXG4gIHN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoc3RhdGUpO1xuICB9KTtcblxufSk7XG4iLCJ2YXIgc2V0dGluZ3MgPSB7XG4gIGFwaVVybDogJy9hcGkvJ1xufVxuIiwibXlBcHAuY29udHJvbGxlcignbmF2YmFyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICRzY29wZS5pc05hdkNvbGxhcHNlZCA9IHRydWU7XG4gICRzY29wZS5pc0NvbGxhcHNlZCA9IGZhbHNlO1xuICAkc2NvcGUuaXNDb2xsYXBzZWRIb3Jpem9udGFsID0gZmFsc2U7XG4gICRzY29wZS5zZWFyY2g9e1xuICAgIHF1ZXJ5OiBcIlwiLFxuICAgIG9wdGlvbnM6IFtcIk1vdmllc1wiLFwiUGVvcGxlXCIsXCJBbnl0aGluZ1wiXSxcbiAgICBieTogXCJNb3ZpZXNcIlxuICB9XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDEvMDUvMjAxNy5cbiAqL1xubXlBcHAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCBCdXNxdWVkYXNTZXJ2aWNlLCBVc3VhcmlvLCBMaXN0U2VydmljZSkge1xuXG4gICAgdmFyIG1vdmllcyA9IHtcbiAgICAgICAgbmFtZTogXCJNb3ZpZXNcIixcbiAgICAgICAgdGl0bGVMYWJlbDogXCJUaXR1bG9cIixcbiAgICAgICAgdXJsOiBcIm1vdmllL1wiLFxuICAgICAgICBhZ3JlZ2FyTGlzdGE6IHRydWVcblxuICAgIH07XG5cbiAgICB2YXIgcGVvcGxlID0ge1xuICAgICAgICBuYW1lOiBcIlBlb3BsZVwiLFxuICAgICAgICB0aXRsZUxhYmVsOiBcIk5vbWJyZVwiLFxuICAgICAgICB1cmw6IFwicGVyc29uL1wiLFxuICAgICAgICBhZ3JlZ2FyRmF2b3JpdG86IHRydWVcbiAgICB9O1xuXG4gICAgdmFyIGFueXRoaW5nID0ge1xuICAgICAgICBuYW1lOiBcIkFueXRoaW5nXCIsXG4gICAgICAgIHRpdGxlTGFiZWw6IFwiVGl0dWxvL05vbWJyZVwiLFxuICAgICAgICB1cmw6IFwiXCIsXG4gICAgICAgIG1vc3RyYXJUaXBvOiB0cnVlXG4gICAgfTtcblxuICAgIHZhciB1bHRpbWFCdXNxdWVkYVBvciA9IG1vdmllcztcblxuICAgICRzY29wZS5zZWFyY2ggPSB7XG4gICAgICAgIHF1ZXJ5OiBcIlwiLFxuICAgICAgICBvcHRpb25zOiBbbW92aWVzLCBwZW9wbGUsIGFueXRoaW5nXSxcbiAgICAgICAgYnk6IG1vdmllc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsbGVuYXJHcmlsbGFEZVJlc3VsdGFkb3MoYnVzY2FyUG9yLCB0ZXh0b0FCdXNjYXIpIHtcbiAgICAgICAgQnVzcXVlZGFzU2VydmljZS5idXNjYXIoYnVzY2FyUG9yLnVybCwgdGV4dG9BQnVzY2FyLCAkc2NvcGUubnVtZXJvRGVQYWdpbmEpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXN1bHRzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJMbyBzZW50aW1vcywgbm8gc2UgZW5jb250cmFyb24gcmVzdWx0YWRvcyBwYXJhIFxcXCJcIiArIHRleHRvQUJ1c2NhciArIFwiXFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdGFkb3MgPSBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVzdWx0YWRvcyA9IHJlc3BvbnNlLmRhdGEucmVzdWx0cztcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNhbnRpZGFkRGVSZXN1bHRhZG9zID0gcmVzcG9uc2UuZGF0YS50b3RhbF9yZXN1bHRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkc2NvcGUudWx0aW1hQnVzcXVlZGFQb3IgPSBidXNjYXJQb3I7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgICRzY29wZS5idXNjYXIgPSBmdW5jdGlvbiAoYnVzY2FyUG9yLCB0ZXh0b0FCdXNjYXIpIHtcbiAgICAgICAgaWYgKCF0ZXh0b0FCdXNjYXIpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKGJ1c2NhclBvci5hZ3JlZ2FyTGlzdGEpXG4gICAgICAgICAgICBVc3VhcmlvLmdldExpc3RhcygpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5udW1lcm9EZVBhZ2luYSA9IDE7XG5cbiAgICAgICAgbGxlbmFyR3JpbGxhRGVSZXN1bHRhZG9zKGJ1c2NhclBvciwgdGV4dG9BQnVzY2FyKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFncmVnYXJDb21vRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3IpIHtcblxuICAgICAgICBpZiAoKGFjdG9yLm1lZGlhX3R5cGUgPT0gJ3BlcnNvbicpIHx8ICgkc2NvcGUudWx0aW1hQnVzcXVlZGFQb3IgPT0gcGVvcGxlKSkge1xuICAgICAgICAgICAgVXN1YXJpby5tYXJjYXJBY3RvckZhdm9yaXRvKGFjdG9yKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ0FjdG9yIGFncmVnYWRvLicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWxlcnQoJ0xvIHF1ZSBzZWxlY2Npb27DsyBubyBlcyB1biBhY3RvcicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5hZ3JlZ2FyQUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xuICAgICAgICBpZiAobGlzdGEpXG4gICAgICAgICAgICBMaXN0U2VydmljZS5hZ3JlZ2FyQUxpc3RhKHBlbGljdWxhLCBsaXN0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQZWxpY3VsYSBhZ3JlZ2FkYSBjb3JyZWN0YW1lbnRlLicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5vYnRlbmVyUGFnaW5hID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsbGVuYXJHcmlsbGFEZVJlc3VsdGFkb3MoJHNjb3BlLnNlYXJjaC5ieSwgJHNjb3BlLnNlYXJjaC5xdWVyeSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm51bWVyb0RlUGFnaW5hID0gMTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwkc2NvcGUsJHN0YXRlKSB7XG5cbiAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IGZhbHNlO1xuICAgICRyb290U2NvcGUuZXNBZG1pbiA9IGZhbHNlO1xuXG4gICAgaWYoJHJvb3RTY29wZS51c3VhcmlvTG9ndWVhZG8pe1xuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cblxufSk7IiwibXlBcHAuY29udHJvbGxlcignYWRtaW5Db250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCBBZG1pbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBzZWxmLnVzZXJzID0gW107XG4gICAgc2VsZi51c2Vyc1NlbGVjID0gW107XG4gICAgc2VsZi5zZWxlY3RlZFVzZXIgPSBcIlwiO1xuICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICBzZWxmLnNlc2lvbiA9ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsO1xuXG5cbiAgICBzZWxmLmltcG9ydFVzZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBBZG1pbi5nZXRVc2Vycygkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudXNlcnMgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuaW1wb3J0VXNlcnMoKTtcblxuICAgIHNlbGYuY2xlYW5TZWxlY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi52aXNpYmxlRGF0YSA9IGZhbHNlO1xuICAgICAgICBzZWxmLnVzZXJzLm1hcChmdW5jdGlvbiAodXMpIHtcbiAgICAgICAgICAgIHVzLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZi5jb21wYXJlU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXNlcnNTZWxlYyA9IHNlbGYudXNlcnMuZmlsdGVyKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zZWxlY3RlZFxuICAgICAgICB9KVxuICAgICAgICBpZiAoc2VsZi51c2Vyc1NlbGVjLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiU2VsZWNjaW9uZSBzw7NsbyBkb3MgdXN1YXJpb3NcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlbGYudXNlcnNTZWxlYy5zb21lKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUubGlzdHMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlVubyBkZSBsb3MgdXN1YXJpb3Mgbm8gcG9zZWUgbGlzdGFzXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSBmYWxzZTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygndXNlcnMubGlzdHMnLCB7dXNlcnNTZWw6IHNlbGYudXNlcnNTZWxlY30pXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgc2VsZi5kYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIHZhciBtb250aCA9ICgxICsgZGF0ZS5nZXRNb250aCgpKS50b1N0cmluZygpO1xuICAgICAgICBtb250aCA9IG1vbnRoLmxlbmd0aCA+IDEgPyBtb250aCA6ICcwJyArIG1vbnRoO1xuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKTtcbiAgICAgICAgZGF5ID0gZGF5Lmxlbmd0aCA+IDEgPyBkYXkgOiAnMCcgKyBkYXk7XG4gICAgICAgIHJldHVybiBkYXkgKyAnLycgKyBtb250aCArICcvJyArIHllYXI7XG4gICAgfTtcblxuICAgIHNlbGYuc2hvd1VzZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi51c2VycztcbiAgICB9O1xuXG4gICAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJHJvb3RTY29wZS5lc0FkbWluO1xuICAgIH07XG5cbiAgICBzZWxmLmdldFVzZXJuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc2VsZWN0ZWRVc2VyLnVzZXJuYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU2luIFVzZXJuYW1lXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci51c2VybmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfTtcblxuICAgIHNlbGYuZ2V0TGFzdEFjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5sYXN0QWNjZXNzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTm8gaW5pY2nDsyBzZXNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoc2VsZi5zZWxlY3RlZFVzZXIubGFzdEFjY2Vzcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZGF0ZUZvcm1hdChkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBzZWxmLm51bUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIubGlzdHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5saXN0cy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxmLmdldE1vdmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNlbGVjdGVkVXNlci5saXN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGhheSBpbmZvcm1hY2nDs25cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2VsZWN0ZWRVc2VyLmxpc3RzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZi5udW1GYXZBY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZWxlY3RlZFVzZXIuZmF2b3JpdGVBY3RvcnMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBoYXkgaW5mb3JtYWNpw7NuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnNlbGVjdGVkVXNlci5mYXZvcml0ZUFjdG9ycy5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2VsZi5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLnZpc2libGVEYXRhID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc2VsZi5nZXRJbmZvID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIEFkbWluLmdldERhdGEoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsIGlkLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFVzZXIgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIHNlbGYudmlzaWJsZURhdGEgPSB0cnVlO1xuXG4gICAgICAgICAgICB9KVxuICAgIH1cblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDgvMDUvMjAxNy5cbiAqL1xubXlBcHAuY29udHJvbGxlcignYWRtaW5SYW5raW5nQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsIFVzdWFyaW8pIHtcblxuICAgIGZ1bmN0aW9uIGdldFJhbmtpbmcoKSB7XG4gICAgICAgIFVzdWFyaW8uZ2V0UmFua2luZ0FjdG9yZXNGYXZvcml0b3MoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJhbmtpbmcgPSByZXNwb25zZS5kYXRhXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRSYW5raW5nKCk7XG5cbn0pOyIsIm15QXBwLmNvbnRyb2xsZXIoJ2Zhdm9yaXRvc0NvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBVc3VhcmlvKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcyA9IFtdO1xuICAgIHNlbGYucmVjTW92aWVzID0gdW5kZWZpbmVkO1xuICAgIHNlbGYudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLnNlYXJjaFJlY01vdmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVXN1YXJpby5nZXRSZWNNb3ZpZXMoJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlY01vdmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgc2VsZi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pXG4gICAgfTtcblxuICAgIHRoaXMuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVXN1YXJpby5hY3RvcmVzRmF2b3JpdG9zKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhY3RvcmVzKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MgPSBhY3RvcmVzLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhY2FyRGVGYXZvcml0byA9IGZ1bmN0aW9uIChhY3Rvcikge1xuICAgICAgICAkc2NvcGUuYWN0b3Jlc0Zhdm9yaXRvcy5zcGxpY2UoJHNjb3BlLmFjdG9yZXNGYXZvcml0b3MuaW5kZXhPZihhY3RvciksIDEpO1xuICAgICAgICBVc3VhcmlvLmRlc21hcmNhckFjdG9yRmF2b3JpdG8oYWN0b3IpXG4gICAgfVxuXG4gICAgdGhpcy5hY3RvcmVzRmF2b3JpdG9zKCk7XG5cbn0pO1xuXG4iLCJteUFwcC5jb250cm9sbGVyKCdmaWNoYUNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpIHtcblxuICAkc2NvcGUudHJhZXJGaWNoYSA9IGZ1bmN0aW9uKHRpcG8pIHtcbiAgICAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsICsgdGlwbyArICcvJyArICRzdGF0ZVBhcmFtcy5maWNoYUlkLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLml0ZW0gPSByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICAgIC8vICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwgKyAndXNlci9tb3ZpZUxpc3RzJywge1xuICAgIC8vICAgaGVhZGVyczoge1xuICAgIC8vICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgIC8vICAgfVxuICAgIC8vIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAvLyAgICRzY29wZS5saXN0YXMgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vIH0pXG4gIH07XG5cbiAgLy8gc2VsZi5tYXJjYXJBY3RvckZhdm9yaXRvID0gZnVuY3Rpb24oYWN0b3IpIHtcbiAgLy8gICByZXR1cm4gJGh0dHAucHV0KHNldHRpbmdzLmFwaVVybCArICd1c2VyL2Zhdm9yaXRlYWN0b3IvJywgYWN0b3IsIHtcbiAgLy8gICAgIGhlYWRlcnM6IHtcbiAgLy8gICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gICBhbGVydCgnQWN0b3IgYWdyZWdhZG8uJyk7XG4gIC8vIH07XG4gIC8vXG4gIC8vIHNlbGYuYWdyZWdhckFMaXN0YSA9IGZ1bmN0aW9uKHBlbGljdWxhLCBsaXN0YSkge1xuICAvLyAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCArICdsaXN0LycgKyBsaXN0YS5pZCArICcvJywgcGVsaWN1bGEsIHtcbiAgLy8gICAgIGhlYWRlcnM6IHtcbiAgLy8gICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gICBhbGVydCgnTW92aWUgQWdyZWdhZGEuJyk7XG4gIC8vIH07XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFJvZHJpZ28gb24gMDIvMDUvMjAxNy5cbiAqL1xubXlBcHAuY29udHJvbGxlcignaGVhZGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRzdGF0ZSxTZXNpb24pIHtcblxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgU2VzaW9uLmxvZ291dCgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUudXN1YXJpb0xvZ3VlYWRvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICB9KVxuXG4gICAgfTtcblxufSk7IiwibXlBcHAuY29udHJvbGxlcignbGlzdENvbXBDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwkc3RhdGUsICRzdGF0ZVBhcmFtcywgTGlzdFNlcnZpY2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi51c2VyMSA9ICRzdGF0ZVBhcmFtcy51c2Vyc1NlbFswXVxuICAgIHNlbGYudXNlcjFMaXN0ID0gXCJcIlxuICAgIHNlbGYudXNlcjIgPSAkc3RhdGVQYXJhbXMudXNlcnNTZWxbMV1cbiAgICBzZWxmLnVzZXIyTGlzdCA9IFwiXCJcbiAgICBzZWxmLmludGVyc2VjdGlvbiA9IG51bGxcbiAgICBzZWxmLnNlc2lvbiA9ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsO1xuXG4gICAgc2VsZi5jb21wYXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBMaXN0U2VydmljZS5pbnRlcnNlY3Rpb25PZihzZWxmLnVzZXIxTGlzdCwgc2VsZi51c2VyMkxpc3QsIHNlbGYuc2VzaW9uLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pbnRlcnNlY3Rpb24gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgc2VsZi5lc0FkbWluID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkcm9vdFNjb3BlLmVzQWRtaW47XG4gIH07XG59KTtcbiIsIm15QXBwLmNvbnRyb2xsZXIoJ2xpc3RDb250cm9sbGVyJywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlLCBVc3VhcmlvKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgJHNjb3BlLmxpc3RhcyA9IFtdO1xuXG4gICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uIChub21icmUpIHtcbiAgICAgICAgTGlzdFNlcnZpY2UuY3JlYXRlTGlzdChub21icmUpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubW92aWVMaXN0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubGlzdGFzLnB1c2gocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0xpc3RhIGNyZWFkYSBjb24gZXhpdG8uJylcbiAgICAgICAgICAgICAgICAkc2NvcGUubm9tYnJlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzZWxmLmdldExpc3RhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVXN1YXJpby5nZXRMaXN0YXMoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxpc3RhcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxmLmNsZWFuU2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAkc2NvcGUubGlzdGFzLm1hcChmdW5jdGlvbiAobCkge1xuICAgICAgICAgICAgbC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcbiAgICBzZWxmLmdldEFjdG9yZXMgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgTGlzdFNlcnZpY2UuZ2V0QWN0KCRyb290U2NvcGUuc2VzaW9uQWN0dWFsLCBpZCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHNlbGYuYWN0b3JlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIHNlbGYuY29tcGFyZVNlbGVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLmxpc3Rhc1NlbGVjID0gJHNjb3BlLmxpc3Rhcy5maWx0ZXIoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0LnNlbGVjdGVkXG4gICAgICAgIH0pXG4gICAgICAgIGlmIChzZWxmLmxpc3Rhc1NlbGVjLmxlbmd0aCAhPSAyKSB7XG4gICAgICAgICAgICBzZWxmLmVycm9yTWVzc2FnZSA9IFwiU2VsZWNjaW9uZSBzw7NsbyBkb3MgbGlzdGFzXCJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxmLmxpc3Rhc1NlbGVjLnNvbWUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZS5tb3ZpZXMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgc2VsZi5lcnJvck1lc3NhZ2UgPSBcIlVuYSBkZSBsYXMgbGlzdGFzIG5vIHBvc2VlIHBlbMOtY3VsYXNcIlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgTGlzdFNlcnZpY2UuaW50ZXJzZWN0aW9uT2Yoc2VsZi5saXN0YXNTZWxlY1swXSwgc2VsZi5saXN0YXNTZWxlY1sxXSwgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLnF1aXRhckRlTGlzdGEgPSBmdW5jdGlvbiAocGVsaWN1bGFBUXVpdGFyLGxpc3QpIHtcbiAgICAgICAgTGlzdFNlcnZpY2UucXVpdGFyRGVMaXN0YShwZWxpY3VsYUFRdWl0YXIsbGlzdCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYWxlcnQoJ1BlbGljdWxhIHF1aXRhZGEgY29ycmVjdGFtZW50ZS4nKTtcbiAgICAgICAgICB2YXIgbW92aWVzID0gJHNjb3BlLmxpc3Rhcy5maWx0ZXIobGlzdGEgPT4gbGlzdGEuaWQgPT09IGxpc3QuaWQpWzBdLm1vdmllcztcblxuICAgICAgICAgIG1vdmllcy5zcGxpY2UobW92aWVzLmluZGV4T2YocGVsaWN1bGFBUXVpdGFyKSwxKTtcblxuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICBzZWxmLmdldExpc3RhcygpO1xuXG59KTsiLCJteUFwcC5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCAkc3RhdGUsIFNlc2lvbikge1xuXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQgPSBcIlwiO1xuXG4gICAgJHNjb3BlLmF1dGVudGljYXJzZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgIFNlc2lvbi5sb2dpbih7dXNlcm5hbWU6ICRzY29wZS51c2VyTmFtZSwgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZH0pXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHJvb3RTY29wZS5zZXNpb25BY3R1YWwgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAkcm9vdFNjb3BlLnVzdWFyaW9Mb2d1ZWFkbyA9IHRydWU7XG4gICAgICAgICRyb290U2NvcGUuZXNBZG1pbiA9IHJlc3BvbnNlLmRhdGEuZXNBZG1pbjtcblxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yLmRhdGEubWVzc2FnZSk7XG4gICAgICB9KVxuXG4gICAgfTtcblxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubXlBcHBcbiAgLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgVXN1YXJpbykge1xuXG4gICAgJHNjb3BlLnVzZXJOYW1lID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQxID0gXCJcIjtcbiAgICAkc2NvcGUucGFzc3dvcmQyID0gXCJcIjtcbiAgICAkc2NvcGUuZW1haWwgPSBcIlwiO1xuXG4gICAgJHNjb3BlLnJlZ2lzdGVyTmV3VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkc2NvcGUucGFzc3dvcmQxID09PSAkc2NvcGUucGFzc3dvcmQyKSB7XG4gICAgICAgIFVzdWFyaW8ucmVnaXN0ZXIoe3VzZXJuYW1lOiAkc2NvcGUudXNlck5hbWUsIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmQxfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBhbGVydChcIlVzdWFyaW8gY3JlYWRvIGNvcnJlY3RhbWVudGUhXCIpO1xuICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvci5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJMYXMgcGFzc3dvcmRzIG5vIGNvaW5jaWRlblwiLCBcIlBvciBmYXZvciByZXZpc2FsYXMgYW50ZXMgZGUgZW52aWFyIGVsIGZvcm11bGFyaW9cIiwgXCJlcnJvclwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJldHVyblRvTWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb250cmFzZW5pYXNEaXN0aW50YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnBhc3N3b3JkMSAhPT0gJHNjb3BlLnBhc3N3b3JkMjtcbiAgICB9XG5cbiAgfSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwNi8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdBZG1pbicsIGZ1bmN0aW9uICgkaHR0cCkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLmdldFVzZXJzID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnYWRtaW4vdXNlci9saXN0Jywge1xuICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNlbGYuZ2V0RGF0YSA9IGZ1bmN0aW9uIChzZXNpb25BY3R1YWwsIGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydhZG1pbi91c2VyLycgKyBpZCwge1xuICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgfVxuXG59KTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSBSb2RyaWdvIG9uIDAxLzA1LzIwMTcuXG4gKi9cbm15QXBwLnNlcnZpY2UoJ0J1c3F1ZWRhc1NlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuYnVzY2FyID0gZnVuY3Rpb24gKHVybCwgdGV4dG9EZUJ1c3F1ZWRhLCBudW1lcm9EZVBhZ2luYSkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsnc2VhcmNoLycgKyB1cmwgKyB0ZXh0b0RlQnVzcXVlZGEuc3BsaXQoJyAnKS5qb2luKCctJykgKyAnP3BhZ2U9JyArIG51bWVyb0RlUGFnaW5hLCB7XG4gICAgICAgIC8vICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ3NlYXJjaC8nICsgdXJsICsgdGV4dG9EZUJ1c3F1ZWRhLnNwbGl0KCcgJykuam9pbignLScpLHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIlRva2VuXCI6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn0pO1xuIiwibXlBcHAuc2VydmljZSgnTGlzdFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuaW50ZXJzZWN0aW9uT2YgPSBmdW5jdGlvbiAobGlzdGExLCBsaXN0YTIsIHNlc2lvbkFjdHVhbCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChzZXR0aW5ncy5hcGlVcmwrJ2FkbWluL3VzZXIvJyArIGxpc3RhMS5pZCArICcvJyArIGxpc3RhMi5pZCArICcvJywge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6IHNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSkudGhlbihjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0QWN0ID0gZnVuY3Rpb24gKHNlc2lvbkFjdHVhbCwgbGlzdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL3JhbmtpbmcvJyArIGxpc3RhLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7J3Rva2VuJzogc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KS50aGVuKGNhbGxiYWNrKTtcbiAgICB9O1xuXG5cblxuICAgIHNlbGYuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gKGxpc3RhMSwgbGlzdGEyLCBzZXNpb25BY3R1YWwsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKydsaXN0LycgKyBsaXN0YTEuaWQgKyAnLycgKyBsaXN0YTIuaWQsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb25BY3R1YWwuaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBzZWxmLmNyZWF0ZUxpc3QgPSBmdW5jdGlvbiAobm9tYnJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsnbGlzdC8nLCBub21icmUsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn1cbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgc2VsZi5hZ3JlZ2FyQUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChzZXR0aW5ncy5hcGlVcmwrJ2xpc3QvJyArIGxpc3RhLmlkICsgJy8nLCBwZWxpY3VsYSwge1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgc2VsZi5xdWl0YXJEZUxpc3RhID0gZnVuY3Rpb24gKHBlbGljdWxhLCBsaXN0YSkge1xuICAgICAgICAvLyByZXR1cm4gJGh0dHAoe1xuICAgICAgICAvLyAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgLy8gICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9saXN0LycgKyBsaXN0YS5pZCArICcvJyxcbiAgICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgICAgLy8gICAgICAgICBtb3ZpZTogcGVsaWN1bGFcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC8vICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoc2V0dGluZ3MuYXBpVXJsKydsaXN0LycgKyBsaXN0YS5pZCArICcvJysgcGVsaWN1bGEuaWQse1xuICAgICAgICAgICAgaGVhZGVyczogeyd0b2tlbic6ICRyb290U2NvcGUuc2VzaW9uQWN0dWFsLmlkU2VzaW9ufVxuICAgICAgICB9KTtcblxuXG4gICAgfTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm15QXBwLnNlcnZpY2UoJ1Nlc2lvbicsIGZ1bmN0aW9uICgkaHR0cCwgJHJvb3RTY29wZSkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChzZXR0aW5ncy5hcGlVcmwrJ2F1dGhlbnRpY2F0aW9uL2xvZ2luJywgY3JlZGVudGlhbHMpO1xuICAgIH07XG5cbiAgICBzZWxmLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChzZXR0aW5ncy5hcGlVcmwrJ2F1dGhlbnRpY2F0aW9uL2xvZ291dCcsdW5kZWZpbmVkLHtoZWFkZXJzOiB7XCJ0b2tlblwiOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvbn19KVxuICAgIH07XG5cbn0pO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGF5ZSBvbiAwMS8wNS8xNy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5teUFwcC5zZXJ2aWNlKCdVc3VhcmlvJywgZnVuY3Rpb24gKCRodHRwLCAkcm9vdFNjb3BlKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHNldHRpbmdzLmFwaVVybCsndXNlci8nLCBjcmVkZW50aWFscyk7XG4gICAgfTtcblxuICAgIHNlbGYuZ2V0UmVjTW92aWVzID0gZnVuY3Rpb24gKHNlc2lvbixjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsndXNlci9mYXZvcml0ZWFjdG9yL21vdmllcycsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHsndG9rZW4nOiBzZXNpb24uaWRTZXNpb259XG4gICAgICAgIH0pLnRoZW4oY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHNlbGYuYWN0b3Jlc0Zhdm9yaXRvcyA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHNldHRpbmdzLmFwaVVybCsndXNlci9mYXZvcml0ZWFjdG9yLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBzZWxmLm1hcmNhckFjdG9yRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3IpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvJywgYWN0b3IsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuICBzZWxmLmRlc21hcmNhckFjdG9yRmF2b3JpdG8gPSBmdW5jdGlvbiAoYWN0b3JfaWQpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KHNldHRpbmdzLmFwaVVybCsndXNlci9mYXZvcml0ZWFjdG9yLycgKyBhY3Rvcl9pZCxudWxsLFxuICAgICAge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ3Rva2VuJzogJHJvb3RTY29wZS5zZXNpb25BY3R1YWwuaWRTZXNpb25cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICAgIHNlbGYuZ2V0TGlzdGFzID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL21vdmllTGlzdHMnLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9O1xuICAgIHNlbGYuZ2V0UmFua2luZ0FjdG9yZXNGYXZvcml0b3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoc2V0dGluZ3MuYXBpVXJsKyd1c2VyL2Zhdm9yaXRlYWN0b3IvcmFua2luZycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAndG9rZW4nOiAkcm9vdFNjb3BlLnNlc2lvbkFjdHVhbC5pZFNlc2lvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cblxuXG59KVxuO1xuIl19
