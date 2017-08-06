package app.service;

import app.model.odb.Movie;
import app.model.odb.User;
import app.service.impl.AdministrativoServiceImpl;
import java.util.List;

/**
 *
 * @author Facundo
 */
public interface AdministrativoService {

    User obtenerUsuario(String id);

    List<Movie> obtenerInterseccionListas(String id1, String id2);

    List<User> obtenerUsuarios();

    AdministrativoServiceImpl validarAdmin(String token);
    
}
