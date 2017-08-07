/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service;

import app.domain.Movie;

/**
 *
 * @author Facundo
 */
public interface MovieService {

    Movie buscarPelicula(Long id);

}
