package app.service;

import app.domain.Movie;
import app.domain.User;
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
