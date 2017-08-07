package app.controller.rest;

import app.domain.Movie;
import app.domain.MovieList;
import app.service.ListasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/list")
public class ListasRestController {

    @Autowired
    private ListasService listasService;

    @GetMapping(value = "/{id_lista}")
    public MovieList consultarLista(@RequestHeader String token, @PathVariable String id_lista) throws Exception {
        return listasService.consultarLista(id_lista, token);
    }

    @PostMapping(value = "/")
    public MovieList crearLista(@RequestHeader String token, @RequestBody String nuevaLista) throws IOException {
        return listasService.crearLista(nuevaLista, token);
    }

    @PostMapping(value = "/{id_lista}/")
    public void agregarItem(@RequestHeader String token, @RequestBody Movie movie, @PathVariable String id_lista)
            throws IOException {
        listasService.agregarItem(movie, id_lista, token);
    }

    @DeleteMapping(value = "/{id_lista}/{id_pelicula}")
    public void eliminarItem(@RequestHeader String token, @PathVariable String id_lista, @PathVariable String id_pelicula)
            throws IOException {
        listasService.eliminarItem(id_pelicula, id_lista, token);
    }

    @GetMapping(value = "/intersection/{idLista1}/{idLista2}")
    public List<Movie> calcularInterseccionDe(@RequestHeader String token, @PathVariable String idLista1,
            String idLista2) throws IOException {
        return listasService.interseccionEntre(idLista1, idLista2, token);
    }

}
