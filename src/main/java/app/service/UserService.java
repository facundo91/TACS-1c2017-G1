/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import app.model.dto.RespuestaDto;
import app.model.odb.Actor;
import app.model.odb.Credencial;
import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import java.io.IOException;
import java.util.List;
import org.json.JSONException;

/**
 *
 * @author Facundo
 */
public interface UserService {

    void borrarTodo();

    void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError;

    void desmarcarActorFavorito(String token, String id_actor);

    RespuestaDto marcarActorFavorito(String token, Actor actor) throws JSONException, IOException;

    List<User> obtenerUsuarios();

    List<String> rankingDeActoresPorMayorRepeticion(String token, String idlistaDePeliculas);

    List<Actor> verActoresFavoritos(String token) throws JSONException, IOException;

    List<MovieList> verListas(String token);

    List<Movie> verPeliculasConMasDeUnActorFavorito(String token) throws JSONException, IOException;

    List<Actor> verRankingActoresFavoritos(String token) throws JSONException, IOException;
    
}
