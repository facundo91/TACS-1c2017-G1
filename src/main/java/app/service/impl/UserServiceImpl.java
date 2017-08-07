package app.service.impl;

import app.domain.Actor;
import app.domain.Movie;
import app.domain.Credencial;
import app.domain.ActorEnPelicula;
import app.domain.User;
import app.domain.MovieList;
import app.model.dto.RespuestaDto;
import app.repository.RepositorioDeActores;
import app.repository.RepositorioDeListas;
import app.repository.RepositorioDeUsuarios;
import app.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by Rodrigo on 08/04/2017.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private SesionesServiceImpl sesionesService;

    @Autowired
    private RepositorioDeUsuarios repositorioDeUsuarios;

    @Autowired
    private RepositorioDeListas repositorioDeListas;

    @Autowired
    private RepositorioDeActores repositorioDeActores;

    @Override
    public void crearNuevoUsuario(Credencial userAndPassword) throws ExceptionInInitializerError {
        User usuarioNuevo = User.create(userAndPassword, false);
        repositorioDeUsuarios.insert(usuarioNuevo);
    }

    @Override
    public List<User> obtenerUsuarios() {
        return repositorioDeUsuarios.findAll();
    }

    @Override
    public RespuestaDto marcarActorFavorito(String token, Actor actor) throws JSONException, IOException {
        try {
            User usuario = sesionesService.obtenerUsuarioPorToken(token);
            Optional<Actor> optActor = usuario.getFavoriteActors().stream()
                    .filter(actorFavorito -> actorFavorito.getId().equals(actor.getId())).findFirst();
            RespuestaDto rta = new RespuestaDto();
            if (optActor.isPresent()) {
                rta.setMessage("Ya lo tiene como favorito al actor  " + actor.getName());

            } else {
                repositorioDeActores.save(actor);
                usuario.getFavoriteActors().add(actor);
                repositorioDeUsuarios.save(usuario);
                rta.setMessage("Actor favorito agregado: " + actor.getName());
            }

            return rta;
        } catch (NumberFormatException e) {
            throw new RuntimeException("El id de actor posee un formato inválido.");
        }
    }

    @Override
    public void desmarcarActorFavorito(String token, String id_actor) {
        User usuario = sesionesService.obtenerUsuarioPorToken(token);
        usuario.getFavoriteActors().stream()
                .filter(actorFavorito -> actorFavorito.getId().equals(id_actor)).findFirst().ifPresent(actor -> usuario.getFavoriteActors().remove(actor));
        repositorioDeUsuarios.save(usuario);
    }

    @Override
    public List<Actor> verActoresFavoritos(String token) throws JSONException, IOException {
        User usuario = sesionesService.obtenerUsuarioPorToken(token);
        return usuario.getFavoriteActors();
    }

    @Override
    public List<Actor> verRankingActoresFavoritos(String token) throws JSONException, IOException {

        ArrayList<Actor> rankingActores = new ArrayList<>(0);
        List<User> usuarios = obtenerUsuarios();
        usuarios
                .forEach(usuario -> usuario.getFavoriteActors()
                .forEach(actor -> {
                    Optional<Actor> optActRank = rankingActores.stream()
                            .filter(actorRank -> actorRank.getId().equals(actor.getId())).findFirst();
                    if (optActRank.isPresent()) {
                        optActRank.get().incScoreRank();
                    } else {
                        actor.resetScoreRak();
                        rankingActores.add(actor);
                    }
                })
                );

        return rankingActores.stream().sorted((actor1, actor2) -> Integer.compare(actor2.getScoreRank(), actor1.getScoreRank()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Movie> verPeliculasConMasDeUnActorFavorito(String token) throws JSONException, IOException {

        User usuario = sesionesService.obtenerUsuarioPorToken(token);
        ArrayList<Movie> listPelConMasDeUnActorFav = new ArrayList<>(0);

        int cantActores = 0;

        List<Actor> actoresFav = usuario.getFavoriteActors();

        //Si solo tengo un actor o ninguno me devuelve vacio.
        if (actoresFav.size() <= 1) {
            return listPelConMasDeUnActorFav;
        }

        List<Movie> peliculas = new ArrayList<>();

        usuario.getLists().stream().map((list) -> repositorioDeListas.findOne(list.getId())).forEachOrdered((listaDePeliculas) -> {
            peliculas.addAll(listaDePeliculas.getMovies());
        });

        for (Movie movie : peliculas) {

            cantActores = actoresFav.stream().filter((actorFav) -> (movie.getCast().stream().anyMatch(x -> x.getActorId().equals(actorFav.getId())))).map((_item) -> 1).reduce(cantActores, Integer::sum);

            if (cantActores > 1) {
                listPelConMasDeUnActorFav.add(movie);
            }

            cantActores = 0;
        }

        return listPelConMasDeUnActorFav;
    }

    @Override
    public List<MovieList> verListas(String token) {
        User usuario = sesionesService.obtenerUsuarioPorToken(token);
        //esto lo hago para que me devuelva el contenido de cada lista .
        List<MovieList> listasADevolver = getListasCompletasDelUsuario(usuario);
        return listasADevolver;
    }

    private List<MovieList> getListasCompletasDelUsuario(User usuario) {
        return usuario.getLists().stream().map(movieList -> repositorioDeListas.findOne(movieList.getId())).collect(Collectors.toList());
    }

    @Override
    public List<String> rankingDeActoresPorMayorRepeticion(String token, String idlistaDePeliculas) {
        User usuario = sesionesService.obtenerUsuarioPorToken(token);

        MovieList listaDePeliculas = getListasCompletasDelUsuario(usuario).stream()
                .filter(movieList -> movieList.getId().equals(idlistaDePeliculas)).findFirst()
                .orElseThrow(() -> new RuntimeException("No existe la lista de peliculas que intenta rankear."));

        List<ActorEnPelicula> actoresEnPeliculas = obtenerTodosLosActoresEnPeliculas(listaDePeliculas.getMovies());

        Map<String, Integer> aparicionDeActores = mapearPorRepeticionesLosActoresEnPeliculas(actoresEnPeliculas);

        List<String> actoresOrdenados = aparicionDeActores.entrySet().stream()
                .sorted(Collections.reverseOrder(Map.Entry.comparingByValue())).map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return actoresOrdenados;
    }

    private Map<String, Integer> mapearPorRepeticionesLosActoresEnPeliculas(List<ActorEnPelicula> actoresEnPeliculas) {

        Map<String, Integer> aparicionDeActores = new HashMap<>();

        actoresEnPeliculas.forEach(actorEnPelicula -> evaluarApariciones(actorEnPelicula, aparicionDeActores));

        return aparicionDeActores;
    }

    private List<ActorEnPelicula> obtenerTodosLosActoresEnPeliculas(List<Movie> peliculas) {
        List<ActorEnPelicula> actoresEnPeliculas = new ArrayList<>();
        peliculas.forEach(pelicula -> actoresEnPeliculas.addAll(pelicula.getCast()));
        return actoresEnPeliculas;
    }

    private void evaluarApariciones(ActorEnPelicula actor, Map<String, Integer> aparicionDeActores) {

        try {
//            Actor actor = new Actor(idActor.toString());
            if (aparicionDeActores.containsKey(actor.getName())) {
                Integer valor = aparicionDeActores.get(actor.getName());
                aparicionDeActores.replace(actor.getName(), ++valor);
            } else {
                aparicionDeActores.put(actor.getName(), 1);
            }
        } catch (JSONException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public void borrarTodo() {
        repositorioDeUsuarios.deleteAll();
    }
}
