package app.web.controller;

import app.model.odb.Movie;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import app.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/movie")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping(value = "/{id}", produces = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public Movie busquedaPeliculaJson(@RequestHeader String Token, @PathVariable Long id)
            throws Exception {
        return movieService.buscarPelicula(id);
    }

}
