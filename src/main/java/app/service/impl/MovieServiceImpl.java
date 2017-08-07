/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package app.service.impl;

import app.domain.Movie;
import app.repository.MovieRepository;
import app.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;

public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public Movie buscarPelicula(Long id) {
        return movieRepository.findOne(id);
    }

}
