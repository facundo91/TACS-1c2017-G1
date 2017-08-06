package app.service.impl;

import app.model.odb.Movie;
import app.model.odb.MovieList;
import app.model.odb.User;
import app.repository.RepositorioDeListas;
import app.repository.RepositorioDeUsuarios;
import app.service.AdministrativoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministrativoServiceImpl implements AdministrativoService{

    @Autowired
    private RepositorioDeUsuarios repositorioDeUsuarios;

    @Autowired
    private RepositorioDeListas repositorioDeListas;

    @Override
    public User obtenerUsuario(String id) {
        User user = repositorioDeUsuarios.findOne(id);
        user.setLists(user.getLists().stream().map(movieList -> repositorioDeListas.findOne(movieList.getId())).collect(Collectors.toList()));
        if (user == null) {
            throw new RuntimeException("No existe el usuario con id " + id);
        }
        return user;
    }

    @Override
    public List<User> obtenerUsuarios() {
        return repositorioDeUsuarios.findAll();
    }

    @Override
    public AdministrativoServiceImpl validarAdmin(String token) {
        if ("f".equals(token.substring(0, 1))) {
            throw new RuntimeException("Esta funcionalidad solo es para admins");
        }
        return this;
    }

    @Override
    public List<Movie> obtenerInterseccionListas(String id1, String id2) {
        MovieList lista1 = repositorioDeListas.findOne(id1);
        MovieList lista2 = repositorioDeListas.findOne(id2);
        List<Movie> interseccion = lista1.intersectionWith(lista2);
        return interseccion;
    }

}
