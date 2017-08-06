package app.service.impl;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repository.RepositorioDeListas;
import app.repository.RepositorioDePeliculasEnListas;
import app.repository.RepositorioDeUsuarios;
import app.service.ListasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListasServiceImpl implements ListasService {

    @Autowired
    private SesionesServiceImpl sesionesService;

    @Autowired
    private RepositorioDeListas repositorioDeListas;

    @Autowired
    private RepositorioDeUsuarios repositorioDeUsuarios;

    @Autowired
    private RepositorioDePeliculasEnListas repositorioDePeliculasEnListas;

    @Override
    public List<Movie> interseccionEntre(String idLista1, String idLista2, String token) {
        return this.consultarLista(idLista1, token).intersectionWith(this.consultarLista(idLista2, token));
    }

    @Override
    public MovieList crearLista(String name, String token) {
        MovieList list = MovieList.create(name, new ArrayList<>());
        User usuario = sesionesService.obtenerUsuarioPorToken(token);
        usuario.addList(list);
        repositorioDeListas.insert(list);
        repositorioDeUsuarios.save(usuario);
        return list;
    }

    @Override
    public void agregarItem(Movie movie, String id_list, String token) {
        this.consultarLista(id_list, token);
        MovieList lista = repositorioDeListas.findOne(id_list);
        repositorioDePeliculasEnListas.save(movie);
        lista.addMovie(movie);
        repositorioDeListas.save(lista);
    }

    @Override
    public void eliminarItem(String id_pelicula, String id_list, String token) {
        MovieList lista = this.consultarLista(id_list, token);
        Movie movie = repositorioDePeliculasEnListas.findOne(id_pelicula);
        lista.removeMovie(movie);
        repositorioDeListas.save(lista);
    }

    @Override
    public MovieList consultarLista(String id_list, String token) {
        MovieList list = repositorioDeListas.findOne(id_list);
        return sesionesService.obtenerUsuarioPorToken(token).getList(list);
    }
}
