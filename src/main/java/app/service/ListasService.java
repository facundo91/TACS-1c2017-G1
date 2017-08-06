/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import java.util.List;

/**
 *
 * @author Facundo
 */
public interface ListasService {

    void agregarItem(Movie movie, String id_list, String token);

    MovieList consultarLista(String id_list, String token);

    MovieList crearLista(String name, String token);

    void eliminarItem(String id_pelicula, String id_list, String token);

    List<Movie> interseccionEntre(String idLista1, String idLista2, String token);
    
}
