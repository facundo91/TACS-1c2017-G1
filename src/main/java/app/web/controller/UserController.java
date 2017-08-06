package app.web.controller;

import app.model.dto.RespuestaDto;
import app.model.odb.Actor;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/user")
public class UserController {

    @Autowired
    private UserService servicioDeUsuario;

    @PostMapping(value = "/")
    public void crearUsuario(@RequestBody Credencial userAndPassword) throws Exception, IOException {
        servicioDeUsuario.crearNuevoUsuario(userAndPassword);
    }

    @GetMapping(value = "/ranking/{idlistaDePeliculas}", produces = "application/json")
    public List<String> rankingDeActores(@RequestHeader String token, @PathVariable String idlistaDePeliculas)
            throws JSONException, IOException {
        return servicioDeUsuario.rankingDeActoresPorMayorRepeticion(token, idlistaDePeliculas);
    }

    @PutMapping(value = "/favoriteactor/", produces = "application/json")
    public RespuestaDto marcarActorFavorito(@RequestHeader String token, @RequestBody Actor actor)
            throws Exception {
        return servicioDeUsuario.marcarActorFavorito(token, actor);
    }

    @PutMapping(value = "/favoriteactor/{id_actor}", produces = "application/json")
    public void desmarcarActorFavorito(@RequestHeader String token, @PathVariable String id_actor)
            throws Exception {
        servicioDeUsuario.desmarcarActorFavorito(token, id_actor);
    }

    @GetMapping(value = "/favoriteactor/", produces = "application/json")
    public List<Actor> verActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
        return servicioDeUsuario.verActoresFavoritos(token);
    }

    @GetMapping(value = "/favoriteactor/ranking", produces = "application/json")
    public List<Actor> verRankingActoresFavoritos(@RequestHeader String token, Model model) throws IOException {
        return servicioDeUsuario.verRankingActoresFavoritos(token);
    }

    @GetMapping(value = "/favoriteactor/movies", produces = "application/json")
    public List<Movie> verPeliculasConActoresFavoritos(@RequestHeader String token, Model model) throws Exception {
        return servicioDeUsuario.verPeliculasConMasDeUnActorFavorito(token);
    }

    @GetMapping(value = "/movieLists", produces = "application/json")
    public List<MovieList> verListas(@RequestHeader String token, Model model) throws Exception {
        return servicioDeUsuario.verListas(token);
    }

}
