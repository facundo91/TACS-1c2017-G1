package app.repository;

import app.domain.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by aye on 27/05/17.
 */
public interface RepositorioDePeliculasEnListas extends MongoRepository<Movie, String> {
}
