package app.repository;

import app.domain.MovieList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioDeListas extends MongoRepository<MovieList, String> {

}
